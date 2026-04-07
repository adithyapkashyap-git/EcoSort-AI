export const achievements = [
  {
    id: 'seed',
    name: 'Seed Starter',
    description: 'Complete your first successful waste scan.',
    threshold: 1,
    type: 'scan',
    badge: 'SE',
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Save three sorting results to your profile.',
    threshold: 3,
    type: 'saved',
    badge: 'CL',
  },
  {
    id: 'plastic-hero',
    name: 'Plastic Hero',
    description: 'Divert at least 1 kg of plastic from mixed waste.',
    threshold: 1,
    type: 'plastic',
    badge: 'PH',
  },
  {
    id: 'impact-maker',
    name: 'Impact Maker',
    description: 'Reduce 2 kg of CO2 equivalent through better sorting.',
    threshold: 2,
    type: 'co2',
    badge: 'IM',
  },
  {
    id: 'eco-elite',
    name: 'Eco Elite',
    description: 'Reach 180 total EcoSort points.',
    threshold: 180,
    type: 'points',
    badge: 'EE',
  },
];

export const leaderboard = [
  { name: 'Ava Green', points: 420 },
  { name: 'Noah Earth', points: 385 },
  { name: 'Mia Bloom', points: 330 },
  { name: 'You', points: 0 },
];
