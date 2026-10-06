import { getKanaStrokeInfo } from '../data/kanaStrokeData';

export interface Point {
  x: number;
  y: number;
}

export type Stroke = Point[];

export interface EvaluationResult {
  score: number; // 0 to 100
  stars: 1 | 2 | 3;
  rating: 'perfect' | 'great' | 'good' | 'retry';
  feedbackTitle: string;
  feedbackMessage: string;
  strokeCountMatch: boolean;
  userStrokesCount: number;
  expectedStrokes: number;
  coveragePercent: number;
  precisionPercent: number;
}

/**
 * Evaluates user drawn strokes against the authentic target kana character.
 * Uses center-aligned rasterization with human-friendly dilation tolerance.
 */
export function evaluateKanaDrawing(
  strokes: Stroke[],
  targetChar: string,
  canvasWidth: number,
  canvasHeight: number
): EvaluationResult {
  const strokeInfo = getKanaStrokeInfo(targetChar);
  const expectedStrokes = strokeInfo.strokes;
  const userStrokesCount = strokes.length;
  const strokeCountMatch = userStrokesCount === expectedStrokes;

  // 1. Empty or minimal check
  if (strokes.length === 0 || strokes.every(s => s.length === 0)) {
    return {
      score: 0,
      stars: 1,
      rating: 'retry',
      feedbackTitle: 'Belum Ada Coretan',
      feedbackMessage: 'Tulis huruf di atas kanvas terlebih dahulu sebelum memeriksa.',
      strokeCountMatch: false,
      userStrokesCount: 0,
      expectedStrokes,
      coveragePercent: 0,
      precisionPercent: 0,
    };
  }

  // Count total points drawn
  let totalPoints = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const s of strokes) {
    for (const p of s) {
      totalPoints++;
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
  }

  const userWidth = maxX - minX;
  const userHeight = maxY - minY;

  // Scribble or dot check
  if (totalPoints < 4 || userWidth < 20 || userHeight < 20) {
    return {
      score: 15,
      stars: 1,
      rating: 'retry',
      feedbackTitle: 'Coretan Terlalu Sedikit',
      feedbackMessage: 'Coretan belum cukup untuk membentuk huruf. Coba tulis lebih jelas!',
      strokeCountMatch: false,
      userStrokesCount,
      expectedStrokes,
      coveragePercent: 10,
      precisionPercent: 15,
    };
  }

  // Fallback for SSR
  if (typeof document === 'undefined') {
    return {
      score: 85,
      stars: 3,
      rating: 'perfect',
      feedbackTitle: 'Bagus!',
      feedbackMessage: 'Latihan menulis selesai.',
      strokeCountMatch: true,
      userStrokesCount,
      expectedStrokes,
      coveragePercent: 85,
      precisionPercent: 85,
    };
  }

  const RESOLUTION = 100; // 100x100 analysis grid

  // 2. Render Reference Target Character on Offscreen Canvas B
  const canvasRef = document.createElement('canvas');
  canvasRef.width = RESOLUTION;
  canvasRef.height = RESOLUTION;
  const ctxRef = canvasRef.getContext('2d', { willReadFrequently: true });

  if (ctxRef) {
    ctxRef.clearRect(0, 0, RESOLUTION, RESOLUTION);
    ctxRef.fillStyle = '#000000';
    ctxRef.textAlign = 'center';
    ctxRef.textBaseline = 'middle';
    ctxRef.font = `bold 68px "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif`;
    ctxRef.fillText(targetChar, RESOLUTION / 2, RESOLUTION / 2);
  }

  // Find reference kana bounding box
  let refMinX = RESOLUTION;
  let refMinY = RESOLUTION;
  let refMaxX = 0;
  let refMaxY = 0;
  let refPixelCount = 0;
  const refPixels = new Uint8Array(RESOLUTION * RESOLUTION);

  if (ctxRef) {
    const refData = ctxRef.getImageData(0, 0, RESOLUTION, RESOLUTION).data;
    for (let y = 0; y < RESOLUTION; y++) {
      for (let x = 0; x < RESOLUTION; x++) {
        const idx = (y * RESOLUTION + x) * 4 + 3;
        if (refData[idx] > 30) {
          refPixels[y * RESOLUTION + x] = 1;
          refPixelCount++;
          if (x < refMinX) refMinX = x;
          if (x > refMaxX) refMaxX = x;
          if (y < refMinY) refMinY = y;
          if (y > refMaxY) refMaxY = y;
        }
      }
    }
  }

  // 3. Render User Drawing Normalized & Centered
  // Align user drawing center with canvas center to compensate for slight handwriting offsets
  const userCenterX = (minX + maxX) / 2;
  const userCenterY = (minY + maxY) / 2;
  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;

  // Subtle center correction: shift up to 60% towards center so natural offsets don't penalize
  const offsetX = (canvasCenterX - userCenterX) * 0.6;
  const offsetY = (canvasCenterY - userCenterY) * 0.6;

  const scaleX = RESOLUTION / canvasWidth;
  const scaleY = RESOLUTION / canvasHeight;

  const canvasUser = document.createElement('canvas');
  canvasUser.width = RESOLUTION;
  canvasUser.height = RESOLUTION;
  const ctxUser = canvasUser.getContext('2d', { willReadFrequently: true });

  if (ctxUser) {
    ctxUser.clearRect(0, 0, RESOLUTION, RESOLUTION);
    ctxUser.lineCap = 'round';
    ctxUser.lineJoin = 'round';
    ctxUser.lineWidth = 7;
    ctxUser.strokeStyle = '#000000';

    for (const stroke of strokes) {
      if (stroke.length === 0) continue;
      if (stroke.length === 1) {
        ctxUser.beginPath();
        const px = (stroke[0].x + offsetX) * scaleX;
        const py = (stroke[0].y + offsetY) * scaleY;
        ctxUser.arc(px, py, 3.5, 0, Math.PI * 2);
        ctxUser.fillStyle = '#000000';
        ctxUser.fill();
      } else {
        ctxUser.beginPath();
        const startX = (stroke[0].x + offsetX) * scaleX;
        const startY = (stroke[0].y + offsetY) * scaleY;
        ctxUser.moveTo(startX, startY);
        for (let i = 1; i < stroke.length - 1; i++) {
          const xc = (((stroke[i].x + stroke[i + 1].x) / 2) + offsetX) * scaleX;
          const yc = (((stroke[i].y + stroke[i + 1].y) / 2) + offsetY) * scaleY;
          const currX = (stroke[i].x + offsetX) * scaleX;
          const currY = (stroke[i].y + offsetY) * scaleY;
          ctxUser.quadraticCurveTo(currX, currY, xc, yc);
        }
        const last = stroke[stroke.length - 1];
        ctxUser.lineTo((last.x + offsetX) * scaleX, (last.y + offsetY) * scaleY);
        ctxUser.stroke();
      }
    }
  }

  let userPixelCount = 0;
  const userPixels = new Uint8Array(RESOLUTION * RESOLUTION);

  if (ctxUser) {
    const userData = ctxUser.getImageData(0, 0, RESOLUTION, RESOLUTION).data;
    for (let i = 0; i < RESOLUTION * RESOLUTION; i++) {
      if (userData[i * 4 + 3] > 30) {
        userPixels[i] = 1;
        userPixelCount++;
      }
    }
  }

  // 4. Human-friendly Dilation Tolerance (Radius = 6px on 100x100 resolution)
  const DILATION_RADIUS = 6;
  const refDilated = new Uint8Array(RESOLUTION * RESOLUTION);

  for (let y = 0; y < RESOLUTION; y++) {
    for (let x = 0; x < RESOLUTION; x++) {
      if (refPixels[y * RESOLUTION + x] === 1) {
        for (let dy = -DILATION_RADIUS; dy <= DILATION_RADIUS; dy++) {
          for (let dx = -DILATION_RADIUS; dx <= DILATION_RADIUS; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (nx >= 0 && nx < RESOLUTION && ny >= 0 && ny < RESOLUTION) {
              refDilated[ny * RESOLUTION + nx] = 1;
            }
          }
        }
      }
    }
  }

  // 5. Calculate Overlap, Coverage, and Precision
  let hitsInTolerance = 0;
  for (let i = 0; i < RESOLUTION * RESOLUTION; i++) {
    if (userPixels[i] === 1 && refDilated[i] === 1) {
      hitsInTolerance++;
    }
  }

  // Precision: fraction of user ink inside character tolerance
  const precision = hitsInTolerance / Math.max(1, userPixelCount);

  // Dilate user drawing to evaluate character coverage
  const userDilated = new Uint8Array(RESOLUTION * RESOLUTION);
  for (let y = 0; y < RESOLUTION; y++) {
    for (let x = 0; x < RESOLUTION; x++) {
      if (userPixels[y * RESOLUTION + x] === 1) {
        for (let dy = -DILATION_RADIUS; dy <= DILATION_RADIUS; dy++) {
          for (let dx = -DILATION_RADIUS; dx <= DILATION_RADIUS; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (nx >= 0 && nx < RESOLUTION && ny >= 0 && ny < RESOLUTION) {
              userDilated[ny * RESOLUTION + nx] = 1;
            }
          }
        }
      }
    }
  }

  let refCovered = 0;
  for (let i = 0; i < RESOLUTION * RESOLUTION; i++) {
    if (refPixels[i] === 1 && userDilated[i] === 1) {
      refCovered++;
    }
  }

  // Recall / Coverage: fraction of target kana strokes covered
  const recall = refCovered / Math.max(1, refPixelCount);

  // Harmonic shape score
  const f1 = (2 * precision * recall) / Math.max(0.001, precision + recall);
  let rawScore = Math.round(f1 * 100);

  // Stroke count bonus: accurate stroke count awards significant bonus
  if (strokeCountMatch) {
    rawScore = Math.min(100, rawScore + 10);
  } else if (Math.abs(userStrokesCount - expectedStrokes) === 1) {
    // Tolerant to connected strokes (e.g. handwriting cursive)
    rawScore = Math.min(100, rawScore + 3);
  } else {
    // Excessive or missing strokes penalty
    rawScore = Math.max(15, rawScore - 12);
  }

  const finalScore = Math.max(10, Math.min(100, rawScore));
  const precisionPercent = Math.round(precision * 100);
  const coveragePercent = Math.round(recall * 100);

  let rating: 'perfect' | 'great' | 'good' | 'retry';
  let stars: 1 | 2 | 3;
  let feedbackTitle = '';
  let feedbackMessage = '';

  if (finalScore >= 70) {
    if (finalScore >= 85) {
      rating = 'perfect';
      stars = 3;
      feedbackTitle = 'Luar Biasa! ★★★';
      feedbackMessage = strokeCountMatch
        ? `Bentuk dan ${expectedStrokes} coretan sangat rapi & akurat!`
        : `Bentuk sangat mirip! Target standar: ${expectedStrokes} coretan.`;
    } else {
      rating = 'great';
      stars = 2;
      feedbackTitle = 'Bagus Banget! ★★';
      feedbackMessage = strokeCountMatch
        ? `Proporsi huruf pas dengan ${expectedStrokes} coretan yang benar.`
        : `Proporsi sudah baik. Standar: ${expectedStrokes} coretan.`;
    }
  } else if (finalScore >= 45) {
    rating = 'good';
    stars = 1;
    feedbackTitle = 'Cukup Mirip';
    feedbackMessage = 'Bentuk dasar sudah terlihat, perhatikan posisi lengkungan dan panjang garis.';
  } else {
    rating = 'retry';
    stars = 1;
    feedbackTitle = 'Perlu Latihan Lagi';
    feedbackMessage = 'Bandingkan dengan bayangan panduan untuk melihat posisi garis yang pas.';
  }

  return {
    score: finalScore,
    stars,
    rating,
    feedbackTitle,
    feedbackMessage,
    strokeCountMatch,
    userStrokesCount,
    expectedStrokes,
    coveragePercent: coveragePercent,
    precisionPercent: precisionPercent,
  };
}
