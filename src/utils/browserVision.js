import { candidateLabels } from '../data/wasteProfiles';

const labelMatchers = {
  'plastic bottle': [
    'plastic bottle',
    'water bottle',
    'soda bottle',
    'pop bottle',
    'pill bottle',
    'shampoo',
    'detergent',
    'lotion',
    'bottle',
  ],
  'plastic wrapper': [
    'plastic bag',
    'shopping bag',
    'wrapper',
    'packet',
    'pouch',
    'grocery bag',
    'trash bag',
  ],
  'glass bottle': ['glass bottle', 'wine bottle', 'beer bottle', 'wine glass'],
  cardboard: ['cardboard', 'carton', 'box', 'crate', 'milk can', 'package'],
  paper: ['paper', 'newspaper', 'notebook', 'envelope', 'book', 'comic book'],
  'metal can': ['tin can', 'metal can', 'aluminum can', 'can'],
  'banana peel': ['banana'],
  'food scraps': [
    'food',
    'orange',
    'apple',
    'pizza',
    'sandwich',
    'cake',
    'salad',
    'broccoli',
    'carrot',
    'hotdog',
    'plate',
    'bowl',
  ],
  battery: ['battery', 'car battery'],
  electronics: [
    'cell phone',
    'mobile phone',
    'phone',
    'laptop',
    'computer',
    'keyboard',
    'mouse',
    'remote',
    'television',
    'screen',
    'monitor',
    'microwave',
    'refrigerator',
    'oven',
    'toaster',
    'printer',
    'electronics',
    'device',
  ],
};

let visionModelsPromise;

function createScoreMap() {
  return candidateLabels.reduce((accumulator, label) => {
    accumulator[label] = 0;
    return accumulator;
  }, {});
}

function applyMatchScores(scores, rawText, confidence, type) {
  const normalizedText = rawText.toLowerCase();

  Object.entries(labelMatchers).forEach(([label, aliases]) => {
    const matched = aliases.some((alias) => normalizedText.includes(alias));

    if (!matched) {
      return;
    }

    const weight = type === 'detection' ? 1.15 : 0.85;
    scores[label] += confidence * weight;
  });

  if (type === 'detection' && normalizedText === 'bottle') {
    scores['plastic bottle'] += confidence * 0.55;
    scores['glass bottle'] += confidence * 0.35;
  }

  if (type === 'detection' && normalizedText === 'cup') {
    scores['plastic bottle'] += confidence * 0.18;
    scores['glass bottle'] += confidence * 0.28;
  }
}

function pickBestLabel(scores) {
  return Object.entries(scores).sort((left, right) => right[1] - left[1])[0];
}

async function loadImageElement(imageUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error('The uploaded image could not be prepared for analysis.'));
    image.src = imageUrl;
  });
}

async function loadVisionModels() {
  if (!visionModelsPromise) {
    visionModelsPromise = Promise.all([
      import('@tensorflow/tfjs'),
      import('@tensorflow/tfjs-backend-cpu'),
      import('@tensorflow/tfjs-backend-webgl'),
      import('@tensorflow-models/coco-ssd'),
      import('@tensorflow-models/mobilenet'),
    ]).then(async ([tf, , , cocoSsd, mobilenet]) => {
      try {
        await tf.setBackend('webgl');
      } catch (error) {
        await tf.setBackend('cpu');
      }

      await tf.ready();

      const [detector, classifier] = await Promise.all([
        cocoSsd.load(),
        mobilenet.load(),
      ]);

      return { detector, classifier };
    });
  }

  return visionModelsPromise;
}

export async function warmUpBrowserVision() {
  await loadVisionModels();
}

export async function classifyWithBrowserVision(imageUrl) {
  const [{ detector, classifier }, imageElement] = await Promise.all([
    loadVisionModels(),
    loadImageElement(imageUrl),
  ]);

  const [detections, classifications] = await Promise.all([
    detector.detect(imageElement, 8),
    classifier.classify(imageElement, 6),
  ]);

  const scores = createScoreMap();

  detections.forEach((prediction) => {
    applyMatchScores(scores, prediction.class, prediction.score, 'detection');
  });

  classifications.forEach((prediction) => {
    applyMatchScores(scores, prediction.className, prediction.probability, 'classification');
  });

  const [label, score] = pickBestLabel(scores);

  if (!label || score < 0.28) {
    return null;
  }

  return {
    label,
    confidence: Math.min(0.97, Math.max(0.46, score)),
    source: 'browser-vision',
  };
}
