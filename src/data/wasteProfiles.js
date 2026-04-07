export const wasteProfiles = {
  'plastic bottle': {
    itemName: 'Plastic Bottle',
    category: 'Plastic Recycling',
    instructions: [
      'Empty the liquid and give it a quick rinse.',
      'Keep the cap attached if your local recycling accepts it.',
      'Place it in the dry recyclables bin.',
    ],
    ecoImpactMessage: 'Recycling bottles keeps valuable plastic in circulation and reduces virgin plastic demand.',
    badge: 'Plastic Saver',
    impactStats: {
      plasticSavedKg: 0.28,
      co2ReducedKg: 0.54,
      points: 35,
    },
  },
  'plastic wrapper': {
    itemName: 'Plastic Wrapper',
    category: 'Flexible Plastic',
    instructions: [
      'Check whether soft plastics are accepted in your local collection stream.',
      'If not accepted, route it to a store drop-off or specialized plastics point.',
      'Keep it dry and free of food residue.',
    ],
    ecoImpactMessage: 'Soft plastics need separate handling, but proper routing keeps them out of mixed waste streams.',
    badge: 'Sorting Pro',
    impactStats: {
      plasticSavedKg: 0.12,
      co2ReducedKg: 0.2,
      points: 24,
    },
  },
  'glass bottle': {
    itemName: 'Glass Bottle',
    category: 'Glass Recycling',
    instructions: [
      'Rinse the bottle and remove leftover liquid.',
      'Separate lids if your municipality asks for it.',
      'Place it in the glass recycling stream.',
    ],
    ecoImpactMessage: 'Glass is highly recyclable and can be remade repeatedly without significant material loss.',
    badge: 'Loop Maker',
    impactStats: {
      plasticSavedKg: 0,
      co2ReducedKg: 0.32,
      points: 28,
    },
  },
  cardboard: {
    itemName: 'Cardboard',
    category: 'Paper and Cardboard',
    instructions: [
      'Flatten the cardboard to save sorting space.',
      'Remove greasy or food-soiled sections.',
      'Add it to the paper recycling pile.',
    ],
    ecoImpactMessage: 'Clean cardboard is one of the easiest materials to recover and reuse at scale.',
    badge: 'Fiber Hero',
    impactStats: {
      plasticSavedKg: 0,
      co2ReducedKg: 0.22,
      points: 22,
    },
  },
  paper: {
    itemName: 'Paper',
    category: 'Paper Recycling',
    instructions: [
      'Keep the paper dry and clean.',
      'Remove plastic laminates or heavy contamination.',
      'Place it in the paper recycling stream.',
    ],
    ecoImpactMessage: 'Paper recycling lowers landfill pressure and supports a strong fiber recovery loop.',
    badge: 'Fiber Hero',
    impactStats: {
      plasticSavedKg: 0,
      co2ReducedKg: 0.18,
      points: 20,
    },
  },
  'metal can': {
    itemName: 'Metal Can',
    category: 'Metal Recycling',
    instructions: [
      'Rinse the can and remove residue.',
      'Crush it lightly only if your local rules allow.',
      'Place it in the recycling bin with metals.',
    ],
    ecoImpactMessage: 'Metal recovery saves significant energy compared with producing new metal from raw ore.',
    badge: 'Circular Collector',
    impactStats: {
      plasticSavedKg: 0,
      co2ReducedKg: 0.41,
      points: 30,
    },
  },
  'banana peel': {
    itemName: 'Banana Peel',
    category: 'Organic Waste',
    instructions: [
      'Send it to home compost if available.',
      'Use the community organics or green waste bin when composting locally is not possible.',
      'Keep it separate from plastics and dry recyclables.',
    ],
    ecoImpactMessage: 'Composting organics returns nutrients to soil and reduces methane from landfill disposal.',
    badge: 'Compost Champion',
    impactStats: {
      plasticSavedKg: 0,
      co2ReducedKg: 0.16,
      points: 18,
    },
  },
  'food scraps': {
    itemName: 'Food Scraps',
    category: 'Organic Waste',
    instructions: [
      'Place scraps in a compost caddy or organics bin.',
      'Drain excess liquid before disposal.',
      'Avoid mixing organics with plastic packaging.',
    ],
    ecoImpactMessage: 'Organic diversion reduces methane emissions and creates useful soil inputs.',
    badge: 'Compost Champion',
    impactStats: {
      plasticSavedKg: 0,
      co2ReducedKg: 0.14,
      points: 16,
    },
  },
  battery: {
    itemName: 'Battery',
    category: 'Hazardous and E-Waste',
    instructions: [
      'Do not place batteries in general waste or household recycling.',
      'Tape the battery terminals if the battery is damaged or exposed.',
      'Take it to a certified battery or e-waste collection point.',
    ],
    ecoImpactMessage: 'Safe battery disposal prevents fires and keeps heavy metals out of landfills and waterways.',
    badge: 'Hazard Guard',
    impactStats: {
      plasticSavedKg: 0,
      co2ReducedKg: 0.27,
      points: 40,
    },
  },
  electronics: {
    itemName: 'Small Electronics',
    category: 'E-Waste',
    instructions: [
      'Do not discard electronics in mixed waste.',
      'Wipe personal data if the item stores information.',
      'Route it through an e-waste or take-back center.',
    ],
    ecoImpactMessage: 'E-waste recycling recovers metals and reduces toxic leakage from landfill disposal.',
    badge: 'Hazard Guard',
    impactStats: {
      plasticSavedKg: 0.09,
      co2ReducedKg: 0.48,
      points: 45,
    },
  },
  default: {
    itemName: 'Mixed Waste Item',
    category: 'Needs Manual Review',
    instructions: [
      'Check the material label or local waste guide.',
      'Separate removable recyclable parts if possible.',
      'Use a nearby sorting center when the item is unclear.',
    ],
    ecoImpactMessage: 'When an item is uncertain, manual review prevents contamination in the recycling stream.',
    badge: 'Sorting Pro',
    impactStats: {
      plasticSavedKg: 0.04,
      co2ReducedKg: 0.08,
      points: 12,
    },
  },
};

export const candidateLabels = [
  'plastic bottle',
  'plastic wrapper',
  'glass bottle',
  'cardboard',
  'paper',
  'metal can',
  'banana peel',
  'food scraps',
  'battery',
  'electronics',
];
