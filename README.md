# KANA PLAY ★ 究極かなトレーニング

> **The Ultimate Japanese Kana & Vocabulary Drill Web App with Retro Arcade Neo-Brutalist Toy Catalogue Aesthetics.**

Inspired by [vedxyz/kana](https://github.com/vedxyz/kana) with enhanced **Reverse Drill (Romaji → Kana On-Screen Keypad)** and **Vocabulary (Word & Reverse Word) Drill Modes**.

---

## 🌟 Key Features

### 1. 💥 Brute Force Progressive Mode
* Introduces Kana row by row (starting from Vowels: *A-Row*, *K-Row*, *S-Row*, etc.).
* Tracks individual character mastery (streak threshold to master).
* Level up fanfare, retro 8-bit synth sounds, and confetti celebration upon mastering each row to unlock the next level!
* **No Consecutive Repeats**: Smart randomizer ensures the same kana never appears twice in a row.

### 2. ⚡ Reverse Drill Mode (Romaji → Kana Keypad)
* Question displays **Romaji** (e.g. `KA`, `SHI`).
* User selects the corresponding Japanese character from an **Interactive On-Screen Tactile Keypad**.
* **Zero Cheats**: Keys show clean textbook Japanese characters without romaji hints, forcing real active recall.
* Supports **Hiragana**, **Katakana**, **Dakuten**, and **Yōon** tables.

### 3. 📚 Japanese Word Drill (Vocab & Reverse Vocab)
* **Normal Word Mode**: Displays Japanese word (e.g., `ねこ` / `ラーメン` with Kanji & meanings) → User types the Romaji reading.
* **Reverse Word Mode**: Displays English/Indonesian meaning & Romaji → User constructs the word using the interactive Kana Keypad ([ ね ] + [ こ ]) with buffer preview, backspace, and submit.
* **Categories**: Basics & Greetings, Food & Drink, Animals, Daily Objects, Anime & Gaming, JLPT N5 Core, Nature & Seasons.

### 4. 🔊 Built-in Web Audio Retro Synthesizer & Speech
* Authentic 8-bit sound effects (ascending correct chime, error buzzer, level-up major arpeggio fanfare, mechanical tactile click).
* Web Speech Synthesis (`ja-JP`) for native Japanese audio pronunciation on every character and word.

### 5. 🎨 Retro Toy Catalogue / Neo-Brutalist Aesthetic
* Chunky bold borders, vibrant toy colors (Cobalt Blue, Toy Yellow, Crimson Red, Cream Ivory), starburst explosion badges, and tactile 3D shadow buttons.

---

## 🛠️ Tech Stack

* **Framework**: React 19 + TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS v4 + Custom Neo-Brutalist Retro Arcade System
* **Icons**: Lucide React
* **Sound**: Web Audio API Synthesizer (Zero external assets, 100% offline) + SpeechSynthesis API
* **Effects**: Canvas Confetti

---

## 🚀 Quick Start

```bash
# Clone repository
git clone git@github.com:azdharsyahputra/kana-play.git

# Navigate to directory
cd kana-play

# Install dependencies
npm install

# Run dev server
npm run dev
```

Build for production:
```bash
npm run build
```

---

## 📜 License

MIT License. Open source and free for all Japanese learners.
