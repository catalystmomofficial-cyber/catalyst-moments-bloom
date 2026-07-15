// AUTO-DERIVED from each recipe's real ingredients (see recipeData.ts).
// Categorical "this recipe is rich in X" tags — no lab values, no false precision.
// Powers stage-specific meal-plan selection (STAGE_NUTRIENT_FOCUS below).
export type KeyNutrient = 'iron' | 'folate' | 'calcium' | 'omega3' | 'choline' | 'vitaminC' | 'zinc';

export const recipeKeyNutrients: Record<string, KeyNutrient[]> = {
  "ttc-day1-hormone-smoothie": [
    "iron",
    "folate",
    "calcium",
    "omega3",
    "vitaminC"
  ],
  "ttc-day2-quinoa-power-bowl": [
    "iron",
    "folate",
    "calcium",
    "omega3",
    "vitaminC",
    "zinc"
  ],
  "ttc-day3-wild-salmon": [
    "folate",
    "omega3",
    "choline",
    "vitaminC"
  ],
  "ttc-day4-collagen-oats": [
    "calcium",
    "omega3",
    "vitaminC"
  ],
  "ttc-day5-fertility-soup": [
    "choline",
    "vitaminC"
  ],
  "ttc-day6-avocado-toast": [
    "iron",
    "folate",
    "omega3",
    "choline",
    "vitaminC",
    "zinc"
  ],
  "ttc-day7-lentil-curry": [
    "iron",
    "folate",
    "calcium",
    "vitaminC",
    "zinc"
  ],
  "ttc-day8-brazil-nut-smoothie": [
    "calcium",
    "vitaminC"
  ],
  "ttc-day9-grass-fed-steak": [
    "iron",
    "vitaminC"
  ],
  "ttc-day10-chia-pudding": [
    "calcium",
    "omega3",
    "vitaminC"
  ],
  "ttc-day11-walnut-crusted-chicken": [
    "folate",
    "calcium",
    "omega3",
    "choline",
    "vitaminC"
  ],
  "ttc-day12-fertility-salad": [
    "folate",
    "calcium",
    "vitaminC",
    "zinc"
  ],
  "ttc-day13-turkey-meatballs": [
    "iron",
    "calcium",
    "choline",
    "vitaminC"
  ],
  "ttc-day14-golden-milk": [
    "calcium",
    "vitaminC"
  ],
  "ttc-day15-cod-vegetables": [
    "choline",
    "vitaminC"
  ],
  "ttc-day16-fertility-trail-mix": [
    "iron",
    "folate",
    "calcium",
    "omega3",
    "vitaminC",
    "zinc"
  ],
  "ttc-day17-adaptogen-smoothie": [
    "calcium",
    "vitaminC",
    "zinc"
  ],
  "ttc-day18-bone-broth-risotto": [
    "vitaminC"
  ],
  "ttc-day19-coconut-curry-chicken": [
    "iron",
    "folate",
    "calcium",
    "choline",
    "vitaminC"
  ],
  "ttc-day20-fermented-vegetables": [
    "iron",
    "folate",
    "vitaminC",
    "zinc"
  ],
  "ttc-day21-matcha-latte": [
    "calcium"
  ],
  "ttc-day22-liver-detox-salad": [
    "omega3",
    "vitaminC",
    "zinc"
  ],
  "ttc-day23-grass-fed-liver": [
    "iron",
    "choline",
    "vitaminC",
    "zinc"
  ],
  "ttc-day24-fertility-fat-bombs": [
    "calcium"
  ],
  "ttc-day25-sardines-toast": [
    "iron",
    "folate",
    "calcium",
    "omega3",
    "vitaminC",
    "zinc"
  ],
  "ttc-day26-bison-sweet-potato": [
    "iron",
    "folate",
    "calcium",
    "vitaminC"
  ],
  "ttc-day27-mushroom-soup": [
    "iron",
    "folate"
  ],
  "ttc-day28-macadamia-crusted-fish": [
    "folate",
    "choline",
    "vitaminC"
  ],
  "ttc-day29-collagen-gummies": [
    "vitaminC"
  ],
  "ttc-day30-lamb-herbs": [
    "iron",
    "vitaminC",
    "zinc"
  ],
  "pregnancy-day1-ginger-smoothie": [
    "calcium",
    "vitaminC"
  ],
  "pregnancy-day2-folate-omelet": [
    "iron",
    "folate",
    "calcium",
    "choline",
    "vitaminC",
    "zinc"
  ],
  "pregnancy-day3-calcium-smoothie": [
    "iron",
    "folate",
    "calcium",
    "omega3",
    "zinc"
  ],
  "pregnancy-day4-iron-bowl": [
    "iron",
    "folate",
    "calcium",
    "vitaminC",
    "zinc"
  ],
  "pregnancy-day5-gentle-salmon": [
    "folate",
    "omega3",
    "choline",
    "vitaminC"
  ],
  "pregnancy-day6-overnight-oats": [
    "calcium",
    "omega3",
    "vitaminC"
  ],
  "pregnancy-day7-heartburn-soup": [
    "choline",
    "vitaminC"
  ],
  "pregnancy-day8-calcium-salad": [
    "iron",
    "folate",
    "calcium",
    "vitaminC",
    "zinc"
  ],
  "pregnancy-day9-gentle-turkey": [
    "iron",
    "choline"
  ],
  "pregnancy-day10-magnesium-smoothie": [
    "iron",
    "calcium",
    "zinc"
  ],
  "pregnancy-day11-prenatal-bowl": [
    "iron",
    "folate",
    "omega3",
    "choline",
    "vitaminC",
    "zinc"
  ],
  "pregnancy-day12-bone-broth": [
    "iron",
    "folate",
    "choline"
  ],
  "pregnancy-day13-sweet-potato-toast": [
    "iron",
    "folate",
    "omega3",
    "vitaminC",
    "zinc"
  ],
  "pregnancy-day14-gentle-fish": [
    "iron",
    "folate",
    "choline",
    "vitaminC"
  ],
  "pregnancy-day15-prenatal-snack-plate": [
    "calcium",
    "omega3",
    "vitaminC",
    "zinc"
  ],
  "pregnancy-day16-folate-pasta": [
    "iron",
    "folate",
    "vitaminC"
  ],
  "pregnancy-day17-calcium-chia-pudding": [
    "calcium",
    "omega3",
    "vitaminC"
  ],
  "pregnancy-day18-iron-lentil-soup": [
    "iron",
    "folate",
    "vitaminC",
    "zinc"
  ],
  "pregnancy-day19-gentle-chicken-rice": [
    "choline"
  ],
  "pregnancy-day20-prenatal-smoothie-bowl": [
    "calcium",
    "omega3",
    "vitaminC",
    "zinc"
  ],
  "pregnancy-day21-baked-sweet-potato": [
    "iron",
    "folate",
    "calcium",
    "vitaminC",
    "zinc"
  ],
  "pregnancy-day22-mild-vegetable-curry": [
    "iron",
    "folate",
    "calcium"
  ],
  "pregnancy-day23-protein-pancakes": [
    "calcium",
    "choline",
    "vitaminC",
    "zinc"
  ],
  "pregnancy-day24-calcium-parfait": [
    "calcium",
    "zinc"
  ],
  "postpartum-day1-healing-bone-broth": [
    "choline"
  ],
  "postpartum-day2-iron-rich-smoothie": [
    "iron",
    "folate",
    "calcium",
    "omega3"
  ],
  "postpartum-day3-lactation-cookies": [
    "calcium",
    "omega3",
    "choline"
  ],
  "postpartum-day4-gut-healing-stew": [
    "iron",
    "folate",
    "choline",
    "vitaminC",
    "zinc"
  ],
  "postpartum-day5-liver-power-pate": [
    "iron",
    "choline",
    "vitaminC",
    "zinc"
  ],
  "postpartum-day6-golden-milk-latte": [
    "calcium",
    "vitaminC"
  ],
  "postpartum-day7-red-meat-hash": [
    "iron",
    "folate",
    "choline",
    "vitaminC",
    "zinc"
  ],
  "postpartum-day8-salmon-quinoa-bowl": [
    "iron",
    "folate",
    "calcium",
    "omega3",
    "choline",
    "vitaminC",
    "zinc"
  ],
  "postpartum-day9-nettle-tea-blend": [
    "vitaminC"
  ],
  "postpartum-day10-collagen-rich-soup": [
    "choline"
  ],
  "postpartum-day11-iron-rich-meatballs": [
    "iron",
    "calcium",
    "choline",
    "vitaminC",
    "zinc"
  ],
  "postpartum-day12-chia-seed-pudding": [
    "calcium",
    "omega3",
    "vitaminC",
    "zinc"
  ],
  "postpartum-day13-warming-lamb-stew": [
    "iron",
    "folate",
    "vitaminC",
    "zinc"
  ],
  "postpartum-day14-seaweed-salad": [
    "folate",
    "calcium",
    "omega3"
  ],
  "postpartum-day15-coconut-rice-pudding": [
    "calcium"
  ],
  "postpartum-day16-organ-meat-pate": [
    "iron",
    "choline",
    "vitaminC",
    "zinc"
  ],
  "postpartum-day17-warming-porridge": [
    "calcium",
    "omega3"
  ],
  "postpartum-day18-healing-soup": [
    "calcium",
    "choline",
    "vitaminC"
  ],
  "postpartum-day19-iron-rich-salad": [
    "iron",
    "folate",
    "omega3",
    "vitaminC",
    "zinc"
  ],
  "postpartum-day20-nourishing-millet-bowl": [
    "calcium",
    "omega3"
  ],
  "postpartum-day21-bone-marrow-soup": [
    "vitaminC"
  ],
  "postpartum-day22-fermented-vegetables": [
    "iron",
    "folate",
    "vitaminC",
    "zinc"
  ],
  "postpartum-day23-slow-cooked-short-ribs": [
    "iron",
    "folate",
    "choline",
    "vitaminC",
    "zinc"
  ],
  "postpartum-day24-adaptogen-smoothie": [
    "calcium",
    "vitaminC"
  ],
  "postpartum-day25-kidney-strengthening-soup": [
    "iron",
    "folate",
    "calcium",
    "omega3"
  ],
  "postpartum-day26-warming-congee": [
    "calcium",
    "choline",
    "vitaminC"
  ],
  "postpartum-day27-nourishing-egg-drop-soup": [
    "calcium",
    "choline",
    "vitaminC"
  ],
  "postpartum-day28-final-nourishing-stew": [
    "iron",
    "folate",
    "calcium",
    "choline",
    "vitaminC",
    "zinc"
  ]
};

// What each stage (and pregnancy sub-stage) should prioritise.
export const STAGE_NUTRIENT_FOCUS: Record<string, KeyNutrient[]> = {
  ttc: ['folate', 'iron', 'zinc', 'omega3'],
  'pregnant-1st-trimester': ['folate', 'omega3', 'choline'],
  'pregnant-2nd-trimester': ['iron', 'calcium', 'choline', 'omega3'],
  'pregnant-3rd-trimester': ['iron', 'calcium', 'omega3', 'folate'],
  pregnant: ['folate', 'iron', 'calcium', 'omega3', 'choline'],
  postpartum: ['iron', 'vitaminC', 'omega3', 'zinc'],
};
