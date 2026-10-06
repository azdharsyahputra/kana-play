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
 * Uses off-screen rasterization with dilation tolerance & IoU shape matching.
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

  // Empty check
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

  // Ensure window & canvas are available
  if (typeof document === 'undefined') {
    return {
      score: 80,
      stars: 3,
      rating: 'great',
      feedbackTitle: 'Bagus!',
      feedbackMessage: 'Latihan menulis selesai.',
      strokeCountMatch,
      userStrokesCount,
      expectedStrokes,
      coveragePercent: 80,
      precisionPercent: 80,
    };
  }

  const RESOLUTION = 100; // 100x100 analysis grid (10,000 pixels)
  const scaleX = RESOLUTION / canvasWidth;
  const scaleY = RESOLUTION / canvasHeight;

  // 1. Render User Drawing on Offscreen Canvas A
  const canvasUser = document.createElement('canvas');
  canvasUser.width = RESOLUTION;
  canvasUser.height = RESOLUTION;
  const ctxUser = canvasUser.getContext('2d', { willReadFrequently: true });

  if (ctxUser) {
    ctxUser.clearRect(0, 0, RESOLUTION, RESOLUTION);
    ctxUser.lineCap = 'round';
    ctxUser.lineJoin = 'round';
    ctxUser.lineWidth = Math.max(5, Math.round(RESOLUTION * 0.07));
    ctxUser.strokeStyle = '#000000';

    for (const stroke of strokes) {
      if (stroke.length === 0) continue;
      if (stroke.length === 1) {
        ctxUser.beginPath();
        ctxUser.arc(stroke[0].x * scaleX, stroke[0].y * scaleY, ctxUser.lineWidth / 2, 0, Math.PI * 2);
        ctxUser.fillStyle = '#000000';
        ctxUser.fill();
      } else {
        ctxUser.beginPath();
        ctxUser.moveTo(stroke[0].x * scaleX, stroke[0].y * scaleY);
        for (let i = 1; i < stroke.length - 1; i++) {
          const xc = ((stroke[i].x + stroke[i + 1].x) / 2) * scaleX;
          const yc = ((stroke[i].y + stroke[i + 1].y) / 2) * scaleY;
          ctxUser.quadraticCurveTo(stroke[i].x * scaleX, stroke[i].y * scaleY, xc, yc);
        }
        const last = stroke[stroke.length - 1];
        ctxUser.lineTo(last.x * scaleX, last.y * scaleY);
        ctxUser.stroke();
      }
    }
  }

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
    ctxRef.font = `bold ${Math.round(RESOLUTION * 0.72)}px "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif`;
    ctxRef.fillText(targetChar, RESOLUTION / 2, RESOLUTION / 2 + RESOLUTION * 0.03);
  }

  // 3. Pixel Analysis
  let userPixelCount = 0;
  let refPixelCount = 0;
  const userPixels = new Uint8Array(RESOLUTION * RESOLUTION);
  const refPixels = new Uint8Array(RESOLUTION * RESOLUTION);

  if (ctxUser && ctxRef) {
    const userImgData = ctxUser.getImageData(0, 0, RESOLUTION, RESOLUTION).data;
    const refImgData = ctxRef.getImageData(0, 0, RESOLUTION, RESOLUTION).data;

    for (let i = 0; i < RESOLUTION * RESOLUTION; i++) {
      const alphaUser = userImgData[i * 4 + 3];
      const alphaRef = refImgData[i * 4 + 3];

      if (alphaUser > 30) {
        userPixels[i] = 1;
        userPixelCount++;
      }
      if (alphaRef > 30) {
        refPixels[i] = 1;
        refPixelCount++;
      }
    }
  }

  if (userPixelCount < 15 || refPixelCount < 15) {
    return {
      score: 15,
      stars: 1,
      rating: 'retry',
      feedbackTitle: 'Coretan Terlalu Sedikit',
      feedbackMessage: 'Coretan belum cukup untuk membentuk huruf. Coba lagi!',
      strokeCountMatch,
      userStrokesCount,
      expectedStrokes,
      coveragePercent: 10,
      precisionPercent: 10,
    };
  }

  // 4. Create Dilated Reference Mask (Tolerance Zone radius = 3px)
  const DILATION_RADIUS = 3;
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

  // How much of user ink is relevant (precision)
  const precision = hitsInTolerance / Math.max(1, userPixelCount);

  // How much of the target character did the user cover (coverage/recall)
  // Check how many dilated user pixels overlap with the reference
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

  const recall = refCovered / Math.max(1, refPixelCount);

  // 6. Compute Base Score (Harmonic F1 + Density Balance)
  const f1 = (2 * precision * recall) / Math.max(0.001, precision + recall);
  let rawScore = Math.round(f1 * 100);

  // Stroke count bonus or penalty
  if (strokeCountMatch) {
    rawScore = Math.min(100, rawScore + 6);
  } else if (Math.abs(userStrokesCount - expectedStrokes) > 2) {
    rawScore = Math.max(10, rawScore - 12);
  }

  const finalScore = Math.max(0, Math.min(100, rawScore));
  const precisionPercent = Math.round(precision * 100);
  const coveragePercent = Math.round(recall * 100);

  // Rating & Message
  let rating: 'perfect' | 'great' | 'good' | 'retry';
  let stars: 1 | 2 | 3;
  let feedbackTitle = '';
  let feedbackMessage = '';

  if (finalScore >= 78) {
    rating = 'perfect';
    stars = 3;
    feedbackTitle = 'Luar Biasa! ★★★';
    feedbackMessage = strokeCountMatch
      ? `Bentuk dan jumlah coretan (${expectedStrokes}) sangat rapi & akurat!`
      : `Bentuk sangat mirip! Target coretan standar: ${expectedStrokes}.`;
  } else if (finalScore >= 58) {
    rating = 'great';
    stars = 2;
    feedbackTitle = 'Bagus Banget! ★★';
    feedbackMessage = strokeCountMatch
      ? `Proporsi huruf sudah pas dengan ${expectedStrokes} coretan yang benar.`
      : `Proporsi sudah baik, perhatikan urutan coretan standar (${expectedStrokes} coretan).`;
  } else if (finalScore >= 38) {
    rating = 'good';
    stars = 1;
    feedbackTitle = 'Cukup Mirip! ★';
    feedbackMessage = 'Bentuk dasar sudah terlihat, terus latih lengkungan dan proporsinya.';
  } else {
    rating = 'retry';
    stars = 1;
    feedbackTitle = 'Perlu Latihan Lagi';
    feedbackMessage = 'Bandingkan dengan panduan bayangan untuk melihat posisi coretan yang tepat.';
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
    coveragePercent,
    precisionPercent,
  };
}
