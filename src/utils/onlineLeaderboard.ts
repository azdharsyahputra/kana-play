import { Client, Message } from 'paho-mqtt';
import { LeaderboardPlayer, OnlineSyncPayload, PlayerProfile } from '../types/leaderboard';
import { UserStats } from '../types';
import { calculateUserPoints, getUserTitle } from './leaderboard';

const PLAYER_ID_STORAGE_KEY = 'kanadrill_player_id_v1';
const ONLINE_CACHE_STORAGE_KEY = 'kanadrill_online_players_cache_v1';
const ROOM_STORAGE_KEY = 'kanadrill_leaderboard_room_v1';

// Public MQTT Brokers with WebSockets (No backend required, completely free & serverless)
const PRIMARY_BROKER = {
  host: 'broker.hivemq.com',
  port: 8884,
  path: '/mqtt',
};

const BACKUP_BROKER = {
  host: 'broker.emqx.io',
  port: 8084,
  path: '/mqtt',
};

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

let mqttClient: Client | null = null;
let broadcastChannel: BroadcastChannel | null = null;
let currentRoom = 'global';
let connectionStatus: ConnectionStatus = 'disconnected';
let lastError: string | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let isConnecting = false;
let currentBrokerIndex = 0;

// Listeners
const playerListeners = new Set<(players: LeaderboardPlayer[]) => void>();
const statusListeners = new Set<(status: ConnectionStatus, errorMsg?: string) => void>();

// In-memory online players map: key is playerId
const onlinePlayersMap = new Map<string, LeaderboardPlayer>();

/**
 * Mendapatkan atau membuat ID unik permanen untuk pemain ini
 */
export function getOrCreatePlayerId(): string {
  if (typeof window === 'undefined') return 'user_default';
  try {
    let id = localStorage.getItem(PLAYER_ID_STORAGE_KEY);
    if (!id) {
      id = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
      localStorage.setItem(PLAYER_ID_STORAGE_KEY, id);
    }
    return id;
  } catch {
    return 'user_' + Math.random().toString(36).slice(2, 8);
  }
}

/**
 * Muat room aktif (default: 'global')
 */
export function getStoredRoom(): string {
  if (typeof window === 'undefined') return 'global';
  try {
    return localStorage.getItem(ROOM_STORAGE_KEY) || 'global';
  } catch {
    return 'global';
  }
}

export function saveStoredRoom(room: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ROOM_STORAGE_KEY, room.trim().toLowerCase() || 'global');
  } catch {}
}

/**
 * Muat cache online players sebelumnya dari localStorage
 */
