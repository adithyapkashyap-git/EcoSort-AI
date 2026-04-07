import { candidateLabels, wasteProfiles } from '../data/wasteProfiles';

function getProfile(label) {
  return wasteProfiles[label] || wasteProfiles.default;
}

export function buildWasteResult({ label, confidence, imageUrl, source = 'demo' }) {
  const normalizedLabel = candidateLabels.includes(label) ? label : 'default';
  const profile = getProfile(normalizedLabel);

  return {
    id: `${normalizedLabel}-${Date.now()}`,
    imageUrl,
    detectedItem: profile.itemName,
    rawLabel: label,
    category: profile.category,
    disposalInstructions: profile.instructions,
    ecoImpactMessage: profile.ecoImpactMessage,
    badge: profile.badge,
    confidence,
    impactStats: profile.impactStats,
    source,
    scannedAt: new Date().toISOString(),
  };
}

export function buildFallbackLabel(fileName = '') {
  const normalizedName = fileName.toLowerCase();

  if (normalizedName.includes('battery')) {
    return 'battery';
  }

  if (normalizedName.includes('glass')) {
    return 'glass bottle';
  }

  if (normalizedName.includes('cardboard') || normalizedName.includes('box')) {
    return 'cardboard';
  }

  if (normalizedName.includes('paper')) {
    return 'paper';
  }

  if (normalizedName.includes('metal') || normalizedName.includes('can')) {
    return 'metal can';
  }

  if (normalizedName.includes('banana') || normalizedName.includes('food')) {
    return 'food scraps';
  }

  if (normalizedName.includes('electronic') || normalizedName.includes('device')) {
    return 'electronics';
  }

  if (normalizedName.includes('wrapper')) {
    return 'plastic wrapper';
  }

  return 'plastic bottle';
}