function loadCachedOnlinePlayers(): LeaderboardPlayer[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ONLINE_CACHE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCachedOnlinePlayers(players: LeaderboardPlayer[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Only cache top 50 recent players
    const toSave = players.slice(0, 50);
    localStorage.setItem(ONLINE_CACHE_STORAGE_KEY, JSON.stringify(toSave));
  } catch {}
}

/**
 * Dapatkan daftar seluruh pemain online saat ini
 */
export function getOnlinePlayersList(): LeaderboardPlayer[] {
  const now = Date.now();
  const list: LeaderboardPlayer[] = [];

  for (const player of onlinePlayersMap.values()) {
    // Anggap aktif jika mengirim pembaruan dalam 90 detik terakhir
    const isLive = player.lastSeen ? now - player.lastSeen < 90_000 : false;
    list.push({
      ...player,
      isOnline: isLive,
    });
  }

  return list;
}

/**
 * Hitung jumlah pemain yang benar-benar live saat ini
 */
export function getActiveOnlineCount(): number {
  const now = Date.now();
  let count = 0;
  for (const p of onlinePlayersMap.values()) {
    if (p.lastSeen && now - p.lastSeen < 90_000) {
      count++;
    }
  }
  return count;
}

function notifyPlayersChanged() {
  const players = getOnlinePlayersList();
  saveCachedOnlinePlayers(players);
  playerListeners.forEach(listener => listener(players));
}

function notifyStatusChanged(newStatus: ConnectionStatus, err?: string) {
  connectionStatus = newStatus;
  lastError = err || null;
  statusListeners.forEach(listener => listener(newStatus, err));
}

/**
 * Format payload broadcast dari data pemain lokal
 */
export function buildMyPayload(stats: UserStats, profile: PlayerProfile, room: string): OnlineSyncPayload {
  const myId = getOrCreatePlayerId();
  const points = calculateUserPoints(stats);
  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 100;
  const title = profile.customTitle || getUserTitle(points, accuracy);

  return {
    type: 'PLAYER_UPDATE',
    room: room.trim().toLowerCase() || 'global',
    player: {
      id: myId,
      name: profile.name.trim() || 'Pemain Kana',
      avatar: profile.avatar || '🦊',
      totalPoints: points,
      totalCorrect: stats.totalCorrect || 0,
      totalAnswered: stats.totalAnswered || 0,
      accuracy,
      bestStreak: stats.bestStreak || 0,
      level: stats.bruteForceLevel || 1,
      title,
      tagline: profile.tagline || 'Latihan bersama di Kana Play!',
      updatedAt: Date.now(),
    },
  };
}

/**
 * Tangani payload yang diterima dari pemain lain (via MQTT atau BroadcastChannel)
 */
function handleIncomingPayload(payload: OnlineSyncPayload, myStats?: UserStats, myProfile?: PlayerProfile) {
  if (!payload || !payload.player) return;

  const myId = getOrCreatePlayerId();
  const incoming = payload.player;

  // Jangan proses pembaruan diri sendiri
  if (incoming.id === myId) return;

  // Pastikan berada di room yang sama
  if (payload.room && payload.room !== currentRoom) return;

  if (payload.type === 'DISCOVERY_REQUEST') {
    // Pemain baru bergabung meminta sinkronisasi, kirim info kita balik
    if (myStats && myProfile) {
      broadcastPlayerScore(myStats, myProfile);
    }
    return;
  }

  if (payload.type === 'PLAYER_LEAVE') {
    if (onlinePlayersMap.has(incoming.id)) {
      const existing = onlinePlayersMap.get(incoming.id)!;
      onlinePlayersMap.set(incoming.id, {
        ...existing,
        isOnline: false,
      });
      notifyPlayersChanged();
    }
    return;
  }

  // Update or insert player
  const leaderboardPlayer: LeaderboardPlayer = {
    id: incoming.id,
    name: incoming.name,
    avatar: incoming.avatar || '🎮',
    title: incoming.title || getUserTitle(incoming.totalPoints, incoming.accuracy),
    isUser: false,
    totalPoints: incoming.totalPoints,
    totalCorrect: incoming.totalCorrect,
    totalAnswered: incoming.totalAnswered,
    accuracy: incoming.accuracy,
    bestStreak: incoming.bestStreak,
    level: incoming.level,
    badge: '🟢 Live Online',
    tagline: incoming.tagline || 'Pemain online terhubung',
    isOnline: true,
    lastSeen: incoming.updatedAt || Date.now(),
  };

  onlinePlayersMap.set(incoming.id, leaderboardPlayer);
  notifyPlayersChanged();
}

/**
 * Inisialisasi sinkronisasi online serverless (MQTT WebSocket + BroadcastChannel)
 */
export function initOnlineLeaderboard(
  initialStats: UserStats,
  initialProfile: PlayerProfile,
  roomName?: string
) {
  if (typeof window === 'undefined') return;

  if (roomName) {
    currentRoom = roomName.trim().toLowerCase() || 'global';
    saveStoredRoom(currentRoom);
  } else {
    currentRoom = getStoredRoom();
  }

  // 1. Muat cache pemain online sebelumnya agar tampilan langsung ada data
  const cached = loadCachedOnlinePlayers();
  for (const p of cached) {
    onlinePlayersMap.set(p.id, { ...p, isOnline: false });
  }

  // 2. Siapkan BroadcastChannel untuk sinkronisasi tab lokal seketika
  if ('BroadcastChannel' in window) {
    try {
      if (broadcastChannel) broadcastChannel.close();
      broadcastChannel = new BroadcastChannel(`kanaplay_room_${currentRoom}`);
      broadcastChannel.onmessage = (event) => {
        handleIncomingPayload(event.data, initialStats, initialProfile);
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported or blocked:', e);
    }
  }

  // 3. Hubungkan ke Public MQTT Broker
  connectToBroker(initialStats, initialProfile);

  // 4. Set interval pembersihan status online (tiap 15 detik)
  if (!heartbeatTimer) {
    heartbeatTimer = setInterval(() => {
      notifyPlayersChanged();
      // Kirim heartbeat diri sendiri agar status live tetap hijau
      broadcastPlayerScore(initialStats, initialProfile);
    }, 25_000);
  }
}

/**
 * Koneksi ke broker MQTT publik via Secure WebSocket
 */
function connectToBroker(stats: UserStats, profile: PlayerProfile) {
  if (isConnecting || (mqttClient && mqttClient.isConnected())) return;

  const broker = currentBrokerIndex === 0 ? PRIMARY_BROKER : BACKUP_BROKER;
  const myId = getOrCreatePlayerId();
  const clientId = `kana_${myId}_${Math.random().toString(36).slice(2, 6)}`;

  isConnecting = true;
  notifyStatusChanged('connecting');

  try {
    mqttClient = new Client(broker.host, broker.port, broker.path, clientId);

    mqttClient.onConnectionLost = (responseObject) => {
      isConnecting = false;
      notifyStatusChanged('disconnected', responseObject.errorMessage);

      // Coba fallback broker jika gagal
      setTimeout(() => {
        currentBrokerIndex = currentBrokerIndex === 0 ? 1 : 0;
        connectToBroker(stats, profile);
      }, 5_000);
    };

    mqttClient.onMessageArrived = (message: Message) => {
      try {
        const payload: OnlineSyncPayload = JSON.parse(message.payloadString);
        handleIncomingPayload(payload, stats, profile);
      } catch (err) {
        console.warn('Invalid message payload:', err);
      }
    };

    mqttClient.connect({
      useSSL: true,
      timeout: 8,
      keepAliveInterval: 30,
      cleanSession: true,
      onSuccess: () => {
        isConnecting = false;
        notifyStatusChanged('connected');

        // Subscribe ke topik room
        const topic = `kanaplay/v1/room/${currentRoom}`;
        mqttClient?.subscribe(topic, {
          onSuccess: () => {
            // Broadcast status kita & minta info dari pemain lain
            broadcastPlayerScore(stats, profile);
            sendDiscoveryRequest();
          },
          onFailure: (err) => {
            console.warn('Failed to subscribe:', err);
          },
        });
      },
      onFailure: (err) => {
        isConnecting = false;
        notifyStatusChanged('disconnected', err.errorMessage);

        // Coba broker cadangan
        currentBrokerIndex = currentBrokerIndex === 0 ? 1 : 0;
        setTimeout(() => connectToBroker(stats, profile), 4_000);
      },
    });
  } catch (err: unknown) {
    isConnecting = false;
    const msg = err instanceof Error ? err.message : String(err);
    notifyStatusChanged('disconnected', msg);
  }
}

/**
 * Minta semua pemain online yang aktif untuk mengirim skor mereka
 */
function sendDiscoveryRequest() {
  const payload: OnlineSyncPayload = {
    type: 'DISCOVERY_REQUEST',
    room: currentRoom,
    player: {
      id: getOrCreatePlayerId(),
      name: '',
      avatar: '',
      totalPoints: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      accuracy: 0,
      bestStreak: 0,
      level: 1,
      title: '',
      updatedAt: Date.now(),
    },
  };

  // Broadcast via local channel
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(payload);
    } catch {}
  }

  // Broadcast via MQTT
  if (mqttClient && mqttClient.isConnected()) {
    try {
      const topic = `kanaplay/v1/room/${currentRoom}`;
      const msg = new Message(JSON.stringify(payload));
      msg.destinationName = topic;
      mqttClient.send(msg);
    } catch {}
  }
}

/**
 * Siarkan pembaruan skor dan profil kita ke seluruh pemain online
 */
export function broadcastPlayerScore(stats: UserStats, profile: PlayerProfile): void {
  const payload = buildMyPayload(stats, profile, currentRoom);

  // 1. BroadcastChannel (Same machine / multi-tab)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(payload);
    } catch {}
  }

  // 2. MQTT WebSocket (Real-time online cloud broker)
  if (mqttClient && mqttClient.isConnected()) {
    try {
      const topic = `kanaplay/v1/room/${currentRoom}`;
      const msg = new Message(JSON.stringify(payload));
      msg.destinationName = topic;
      mqttClient.send(msg);
    } catch (err) {
      console.warn('Failed to broadcast via MQTT:', err);
    }
  }
}

/**
 * Ganti room (misal: 'global', 'kelas-jepang', dll)
 */
export function changeRoom(newRoom: string, stats: UserStats, profile: PlayerProfile): void {
  const cleanRoom = newRoom.trim().toLowerCase() || 'global';
  if (cleanRoom === currentRoom) return;

  // Unsubscribe old room topic
  if (mqttClient && mqttClient.isConnected()) {
    try {
      mqttClient.unsubscribe(`kanaplay/v1/room/${currentRoom}`);
    } catch {}
  }

  currentRoom = cleanRoom;
  saveStoredRoom(cleanRoom);
  onlinePlayersMap.clear();
  notifyPlayersChanged();

  // Reset BroadcastChannel
  if ('BroadcastChannel' in window) {
    try {
      if (broadcastChannel) broadcastChannel.close();
      broadcastChannel = new BroadcastChannel(`kanaplay_room_${currentRoom}`);
      broadcastChannel.onmessage = (event) => {
        handleIncomingPayload(event.data, stats, profile);
      };
    } catch {}
  }

  // Re-subscribe to new room topic
  if (mqttClient && mqttClient.isConnected()) {
    try {
      mqttClient.subscribe(`kanaplay/v1/room/${currentRoom}`, {
        onSuccess: () => {
          broadcastPlayerScore(stats, profile);
          sendDiscoveryRequest();
        },
      });
    } catch {}
  } else {
    connectToBroker(stats, profile);
  }
}

/**
 * Dapatkan nama room yang sedang aktif
 */
export function getCurrentRoom(): string {
  return currentRoom;
}

/**
 * Dapatkan status koneksi saat ini
 */
export function getCurrentStatus(): ConnectionStatus {
  return connectionStatus;
}

export function getLastError(): string | null {
  return lastError;
}

/**
 * Berlangganan perubahan daftar pemain online
 */
export function subscribeOnlinePlayers(callback: (players: LeaderboardPlayer[]) => void): () => void {
  playerListeners.add(callback);
  callback(getOnlinePlayersList());
  return () => {
    playerListeners.delete(callback);
  };
}

/**
 * Berlangganan perubahan status koneksi
 */
export function subscribeConnectionStatus(
  callback: (status: ConnectionStatus, errorMsg?: string) => void
): () => void {
  statusListeners.add(callback);
  callback(connectionStatus, lastError || undefined);
  return () => {
    statusListeners.delete(callback);
  };
}

/**
 * Paksa rekoneksi
 */
export function reconnectOnline(stats: UserStats, profile: PlayerProfile): void {
  if (mqttClient) {
    try {
      mqttClient.disconnect();
    } catch {}
  }
  isConnecting = false;
  connectToBroker(stats, profile);
}

