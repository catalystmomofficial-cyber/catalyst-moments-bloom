import { ContentItem } from '@/hooks/useContentFilter';

interface Recipe extends ContentItem {
  prepTime: string;
  image: string;
  servings?: number;
  difficulty?: string;
  ingredients?: string[];
  instructions?: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    iron?: number;
    calcium?: number;
    folate?: number;
    iodine?: number;
  };
}

interface MealPlan extends ContentItem {
  duration: string;
  recipeCount: number;
  avgPrepTime: string;
  image: string;
  recipes?: Recipe[];
}

export const recipes: Recipe[] = [
  // TTC RECIPES - 30 hormone-balancing, fertility-boosting recipes
  {
    id: 'ttc-day1-hormone-smoothie',
    title: 'Hormone-Balancing Berry Smoothie',
    description: 'Antioxidant-rich smoothie with maca root to balance hormones and support egg quality',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1638436684761-367dbfead4f3',
    category: 'Breakfast',
    tags: ['Hormone Balance', 'Antioxidants', 'Maca', 'Quick'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 cup spinach',
      '1/2 avocado',
      '1 cup mixed berries',
      '1 banana',
      '1 cup unsweetened almond milk',
      '1 tbsp almond butter',
      '1 tsp maca powder',
      '1 tbsp chia seeds',
      '1 tsp raw honey'
    ],
    instructions: [
      'Add almond milk and spinach to blender',
      'Add avocado, banana, and berries',
      'Add almond butter, maca powder, and chia seeds',
      'Blend on high until completely smooth',
      'Add honey to taste, blend briefly',
      'Pour into glass and drink immediately for maximum nutrient absorption'
    ],
    nutrition: {
      calories: 385,
      protein: 12,
      carbs: 48,
      fat: 18,
      fiber: 15,
      folate: 220
    }
  },
  {
    id: 'ttc-day2-quinoa-power-bowl',
    title: 'Fertility Quinoa Power Bowl',
    description: 'Complete protein bowl with zinc-rich pumpkin seeds and fertility-boosting vegetables',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Lunch',
    tags: ['Zinc Rich', 'Complete Protein', 'Anti-inflammatory'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '1 cup quinoa',
      '2 cups bone broth',
      '1 sweet potato, cubed',
      '2 cups baby spinach',
      '1/2 avocado, sliced',
      '1/4 cup pumpkin seeds',
      '1/4 cup hemp hearts',
      '2 tbsp olive oil',
      '1 lemon, juiced',
      '1 tbsp tahini',
      'Sea salt and pepper'
    ],
    instructions: [
      'Cook quinoa in bone broth for 15 minutes until fluffy',
      'Roast sweet potato cubes at 400°F for 20 minutes',
      'Massage spinach with a pinch of salt until wilted',
      'Whisk olive oil, lemon juice, and tahini for dressing',
      'Layer quinoa, spinach, and roasted sweet potato in bowls',
      'Top with avocado, pumpkin seeds, and hemp hearts',
      'Drizzle with dressing and season to taste'
    ],
    nutrition: {
      calories: 485,
      protein: 18,
      carbs: 52,
      fat: 24,
      fiber: 12,
      iron: 6.8
    }
  },
  {
    id: 'ttc-day3-wild-salmon',
    title: 'Wild Salmon with Asparagus',
    description: 'Omega-3 rich salmon supporting reproductive health with hormone-balancing asparagus',
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1476127390620-9731f2a46f44',
    category: 'Dinner',
    tags: ['Omega-3', 'DHA', 'Hormone Support'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '2 wild salmon fillets (6oz each)',
      '1 lb asparagus spears',
      '2 tbsp grass-fed butter',
      '2 cloves garlic, minced',
      '1 lemon, sliced',
      '2 tbsp fresh dill',
      'Sea salt and black pepper',
      '1 tbsp capers'
    ],
    instructions: [
      'Preheat oven to 425°F',
      'Season salmon with salt, pepper, and dill',
      'Place on parchment-lined baking sheet with lemon slices',
      'Trim asparagus and toss with melted butter and garlic',
      'Add asparagus to same pan as salmon',
      'Bake for 12-15 minutes until salmon flakes easily',
      'Garnish with capers and serve immediately'
    ],
    nutrition: {
      calories: 420,
      protein: 42,
      carbs: 8,
      fat: 24,
      fiber: 4
    }
  },
  {
    id: 'ttc-day4-collagen-oats',
    title: 'Collagen Overnight Oats',
    description: 'Gut-healing overnight oats with collagen peptides to support reproductive health',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea',
    category: 'Breakfast',
    tags: ['Gut Health', 'Collagen', 'Make Ahead'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1/2 cup rolled oats',
      '1 scoop unflavored collagen peptides',
      '1 tbsp chia seeds',
      '1 cup coconut milk',
      '1 tbsp almond butter',
      '1 tsp vanilla extract',
      '1 tsp cinnamon',
      '1/2 cup blueberries',
      '1 tbsp chopped walnuts'
    ],
    instructions: [
      'Mix oats, collagen, and chia seeds in jar',
      'Whisk coconut milk with almond butter until smooth',
      'Add vanilla and cinnamon to milk mixture',
      'Pour over oats and stir well',
      'Refrigerate overnight or at least 4 hours',
      'Top with blueberries and walnuts before serving'
    ],
    nutrition: {
      calories: 425,
      protein: 22,
      carbs: 38,
      fat: 22,
      fiber: 12
    }
  },
  {
    id: 'ttc-day5-fertility-soup',
    title: 'Warming Fertility Bone Broth',
    description: 'Deeply nourishing bone broth with warming spices to support circulation and vitality',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Soups',
    tags: ['Warming', 'Bone Broth', 'Circulation'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '6 cups grass-fed bone broth',
      '1 inch fresh ginger, sliced',
      '2 carrots, diced',
      '2 celery stalks, diced',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '1 cup cooked chicken, shredded',
      '2 tbsp coconut oil',
      '1 tsp turmeric',
      'Sea salt and pepper',
      'Fresh cilantro for garnish'
    ],
    instructions: [
      'Heat coconut oil in large pot over medium heat',
      'Sauté onion, carrots, celery until softened',
      'Add garlic, ginger, and turmeric, cook 1 minute',
      'Pour in bone broth and bring to gentle simmer',
      'Add shredded chicken and simmer 15 minutes',
      'Season with salt and pepper to taste',
      'Serve hot garnished with fresh cilantro'
    ],
    nutrition: {
      calories: 185,
      protein: 18,
      carbs: 8,
      fat: 8,
      fiber: 2
    }
  },
  {
    id: 'ttc-day6-avocado-toast',
    title: 'Fertility Avocado Toast',
    description: 'Nutrient-dense avocado toast with sprouted grain bread and fertility-boosting toppings',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
    category: 'Breakfast',
    tags: ['Healthy Fats', 'Folate', 'Quick'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '2 slices sprouted grain bread',
      '1 ripe avocado',
      '2 pasture-raised eggs',
      '1 tbsp hemp hearts',
      '1 tbsp pumpkin seeds',
      '1 tsp everything bagel seasoning',
      '1 lemon, juiced',
      'Red pepper flakes',
      'Sea salt'
    ],
    instructions: [
      'Toast bread until golden brown',
      'Mash avocado with lemon juice and sea salt',
      'Soft boil eggs for 6-7 minutes, then peel',
      'Spread avocado mixture on toast',
      'Top each slice with sliced egg',
      'Sprinkle with hemp hearts, pumpkin seeds, and seasoning',
      'Finish with red pepper flakes if desired'
    ],
    nutrition: {
      calories: 465,
      protein: 22,
      carbs: 32,
      fat: 28,
      fiber: 15,
      folate: 180
    }
  },
  {
    id: 'ttc-day7-lentil-curry',
    title: 'Warming Lentil Curry',
    description: 'Protein-rich red lentil curry with warming spices to boost circulation and nourish blood',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
    category: 'Dinner',
    tags: ['Plant Protein', 'Warming Spices', 'Iron Rich'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '1 cup red lentils',
      '1 can coconut milk',
      '2 cups vegetable broth',
      '1 onion, diced',
      '3 cloves garlic, minced',
      '1 inch ginger, minced',
      '2 tsp curry powder',
      '1 tsp turmeric',
      '1/2 tsp cinnamon',
      '2 cups spinach',
      '2 tbsp coconut oil',
      'Sea salt and pepper'
    ],
    instructions: [
      'Heat coconut oil in large pot',
      'Sauté onion until translucent',
      'Add garlic, ginger, and spices, cook 1 minute',
      'Add lentils, coconut milk, and broth',
      'Bring to boil, then simmer 15 minutes',
      'Stir in spinach until wilted',
      'Season with salt and pepper, serve over rice'
    ],
    nutrition: {
      calories: 385,
      protein: 16,
      carbs: 28,
      fat: 22,
      fiber: 12,
      iron: 5.2
    }
  },
  {
    id: 'ttc-day8-brazil-nut-smoothie',
    title: 'Selenium Brazil Nut Smoothie',
    description: 'Selenium-rich smoothie with Brazil nuts to support thyroid function and egg quality',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1638436684761-367dbfead4f3',
    category: 'Breakfast',
    tags: ['Selenium', 'Thyroid Support', 'Antioxidants'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '2 Brazil nuts (soaked overnight)',
      '1 cup coconut milk',
      '1/2 banana',
      '1 cup mango chunks',
      '1 tbsp coconut butter',
      '1 tsp vanilla extract',
      '1 tbsp collagen powder',
      '1 tsp ashwagandha powder',
      'Ice cubes'
    ],
    instructions: [
      'Soak Brazil nuts overnight, then drain',
      'Add all ingredients to high-speed blender',
      'Blend until completely smooth and creamy',
      'Add ice if desired consistency is thinner',
      'Pour into glass and enjoy immediately',
      'Note: Limit to 2 Brazil nuts daily for optimal selenium'
    ],
    nutrition: {
      calories: 395,
      protein: 18,
      carbs: 32,
      fat: 24,
      fiber: 8
    }
  },
  {
    id: 'ttc-day9-grass-fed-steak',
    title: 'Grass-Fed Steak with Sweet Potato',
    description: 'Iron-rich grass-fed beef with roasted sweet potato to support healthy blood and energy',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
    category: 'Dinner',
    tags: ['Heme Iron', 'B-Vitamins', 'Grounding'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '2 grass-fed ribeye steaks (6oz each)',
      '2 medium sweet potatoes',
      '4 cups arugula',
      '2 tbsp grass-fed butter',
      '2 tbsp olive oil',
      '2 cloves garlic, minced',
      '1 tbsp fresh rosemary',
      'Sea salt and black pepper',
      '1 lemon, juiced'
    ],
    instructions: [
      'Preheat oven to 425°F for sweet potatoes',
      'Pierce sweet potatoes and roast 45 minutes',
      'Season steaks with salt, pepper, and rosemary',
      'Heat cast iron skillet over high heat',
      'Sear steaks 3-4 minutes per side for medium-rare',
      'Add butter and garlic to pan, baste steaks',
      'Serve steaks over arugula with sweet potato'
    ],
    nutrition: {
      calories: 565,
      protein: 38,
      carbs: 28,
      fat: 32,
      iron: 8.5
    }
  },
  {
    id: 'ttc-day10-chia-pudding',
    title: 'Hormone-Balancing Chia Pudding',
    description: 'Omega-3 rich chia pudding with adaptogens to support stress and hormone balance',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c',
    category: 'Breakfast',
    tags: ['Omega-3', 'Adaptogens', 'Make Ahead'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '1/4 cup chia seeds',
      '1 cup coconut milk',
      '1 tbsp maple syrup',
      '1 tsp vanilla extract',
      '1/2 tsp maca powder',
      '1/4 tsp ashwagandha powder',
      '1/2 cup berries',
      '2 tbsp chopped almonds',
      'Pinch of sea salt'
    ],
    instructions: [
      'Whisk chia seeds with coconut milk in bowl',
      'Add maple syrup, vanilla, maca, and ashwagandha',
      'Whisk again to prevent clumping',
      'Let sit 5 minutes, whisk again',
      'Refrigerate at least 2 hours or overnight',
      'Serve topped with berries and almonds'
    ],
    nutrition: {
      calories: 285,
      protein: 8,
      carbs: 22,
      fat: 18,
      fiber: 12
    }
  },
  {
    id: 'ttc-day11-walnut-crusted-chicken',
    title: 'Walnut-Crusted Chicken',
    description: 'Omega-3 rich walnut coating on organic chicken with fertility-supporting herbs',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
    category: 'Dinner',
    tags: ['Omega-3', 'Clean Protein', 'Herb-Crusted'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '4 organic chicken breasts',
      '1 cup walnuts, finely chopped',
      '1/2 cup almond flour',
      '2 tbsp fresh thyme',
      '2 tbsp fresh rosemary',
      '2 eggs, beaten',
      '3 tbsp olive oil',
      '1 bunch broccolini',
      'Sea salt and pepper'
    ],
    instructions: [
      'Preheat oven to 375°F',
      'Mix walnuts, almond flour, herbs, salt, and pepper',
      'Dip chicken in beaten eggs, then walnut mixture',
      'Heat olive oil in oven-safe skillet',
      'Sear chicken 3 minutes per side',
      'Transfer to oven for 15-20 minutes',
      'Steam broccolini and serve alongside'
    ],
    nutrition: {
      calories: 485,
      protein: 42,
      carbs: 8,
      fat: 32,
      fiber: 6
    }
  },
  {
    id: 'ttc-day12-fertility-salad',
    title: 'Rainbow Fertility Salad',
    description: 'Colorful salad packed with fertility-boosting nutrients and antioxidants',
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Lunch',
    tags: ['Antioxidants', 'Raw Foods', 'Nutrient Dense'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '6 cups mixed greens',
      '1 beet, spiralized',
      '1 carrot, spiralized',
      '1/2 cucumber, sliced',
      '1/4 cup pomegranate seeds',
      '1/4 cup sunflower seeds',
      '2 oz goat cheese',
      '3 tbsp olive oil',
      '1 tbsp apple cider vinegar',
      '1 tsp Dijon mustard',
      'Sea salt and pepper'
    ],
    instructions: [
      'Spiralize beet and carrot using spiralizer',
      'Arrange mixed greens in large bowls',
      'Top with spiralized vegetables and cucumber',
      'Sprinkle with pomegranate seeds and sunflower seeds',
      'Whisk olive oil, vinegar, and mustard for dressing',
      'Drizzle with dressing and crumble goat cheese on top'
    ],
    nutrition: {
      calories: 325,
      protein: 12,
      carbs: 18,
      fat: 24,
      fiber: 8
    }
  },
  {
    id: 'ttc-day13-turkey-meatballs',
    title: 'Herb Turkey Meatballs',
    description: 'Clean protein meatballs with herbs and served over zucchini noodles',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5',
    category: 'Dinner',
    tags: ['Clean Protein', 'Low Carb', 'Herb-Rich'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '1 lb ground turkey (organic)',
      '1 egg',
      '1/4 cup almond flour',
      '2 cloves garlic, minced',
      '2 tbsp fresh basil, chopped',
      '2 tbsp fresh parsley',
      '3 large zucchini, spiralized',
      '2 cups marinara sauce',
      '2 tbsp olive oil',
      'Sea salt and pepper'
    ],
    instructions: [
      'Mix turkey, egg, almond flour, garlic, and herbs',
      'Form into 16 meatballs',
      'Heat olive oil in large skillet',
      'Brown meatballs on all sides',
      'Add marinara sauce, simmer 15 minutes',
      'Sauté zucchini noodles for 2-3 minutes',
      'Serve meatballs over zucchini noodles'
    ],
    nutrition: {
      calories: 385,
      protein: 28,
      carbs: 15,
      fat: 24,
      fiber: 6
    }
  },
  {
    id: 'ttc-day14-golden-milk',
    title: 'Golden Milk Latte',
    description: 'Anti-inflammatory golden milk with adaptogens to support hormone balance',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344',
    category: 'Beverages',
    tags: ['Anti-inflammatory', 'Adaptogens', 'Warming'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 cup coconut milk',
      '1 tsp turmeric powder',
      '1/2 tsp ginger powder',
      '1/4 tsp cinnamon',
      'Pinch of black pepper',
      '1 tsp coconut oil',
      '1 tbsp collagen powder',
      '1 tsp raw honey',
      'Pinch of sea salt'
    ],
    instructions: [
      'Heat coconut milk in small saucepan',
      'Whisk in turmeric, ginger, cinnamon, and pepper',
      'Simmer gently for 5 minutes',
      'Remove from heat, whisk in coconut oil',
      'Add collagen powder and whisk until smooth',
      'Sweeten with honey and add pinch of salt'
    ],
    nutrition: {
      calories: 185,
      protein: 12,
      carbs: 8,
      fat: 14,
      fiber: 2
    }
  },
  {
    id: 'ttc-day15-cod-vegetables',
    title: 'Herb-Baked Cod with Vegetables',
    description: 'Clean white fish with roasted rainbow vegetables for gentle, nourishing dinner',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1476127390620-9731f2a46f44',
    category: 'Dinner',
    tags: ['Clean Protein', 'Gentle', 'Colorful Vegetables'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '2 cod fillets (6oz each)',
      '1 bell pepper, sliced',
      '1 zucchini, sliced',
      '1 red onion, sliced',
      '2 cups cherry tomatoes',
      '3 tbsp olive oil',
      '2 tbsp fresh herbs (dill, parsley)',
      '2 cloves garlic, minced',
      '1 lemon, sliced',
      'Sea salt and pepper'
    ],
    instructions: [
      'Preheat oven to 400°F',
      'Toss vegetables with 2 tbsp olive oil, salt, and pepper',
      'Spread on baking sheet, roast 20 minutes',
      'Season cod with herbs, garlic, remaining oil',
      'Place cod over vegetables with lemon slices',
      'Bake additional 12-15 minutes until fish flakes'
    ],
    nutrition: {
      calories: 365,
      protein: 32,
      carbs: 15,
      fat: 18,
      fiber: 5
    }
  },
  {
    id: 'ttc-day16-fertility-trail-mix',
    title: 'Fertility Power Trail Mix',
    description: 'Nutrient-dense mix of nuts, seeds, and antioxidant-rich additions',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60',
    category: 'Snacks',
    tags: ['Healthy Fats', 'Portable', 'No Cook'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 8,
    difficulty: 'Easy',
    ingredients: [
      '1/2 cup raw almonds',
      '1/2 cup raw walnuts',
      '1/4 cup pumpkin seeds',
      '1/4 cup sunflower seeds',
      '2 tbsp cacao nibs',
      '2 tbsp goji berries',
      '1 tbsp coconut flakes',
      'Pinch of sea salt'
    ],
    instructions: [
      'Combine all ingredients in large bowl',
      'Mix well to distribute evenly',
      'Store in airtight container',
      'Serve 1/4 cup portions as needed',
      'Keep refrigerated for freshness',
      'Perfect for on-the-go fertility support'
    ],
    nutrition: {
      calories: 185,
      protein: 6,
      carbs: 8,
      fat: 15,
      fiber: 4
    }
  },
  {
    id: 'ttc-day17-adaptogen-smoothie',
    title: 'Adaptogen Power Smoothie',
    description: 'Stress-fighting smoothie with multiple adaptogens to support fertility',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1638436684761-367dbfead4f3',
    category: 'Breakfast',
    tags: ['Adaptogens', 'Stress Support', 'Hormone Balance'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 cup cashew milk',
      '1/2 frozen banana',
      '1 cup frozen berries',
      '1 tbsp almond butter',
      '1 tsp maca powder',
      '1/2 tsp ashwagandha',
      '1/2 tsp rhodiola',
      '1 tbsp collagen powder',
      '1 tsp vanilla extract'
    ],
    instructions: [
      'Add cashew milk and almond butter to blender',
      'Add frozen banana and berries',
      'Add all adaptogen powders and collagen',
      'Add vanilla extract',
      'Blend on high until completely smooth',
      'Pour into glass and enjoy for sustained energy'
    ],
    nutrition: {
      calories: 325,
      protein: 16,
      carbs: 28,
      fat: 16,
      fiber: 8
    }
  },
  {
    id: 'ttc-day18-bone-broth-risotto',
    title: 'Nourishing Bone Broth Risotto',
    description: 'Creamy cauliflower risotto made with bone broth for deep nourishment',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5',
    category: 'Dinner',
    tags: ['Bone Broth', 'Gut Healing', 'Comfort Food'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '1 large head cauliflower, riced',
      '4 cups grass-fed bone broth',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '1/2 cup white wine (optional)',
      '2 tbsp grass-fed butter',
      '2 tbsp olive oil',
      '1/2 cup grated parmesan',
      '2 tbsp fresh herbs',
      'Sea salt and pepper'
    ],
    instructions: [
      'Rice cauliflower in food processor',
      'Heat olive oil in large pan',
      'Sauté onion until translucent',
      'Add garlic, cook 1 minute',
      'Add cauliflower rice, stir to coat',
      'Gradually add warm bone broth, stirring constantly',
      'Finish with butter, parmesan, and herbs'
    ],
    nutrition: {
      calories: 285,
      protein: 18,
      carbs: 12,
      fat: 18,
      fiber: 6
    }
  },
  {
    id: 'ttc-day19-coconut-curry-chicken',
    title: 'Coconut Curry Chicken',
    description: 'Anti-inflammatory curry with coconut milk and warming spices',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
    category: 'Dinner',
    tags: ['Anti-inflammatory', 'Warming', 'One Pot'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '1.5 lbs organic chicken thighs',
      '1 can coconut milk',
      '2 tbsp curry powder',
      '1 tbsp ginger, minced',
      '3 cloves garlic, minced',
      '1 onion, diced',
      '1 bell pepper, diced',
      '2 cups spinach',
      '2 tbsp coconut oil',
      'Sea salt and pepper'
    ],
    instructions: [
      'Season chicken with salt, pepper, and half the curry powder',
      'Heat coconut oil in large pot',
      'Brown chicken on both sides, remove',
      'Sauté onion and bell pepper',
      'Add garlic, ginger, remaining curry powder',
      'Add coconut milk, return chicken to pot',
      'Simmer 20 minutes, add spinach at end'
    ],
    nutrition: {
      calories: 425,
      protein: 35,
      carbs: 12,
      fat: 28,
      fiber: 4
    }
  },
  {
    id: 'ttc-day20-fermented-vegetables',
    title: 'Probiotic Bowl with Fermented Vegetables',
    description: 'Gut-healing bowl with sauerkraut, kimchi, and prebiotic fiber',
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Lunch',
    tags: ['Probiotics', 'Gut Health', 'Prebiotic'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '4 cups mixed greens',
      '1/2 cup sauerkraut',
      '1/4 cup kimchi',
      '1 cup cooked quinoa',
      '1/2 avocado, sliced',
      '2 tbsp pumpkin seeds',
      '2 tbsp olive oil',
      '1 tbsp apple cider vinegar',
      '1 tsp Dijon mustard',
      'Sea salt and pepper'
    ],
    instructions: [
      'Layer mixed greens in bowls',
      'Add quinoa as base',
      'Top with sauerkraut and kimchi',
      'Add avocado slices and pumpkin seeds',
      'Whisk olive oil, vinegar, and mustard',
      'Drizzle with dressing and season'
    ],
    nutrition: {
      calories: 365,
      protein: 12,
      carbs: 28,
      fat: 24,
      fiber: 12
    }
  },
  {
    id: 'ttc-day21-matcha-latte',
    title: 'Fertility Matcha Latte',
    description: 'Antioxidant-rich matcha latte with collagen and adaptogens',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344',
    category: 'Beverages',
    tags: ['Antioxidants', 'Calm Energy', 'Collagen'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 tsp ceremonial grade matcha',
      '1 cup coconut milk',
      '1 tbsp collagen powder',
      '1 tsp coconut butter',
      '1/2 tsp vanilla extract',
      '1 tsp raw honey',
      '1/4 tsp ashwagandha powder',
      'Pinch of sea salt'
    ],
    instructions: [
      'Whisk matcha with 2 tbsp hot water until smooth',
      'Heat coconut milk in small saucepan',
      'Whisk in collagen powder until dissolved',
      'Add matcha mixture to warm milk',
      'Whisk in coconut butter, vanilla, and ashwagandha',
      'Sweeten with honey and add pinch of salt'
    ],
    nutrition: {
      calories: 165,
      protein: 12,
      carbs: 8,
      fat: 10,
      fiber: 2
    }
  },
  {
    id: 'ttc-day22-liver-detox-salad',
    title: 'Liver-Supporting Detox Salad',
    description: 'Bitter greens and liver-supporting foods to optimize hormone metabolism',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Lunch',
    tags: ['Liver Support', 'Detox', 'Bitter Greens'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '4 cups arugula',
      '2 cups dandelion greens',
      '1 grapefruit, segmented',
      '1/4 cup chopped walnuts',
      '2 tbsp hemp hearts',
      '1/4 cup fresh mint',
      '3 tbsp olive oil',
      '1 tbsp lemon juice',
      '1 tsp Dijon mustard',
      'Sea salt and pepper'
    ],
    instructions: [
      'Combine arugula and dandelion greens',
      'Add grapefruit segments and herbs',
      'Sprinkle with walnuts and hemp hearts',
      'Whisk olive oil, lemon juice, and mustard',
      'Toss with dressing just before serving',
      'The bitter greens support natural detox pathways'
    ],
    nutrition: {
      calories: 285,
      protein: 8,
      carbs: 15,
      fat: 24,
      fiber: 6
    }
  },
  {
    id: 'ttc-day23-grass-fed-liver',
    title: 'Grass-Fed Liver with Onions',
    description: 'Nutrient-dense organ meat with caramelized onions for maximum fertility nutrition',
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
    category: 'Dinner',
    tags: ['Organ Meat', 'Iron Rich', 'B-Vitamins'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '1 lb grass-fed beef liver',
      '2 large onions, sliced',
      '3 tbsp grass-fed butter',
      '2 tbsp coconut flour',
      '1 cup bone broth',
      '2 tbsp fresh thyme',
      '4 cups mashed cauliflower',
      'Sea salt and pepper'
    ],
    instructions: [
      'Slice liver into thin pieces, pat dry',
      'Season with salt and pepper, dust with coconut flour',
      'Caramelize onions in butter over low heat, 15 minutes',
      'Remove onions, increase heat',
      'Quickly sear liver 2-3 minutes per side',
      'Deglaze pan with bone broth, return onions',
      'Serve over mashed cauliflower with thyme'
    ],
    nutrition: {
      calories: 485,
      protein: 42,
      carbs: 18,
      fat: 24,
      iron: 15.2
    }
  },
  {
    id: 'ttc-day24-fertility-fat-bombs',
    title: 'Hormone-Balancing Fat Bombs',
    description: 'Nutrient-dense fat bombs with maca and cacao for hormone support',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c',
    category: 'Snacks',
    tags: ['Healthy Fats', 'Hormone Support', 'Make Ahead'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 12,
    difficulty: 'Easy',
    ingredients: [
      '1/2 cup coconut butter',
      '1/4 cup cacao powder',
      '2 tbsp coconut oil',
      '1 tbsp maca powder',
      '1 tbsp almond butter',
      '1 tsp vanilla extract',
      '2 tbsp maple syrup',
      'Pinch of sea salt',
      'Chopped almonds for topping'
    ],
    instructions: [
      'Melt coconut butter and coconut oil gently',
      'Whisk in cacao powder and maca until smooth',
      'Add almond butter, vanilla, maple syrup, and salt',
      'Pour into silicone molds or ice cube trays',
      'Top with chopped almonds',
      'Refrigerate until firm, about 2 hours'
    ],
    nutrition: {
      calories: 125,
      protein: 3,
      carbs: 6,
      fat: 11,
      fiber: 3
    }
  },
  {
    id: 'ttc-day25-sardines-toast',
    title: 'Sardines on Sourdough Toast',
    description: 'Omega-3 rich sardines on fermented sourdough with fertility-boosting toppings',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
    category: 'Lunch',
    tags: ['Omega-3', 'Small Fish', 'Fermented Bread'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '2 slices sourdough bread',
      '1 can wild sardines in olive oil',
      '1/2 avocado, mashed',
      '2 tbsp capers',
      '1/4 red onion, thinly sliced',
      '2 tbsp fresh dill',
      '1 lemon, juiced',
      'Red pepper flakes',
      'Sea salt and pepper'
    ],
    instructions: [
      'Toast sourdough bread until golden',
      'Mash avocado with lemon juice and salt',
      'Spread avocado on toast',
      'Top with sardines, breaking into pieces',
      'Add capers, red onion, and dill',
      'Finish with red pepper flakes and pepper'
    ],
    nutrition: {
      calories: 385,
      protein: 22,
      carbs: 24,
      fat: 24,
      fiber: 8
    }
  },
  {
    id: 'ttc-day26-bison-sweet-potato',
    title: 'Grass-Fed Bison with Sweet Potato',
    description: 'Lean, nutrient-dense bison with roasted sweet potato and greens',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
    category: 'Dinner',
    tags: ['Lean Protein', 'Iron Rich', 'Wild Game'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '2 grass-fed bison steaks (6oz each)',
      '2 sweet potatoes, cubed',
      '4 cups kale, chopped',
      '2 tbsp avocado oil',
      '2 cloves garlic, minced',
      '1 tbsp fresh rosemary',
      '1 tbsp balsamic vinegar',
      'Sea salt and pepper'
    ],
    instructions: [
      'Preheat oven to 425°F',
      'Toss sweet potato with 1 tbsp oil, salt, pepper',
      'Roast sweet potato 25 minutes',
      'Season bison with rosemary, salt, pepper',
      'Heat remaining oil in cast iron skillet',
      'Sear bison 3-4 minutes per side',
      'Sauté kale with garlic, deglaze with vinegar'
    ],
    nutrition: {
      calories: 465,
      protein: 38,
      carbs: 28,
      fat: 22,
      iron: 6.8
    }
  },
  {
    id: 'ttc-day27-mushroom-soup',
    title: 'Adaptogenic Mushroom Soup',
    description: 'Immune-supporting soup with medicinal mushrooms and bone broth',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Soups',
    tags: ['Immune Support', 'Adaptogens', 'Mushrooms'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '6 cups grass-fed bone broth',
      '2 cups mixed mushrooms (shiitake, maitake)',
      '1 cup baby spinach',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '1 tbsp ginger, minced',
      '2 tbsp coconut oil',
      '1 tbsp coconut aminos',
      '1 tsp reishi powder',
      'Green onions for garnish'
    ],
    instructions: [
      'Heat coconut oil in large pot',
      'Sauté onion until translucent',
      'Add garlic and ginger, cook 1 minute',
      'Add mushrooms, cook until tender',
      'Pour in bone broth, bring to simmer',
      'Add reishi powder and coconut aminos',
      'Stir in spinach, garnish with green onions'
    ],
    nutrition: {
      calories: 145,
      protein: 12,
      carbs: 8,
      fat: 8,
      fiber: 3
    }
  },
  {
    id: 'ttc-day28-macadamia-crusted-fish',
    title: 'Macadamia-Crusted White Fish',
    description: 'Omega-rich macadamia nuts coating delicate white fish with herbs',
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1476127390620-9731f2a46f44',
    category: 'Dinner',
    tags: ['Healthy Fats', 'Clean Fish', 'Nut-Crusted'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '2 halibut fillets (6oz each)',
      '1/2 cup macadamia nuts, chopped',
      '2 tbsp coconut flour',
      '2 tbsp fresh parsley',
      '1 egg, beaten',
      '2 tbsp coconut oil',
      '1 bunch asparagus',
      '1 lemon, sliced',
      'Sea salt and pepper'
    ],
    instructions: [
      'Preheat oven to 400°F',
      'Mix macadamia nuts, coconut flour, and parsley',
      'Dip fish in beaten egg, then nut mixture',
      'Heat coconut oil in oven-safe skillet',
      'Sear fish 3 minutes, flip carefully',
      'Add asparagus to pan with lemon slices',
      'Bake 10-12 minutes until fish flakes'
    ],
    nutrition: {
      calories: 485,
      protein: 36,
      carbs: 8,
      fat: 34,
      fiber: 6
    }
  },
  {
    id: 'ttc-day29-collagen-gummies',
    title: 'Fertility Collagen Gummies',
    description: 'Gut-healing collagen gummies with berry flavor and probiotics',
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c',
    category: 'Snacks',
    tags: ['Collagen', 'Gut Health', 'Make Ahead'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 20,
    difficulty: 'Easy',
    ingredients: [
      '1 cup berry juice (no sugar added)',
      '4 tbsp grass-fed gelatin',
      '2 tbsp collagen powder',
      '2 tbsp raw honey',
      '1 tsp vanilla extract',
      '1 probiotic capsule, opened',
      'Pinch of sea salt'
    ],
    instructions: [
      'Heat berry juice in small saucepan',
      'Whisk in gelatin until completely dissolved',
      'Remove from heat, whisk in collagen',
      'Add honey, vanilla, probiotic powder, and salt',
      'Pour into silicone gummy molds',
      'Refrigerate 2 hours until set'
    ],
    nutrition: {
      calories: 25,
      protein: 5,
      carbs: 3,
      fat: 0,
      fiber: 0
    }
  },
  {
    id: 'ttc-day30-lamb-herbs',
    title: 'Herb-Crusted Lamb with Vegetables',
    description: 'Zinc and iron-rich lamb with fresh herbs and roasted root vegetables',
    prepTime: '35 min',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
    category: 'Dinner',
    tags: ['Iron Rich', 'Zinc', 'Herb-Crusted'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '2 lbs grass-fed lamb rack',
      '3 tbsp fresh rosemary, chopped',
      '2 tbsp fresh thyme',
      '3 cloves garlic, minced',
      '3 tbsp olive oil',
      '2 carrots, chopped',
      '2 parsnips, chopped',
      '1 red onion, quartered',
      'Sea salt and pepper'
    ],
    instructions: [
      'Preheat oven to 425°F',
      'Mix herbs, garlic, and 2 tbsp oil for paste',
      'Season lamb with salt and pepper',
      'Rub herb paste all over lamb',
      'Toss vegetables with remaining oil',
      'Roast vegetables 20 minutes',
      'Sear lamb, then roast with vegetables 15 minutes'
    ],
    nutrition: {
      calories: 565,
      protein: 45,
      carbs: 15,
      fat: 32,
      iron: 8.2
    }
  },

  // PREGNANCY RECIPES - 24 folate-packed, heartburn-free recipes
  {
    id: 'pregnancy-day1-ginger-smoothie',
    title: 'Anti-Nausea Ginger Smoothie',
    description: 'Gentle smoothie with ginger and mint to calm morning sickness',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1638436684761-367dbfead4f3',
    category: 'Breakfast',
    tags: ['Anti-Nausea', 'Ginger', 'Gentle'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 cup coconut water',
      '1/2 banana',
      '1 inch fresh ginger',
      '1/2 cup mango chunks',
      '1 tbsp coconut milk',
      '1 tsp honey',
      '5 fresh mint leaves',
      'Ice cubes'
    ],
    instructions: [
      'Peel and slice fresh ginger',
      'Add all ingredients to blender',
      'Blend until completely smooth',
      'Strain if ginger pieces remain',
      'Serve immediately over ice',
      'Sip slowly to prevent nausea'
    ],
    nutrition: {
      calories: 165,
      protein: 2,
      carbs: 38,
      fat: 3,
      folate: 45
    }
  },
  {
    id: 'pregnancy-day2-folate-omelet',
    title: 'Folate-Rich Spinach Omelet',
    description: 'Protein-packed omelet with spinach and cheese for brain development',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
    category: 'Breakfast',
    tags: ['Folate', 'Protein', 'Brain Development'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '3 pasture-raised eggs',
      '2 cups baby spinach',
      '1/4 cup goat cheese',
      '1 tbsp olive oil',
      '1 tbsp grass-fed butter',
      '1 tbsp fresh chives',
      'Sea salt and pepper'
    ],
    instructions: [
      'Whisk eggs with salt and pepper',
      'Heat olive oil in non-stick pan',
      'Sauté spinach until wilted, remove',
      'Add butter to pan, pour in eggs',
      'Let eggs set for 30 seconds',
      'Add spinach and cheese to half',
      'Fold omelet and serve with chives'
    ],
    nutrition: {
      calories: 425,
      protein: 28,
      carbs: 4,
      fat: 32,
      folate: 195
    }
  },
  {
    id: 'pregnancy-day3-calcium-smoothie',
    title: 'Calcium-Rich Tahini Smoothie',
    description: 'Creamy smoothie with tahini and leafy greens for bone development',
    prepTime: '8 min',
    image: 'https://images.unsplash.com/photo-1616685803520-e1bb4aa5f8e4',
    category: 'Breakfast',
    tags: ['Calcium', 'Bone Development', 'Creamy'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 cup unsweetened almond milk',
      '1/2 cup Greek yogurt',
      '2 cups spinach',
      '1/2 banana',
      '2 tbsp tahini',
      '1 tbsp chia seeds',
      '1 tsp vanilla',
      '1 tsp maple syrup',
      'Ice as needed'
    ],
    instructions: [
      'Add almond milk and spinach to blender first',
      'Add yogurt, banana, and tahini',
      'Add chia seeds, vanilla, and maple syrup',
      'Blend until completely smooth',
      'Add ice for desired consistency',
      'Pour into glass and enjoy for calcium boost'
    ],
    nutrition: {
      calories: 385,
      protein: 18,
      carbs: 32,
      fat: 22,
      calcium: 520
    }
  },
  {
    id: 'pregnancy-day4-iron-bowl',
    title: 'Iron-Rich Quinoa Bowl',
    description: 'Powerhouse bowl with quinoa, lentils, and vitamin C for iron absorption',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253',
    category: 'Lunch',
    tags: ['Iron', 'Vitamin C', 'Complete Nutrition'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '1 cup quinoa',
      '1/2 cup red lentils',
      '1 sweet potato, roasted',
      '2 cups kale, massaged',
      '1/4 cup pumpkin seeds',
      '2 tbsp tahini',
      '1 orange, juiced',
      '2 tbsp olive oil',
      '1 clove garlic, minced',
      'Sea salt and pepper'
    ],
    instructions: [
      'Cook quinoa in vegetable broth',
      'Cook lentils separately until tender',
      'Roast sweet potato at 400°F for 25 minutes',
      'Massage kale with salt until tender',
      'Whisk tahini, orange juice, oil, and garlic',
      'Layer quinoa, lentils, kale, sweet potato',
      'Top with pumpkin seeds and dressing'
    ],
    nutrition: {
      calories: 485,
      protein: 20,
      carbs: 58,
      fat: 20,
      iron: 7.8,
      fiber: 14
    }
  },
  {
    id: 'pregnancy-day5-gentle-salmon',
    title: 'Gentle Poached Salmon',
    description: 'Soft poached salmon with herbs, perfect for sensitive stomachs',
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1476127390620-9731f2a46f44',
    category: 'Dinner',
    tags: ['Omega-3', 'Gentle', 'DHA'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '2 salmon fillets (5oz each)',
      '2 cups vegetable broth',
      '1 lemon, sliced',
      '2 tbsp fresh dill',
      '1 bay leaf',
      '1 lb baby potatoes',
      '2 cups steamed broccoli',
      'Sea salt and pepper'
    ],
    instructions: [
      'Bring vegetable broth to gentle simmer',
      'Add lemon slices, dill, and bay leaf',
      'Season salmon with salt and pepper',
      'Poach salmon in broth 8-10 minutes',
      'Steam baby potatoes until tender',
      'Steam broccoli until bright green',
      'Serve salmon with vegetables and herbs'
    ],
    nutrition: {
      calories: 445,
      protein: 32,
      carbs: 28,
      fat: 22,
      fiber: 6
    }
  },
  {
    id: 'pregnancy-day6-overnight-oats',
    title: 'Prenatal Overnight Oats',
    description: 'Fiber-rich oats with berries and nuts to support digestion',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea',
    category: 'Breakfast',
    tags: ['Fiber', 'Make Ahead', 'Digestive Health'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1/2 cup rolled oats',
      '1 tbsp chia seeds',
      '1 tbsp ground flaxseed',
      '1 cup oat milk',
      '1 tbsp almond butter',
      '1 tsp vanilla extract',
      '1 tsp maple syrup',
      '1/2 cup berries',
      '1 tbsp chopped walnuts'
    ],
    instructions: [
      'Mix oats, chia seeds, and flaxseed in jar',
      'Whisk oat milk with almond butter',
      'Add vanilla and maple syrup to milk',
      'Pour over oat mixture, stir well',
      'Refrigerate overnight or at least 4 hours',
      'Top with berries and walnuts before serving'
    ],
    nutrition: {
      calories: 385,
      protein: 12,
      carbs: 48,
      fat: 16,
      fiber: 15
    }
  },
  {
    id: 'pregnancy-day7-heartburn-soup',
    title: 'Heartburn-Friendly Chicken Soup',
    description: 'Mild, soothing soup that won\'t trigger heartburn or acid reflux',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Soups',
    tags: ['Heartburn-Friendly', 'Mild', 'Soothing'],
    journey: ['pregnant'],
    stage: ['pregnant-3rd-trimester'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '1 lb organic chicken breast',
      '6 cups low-sodium chicken broth',
      '2 carrots, diced',
      '2 celery stalks, diced',
      '1/2 cup rice',
      '1 tbsp olive oil',
      '1 bay leaf',
      '2 tbsp fresh parsley',
      'Sea salt (minimal)',
      'No pepper or spices'
    ],
    instructions: [
      'Heat olive oil in large pot',
      'Add carrots and celery, cook gently',
      'Add chicken breast and broth',
      'Bring to gentle simmer with bay leaf',
      'Cook 20 minutes until chicken is tender',
      'Shred chicken, return to pot',
      'Add rice, cook 15 minutes more',
      'Finish with fresh parsley'
    ],
    nutrition: {
      calories: 245,
      protein: 26,
      carbs: 18,
      fat: 6,
      fiber: 2
    }
  },
  {
    id: 'pregnancy-day8-calcium-salad',
    title: 'Calcium-Packed Kale Salad',
    description: 'Massaged kale salad with tahini dressing and calcium-rich ingredients',
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Lunch',
    tags: ['Calcium', 'Raw Foods', 'Nutrient Dense'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '6 cups kale, chopped',
      '1/4 cup almonds, sliced',
      '1/4 cup sesame seeds',
      '1/2 cup dried figs, chopped',
      '2 tbsp tahini',
      '2 tbsp lemon juice',
      '1 tbsp olive oil',
      '1 tsp maple syrup',
      'Sea salt',
      '1/4 cup goat cheese'
    ],
    instructions: [
      'Remove kale stems, chop leaves',
      'Massage kale with pinch of salt until tender',
      'Add almonds, sesame seeds, and figs',
      'Whisk tahini, lemon juice, oil, and maple syrup',
      'Toss salad with dressing',
      'Top with crumbled goat cheese'
    ],
    nutrition: {
      calories: 425,
      protein: 16,
      carbs: 32,
      fat: 28,
      calcium: 485,
      fiber: 10
    }
  },
  {
    id: 'pregnancy-day9-gentle-turkey',
    title: 'Gentle Turkey Meatballs',
    description: 'Soft, mild turkey meatballs with hidden vegetables for easy digestion',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5',
    category: 'Dinner',
    tags: ['Gentle', 'Hidden Vegetables', 'Protein'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '1 lb ground turkey',
      '1/2 cup grated zucchini',
      '1/4 cup grated carrot',
      '1 egg',
      '1/4 cup oat flour',
      '2 tbsp olive oil',
      '2 cups mild marinara',
      '4 cups cooked pasta',
      '2 tbsp fresh basil',
      'Sea salt (minimal)'
    ],
    instructions: [
      'Mix turkey, grated vegetables, egg, and oat flour',
      'Form into 16 small, soft meatballs',
      'Heat olive oil in large skillet',
      'Brown meatballs gently on all sides',
      'Add marinara sauce, simmer 15 minutes',
      'Serve over pasta with fresh basil',
      'Keep seasoning very mild'
    ],
    nutrition: {
      calories: 445,
      protein: 32,
      carbs: 42,
      fat: 16,
      fiber: 4
    }
  },
  {
    id: 'pregnancy-day10-magnesium-smoothie',
    title: 'Magnesium Sleep Smoothie',
    description: 'Calming smoothie with magnesium-rich ingredients to support sleep',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1638436684761-367dbfead4f3',
    category: 'Beverages',
    tags: ['Magnesium', 'Sleep Support', 'Calming'],
    journey: ['pregnant'],
    stage: ['pregnant-3rd-trimester'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 cup coconut milk',
      '1/2 banana',
      '2 tbsp cacao powder',
      '1 tbsp almond butter',
      '1 tbsp pumpkin seeds',
      '1 tsp vanilla extract',
      '1 tsp honey',
      '1/4 tsp cinnamon',
      'Ice cubes'
    ],
    instructions: [
      'Add coconut milk and banana to blender',
      'Add cacao powder and almond butter',
      'Add pumpkin seeds, vanilla, and honey',
      'Add cinnamon and ice',
      'Blend until completely smooth',
      'Enjoy 1 hour before bedtime for magnesium boost'
    ],
    nutrition: {
      calories: 325,
      protein: 8,
      carbs: 28,
      fat: 22,
      fiber: 8
    }
  },
  {
    id: 'pregnancy-day11-prenatal-bowl',
    title: 'Complete Prenatal Bowl',
    description: 'All-in-one bowl with protein, complex carbs, and prenatal superfoods',
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253',
    category: 'Lunch',
    tags: ['Complete Nutrition', 'Prenatal', 'Balanced'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '1 cup brown rice',
      '4 oz grilled chicken',
      '1 cup steamed broccoli',
      '1/2 avocado, sliced',
      '2 tbsp hemp hearts',
      '2 tbsp pumpkin seeds',
      '2 tbsp olive oil',
      '1 lemon, juiced',
      '1 tbsp nutritional yeast',
      'Sea salt and herbs'
    ],
    instructions: [
      'Cook brown rice until fluffy',
      'Grill chicken until cooked through',
      'Steam broccoli until bright green',
      'Layer rice in bowls as base',
      'Top with sliced chicken and broccoli',
      'Add avocado, hemp hearts, and pumpkin seeds',
      'Drizzle with olive oil and lemon',
      'Sprinkle with nutritional yeast'
    ],
    nutrition: {
      calories: 525,
      protein: 32,
      carbs: 45,
      fat: 26,
      fiber: 8
    }
  },
  {
    id: 'pregnancy-day12-bone-broth',
    title: 'Nourishing Pregnancy Bone Broth',
    description: 'Mineral-rich bone broth with gentle vegetables for deep nourishment',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Soups',
    tags: ['Bone Broth', 'Minerals', 'Nourishing'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '6 cups grass-fed bone broth',
      '1 cup cooked chicken, shredded',
      '2 carrots, diced small',
      '1 cup baby spinach',
      '1/2 cup rice noodles',
      '1 tbsp olive oil',
      '2 tbsp fresh parsley',
      'Sea salt (minimal)',
      '1 bay leaf'
    ],
    instructions: [
      'Heat bone broth in large pot',
      'Add bay leaf and bring to gentle simmer',
      'Add diced carrots, cook 10 minutes',
      'Add rice noodles, cook according to package',
      'Stir in shredded chicken to warm',
      'Add spinach just before serving',
      'Finish with parsley and minimal salt'
    ],
    nutrition: {
      calories: 185,
      protein: 18,
      carbs: 12,
      fat: 6,
      fiber: 2
    }
  },
  {
    id: 'pregnancy-day13-sweet-potato-toast',
    title: 'Sweet Potato Toast with Avocado',
    description: 'Nutrient-dense sweet potato slices topped with avocado and seeds',
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
    category: 'Breakfast',
    tags: ['Complex Carbs', 'Healthy Fats', 'No Gluten'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '1 large sweet potato',
      '1 ripe avocado',
      '2 tbsp hemp hearts',
      '1 tbsp pumpkin seeds',
      '1 lemon, juiced',
      '2 tbsp fresh herbs',
      'Sea salt',
      'Olive oil drizzle'
    ],
    instructions: [
      'Slice sweet potato lengthwise into 1/2 inch slices',
      'Toast sweet potato slices 12-15 minutes until tender',
      'Mash avocado with lemon juice and salt',
      'Spread avocado on warm sweet potato',
      'Top with hemp hearts and pumpkin seeds',
      'Finish with fresh herbs and oil drizzle'
    ],
    nutrition: {
      calories: 285,
      protein: 8,
      carbs: 28,
      fat: 16,
      fiber: 12
    }
  },
  {
    id: 'pregnancy-day14-gentle-fish',
    title: 'Gentle White Fish with Rice',
    description: 'Mild white fish with easily digestible rice and steamed vegetables',
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1476127390620-9731f2a46f44',
    category: 'Dinner',
    tags: ['Mild', 'Easy Digestion', 'Clean Protein'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-3rd-trimester'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '2 cod fillets (5oz each)',
      '1 cup jasmine rice',
      '2 cups green beans',
      '2 tbsp olive oil',
      '1 lemon, sliced',
      '2 tbsp fresh dill',
      '1 tbsp butter',
      'Sea salt (minimal)',
      'No spices'
    ],
    instructions: [
      'Cook jasmine rice until fluffy',
      'Season fish with minimal salt and dill',
      'Heat olive oil in non-stick pan',
      'Cook fish gently 4-5 minutes per side',
      'Steam green beans until tender',
      'Finish fish with butter and lemon',
      'Serve over rice with steamed beans'
    ],
    nutrition: {
      calories: 425,
      protein: 32,
      carbs: 42,
      fat: 12,
      fiber: 4
    }
  },
  {
    id: 'pregnancy-day15-prenatal-snack-plate',
    title: 'Prenatal Snack Plate',
    description: 'Balanced snack plate with protein, healthy fats, and complex carbs',
    prepTime: '8 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Snacks',
    tags: ['Balanced', 'Quick', 'Protein'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1/2 cup Greek yogurt',
      '1/4 cup berries',
      '1 tbsp almond butter',
      '1 small apple, sliced',
      '1 tbsp walnuts, chopped',
      '1 tsp honey',
      'Whole grain crackers'
    ],
    instructions: [
      'Place Greek yogurt in bowl',
      'Top with fresh berries',
      'Slice apple into wedges',
      'Serve with almond butter for dipping',
      'Add chopped walnuts to yogurt',
      'Drizzle with honey',
      'Serve with whole grain crackers on side'
    ],
    nutrition: {
      calories: 365,
      protein: 18,
      carbs: 38,
      fat: 16,
      fiber: 6
    }
  },
  {
    id: 'pregnancy-day16-folate-pasta',
    title: 'Folate-Rich Pasta with Greens',
    description: 'Whole grain pasta with folate-rich greens and mild garlic oil',
    prepTime: '18 min',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5',
    category: 'Dinner',
    tags: ['Folate', 'Whole Grains', 'Mild'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester'],
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '12 oz whole grain pasta',
      '6 cups baby spinach',
      '2 cups arugula',
      '3 cloves garlic, minced',
      '4 tbsp olive oil',
      '1/4 cup grated parmesan',
      '2 tbsp pine nuts',
      'Sea salt (minimal)',
      'Lemon juice'
    ],
    instructions: [
      'Cook pasta according to package directions',
      'Heat olive oil in large pan',
      'Add garlic, cook gently 1 minute',
      'Add spinach and arugula, wilt',
      'Toss pasta with greens and oil',
      'Add parmesan and pine nuts',
      'Finish with lemon juice and minimal salt'
    ],
    nutrition: {
      calories: 385,
      protein: 14,
      carbs: 58,
      fat: 12,
      folate: 165,
      fiber: 8
    }
  },
  {
    id: 'pregnancy-day17-calcium-chia-pudding',
    title: 'Calcium-Rich Chia Pudding',
    description: 'Creamy chia pudding with almond milk and calcium-rich toppings',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c',
    category: 'Breakfast',
    tags: ['Calcium', 'Make Ahead', 'Omega-3'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '1/4 cup chia seeds',
      '1 cup fortified almond milk',
      '2 tbsp maple syrup',
      '1 tsp vanilla extract',
      '1/4 cup chopped almonds',
      '2 tbsp sesame seeds',
      '1/2 cup berries',
      'Pinch of cinnamon'
    ],
    instructions: [
      'Whisk chia seeds with almond milk',
      'Add maple syrup and vanilla',
      'Let sit 5 minutes, whisk again',
      'Refrigerate at least 2 hours',
      'Top with almonds and sesame seeds',
      'Add fresh berries and cinnamon'
    ],
    nutrition: {
      calories: 285,
      protein: 8,
      carbs: 28,
      fat: 16,
      calcium: 385,
      fiber: 12
    }
  },
  {
    id: 'pregnancy-day18-iron-lentil-soup',
    title: 'Iron-Rich Red Lentil Soup',
    description: 'Gentle lentil soup with iron and vitamin C for optimal absorption',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Soups',
    tags: ['Iron', 'Plant Protein', 'Vitamin C'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '1 cup red lentils',
      '4 cups vegetable broth',
      '1 can diced tomatoes',
      '2 carrots, diced',
      '1 onion, diced',
      '2 tbsp olive oil',
      '2 cups spinach',
      '1 lemon, juiced',
      'Sea salt (minimal)',
      'Fresh parsley'
    ],
    instructions: [
      'Heat olive oil in large pot',
      'Sauté onion and carrots until soft',
      'Add lentils, broth, and tomatoes',
      'Bring to boil, then simmer 20 minutes',
      'Stir in spinach until wilted',
      'Add lemon juice for vitamin C',
      'Season minimally, garnish with parsley'
    ],
    nutrition: {
      calories: 245,
      protein: 14,
      carbs: 38,
      fat: 6,
      iron: 4.8,
      fiber: 16
    }
  },
  {
    id: 'pregnancy-day19-gentle-chicken-rice',
    title: 'Gentle Chicken and Rice',
    description: 'Simple, comforting chicken and rice perfect for sensitive digestion',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
    category: 'Dinner',
    tags: ['Comfort Food', 'Gentle', 'Easy Digestion'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-3rd-trimester'],
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '1 lb organic chicken breast',
      '1.5 cups jasmine rice',
      '3 cups low-sodium chicken broth',
      '2 carrots, diced',
      '1 tbsp olive oil',
      '1 bay leaf',
      '2 tbsp fresh parsley',
      'Sea salt (minimal)',
      'No spices'
    ],
    instructions: [
      'Heat olive oil in large pot',
      'Add chicken breast and brown lightly',
      'Add rice, broth, carrots, and bay leaf',
      'Bring to boil, then reduce heat',
      'Cover and simmer 20 minutes',
      'Shred chicken when tender',
      'Finish with parsley and minimal seasoning'
    ],
    nutrition: {
      calories: 385,
      protein: 28,
      carbs: 48,
      fat: 6,
      fiber: 2
    }
  },
  {
    id: 'pregnancy-day20-prenatal-smoothie-bowl',
    title: 'Prenatal Power Smoothie Bowl',
    description: 'Thick smoothie bowl topped with prenatal superfoods and healthy fats',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1638436684761-367dbfead4f3',
    category: 'Breakfast',
    tags: ['Prenatal Superfoods', 'Antioxidants', 'Healthy Fats'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1/2 frozen banana',
      '1/2 cup frozen berries',
      '1/2 cup Greek yogurt',
      '1/4 cup oat milk',
      '1 tbsp almond butter',
      '1 tbsp chia seeds',
      '1 tbsp hemp hearts',
      '1 tbsp chopped walnuts',
      '1 tsp honey'
    ],
    instructions: [
      'Blend banana, berries, yogurt, and oat milk',
      'Blend until very thick consistency',
      'Pour into bowl',
      'Top with almond butter drizzle',
      'Sprinkle with chia seeds and hemp hearts',
      'Add walnuts and drizzle with honey'
    ],
    nutrition: {
      calories: 425,
      protein: 22,
      carbs: 38,
      fat: 22,
      fiber: 12
    }
  },
  {
    id: 'pregnancy-day21-baked-sweet-potato',
    title: 'Stuffed Sweet Potato with Beans',
    description: 'Fiber-rich sweet potato stuffed with protein-packed black beans',
    prepTime: '35 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Lunch',
    tags: ['Fiber', 'Plant Protein', 'Complex Carbs'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '2 large sweet potatoes',
      '1 can black beans, drained',
      '1/2 avocado, diced',
      '2 tbsp Greek yogurt',
      '1 tbsp olive oil',
      '1 lime, juiced',
      '2 tbsp fresh cilantro',
      '1 tbsp pumpkin seeds',
      'Sea salt (minimal)'
    ],
    instructions: [
      'Bake sweet potatoes at 425°F for 35 minutes',
      'Heat black beans gently with minimal salt',
      'Split sweet potatoes and fluff flesh',
      'Top with warm black beans',
      'Add diced avocado and Greek yogurt',
      'Drizzle with lime juice and olive oil',
      'Garnish with cilantro and pumpkin seeds'
    ],
    nutrition: {
      calories: 385,
      protein: 16,
      carbs: 62,
      fat: 12,
      fiber: 18
    }
  },
  {
    id: 'pregnancy-day22-mild-vegetable-curry',
    title: 'Mild Coconut Vegetable Curry',
    description: 'Gentle curry with coconut milk and pregnancy-safe vegetables',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
    category: 'Dinner',
    tags: ['Mild', 'Coconut Milk', 'Vegetables'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '1 can coconut milk',
      '2 cups cauliflower florets',
      '2 carrots, sliced',
      '1 cup green beans',
      '1 onion, diced',
      '2 tbsp coconut oil',
      '1 tsp mild curry powder',
      '2 cups jasmine rice',
      'Sea salt (minimal)',
      'Fresh cilantro'
    ],
    instructions: [
      'Cook jasmine rice separately',
      'Heat coconut oil in large pan',
      'Sauté onion until translucent',
      'Add curry powder, cook 30 seconds',
      'Add coconut milk and vegetables',
      'Simmer 15 minutes until vegetables tender',
      'Season minimally, serve over rice with cilantro'
    ],
    nutrition: {
      calories: 385,
      protein: 8,
      carbs: 52,
      fat: 18,
      fiber: 6
    }
  },
  {
    id: 'pregnancy-day23-protein-pancakes',
    title: 'Gentle Protein Pancakes',
    description: 'Soft, protein-rich pancakes perfect for pregnancy cravings',
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea',
    category: 'Breakfast',
    tags: ['Protein', 'Comfort Food', 'Gentle'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '1/2 cup oat flour',
      '2 eggs',
      '1/4 cup Greek yogurt',
      '1/4 cup oat milk',
      '1 tbsp maple syrup',
      '1 tsp vanilla extract',
      '1 tsp baking powder',
      'Coconut oil for cooking',
      'Berries and honey for topping'
    ],
    instructions: [
      'Mix oat flour and baking powder',
      'Whisk eggs with yogurt, milk, maple syrup, vanilla',
      'Combine wet and dry ingredients gently',
      'Heat coconut oil in non-stick pan',
      'Cook pancakes 3-4 minutes per side',
      'Serve with berries and honey drizzle'
    ],
    nutrition: {
      calories: 325,
      protein: 18,
      carbs: 38,
      fat: 12,
      fiber: 6
    }
  },
  {
    id: 'pregnancy-day24-calcium-parfait',
    title: 'Calcium-Rich Yogurt Parfait',
    description: 'Layered parfait with calcium-rich ingredients for bone development',
    prepTime: '8 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c',
    category: 'Snacks',
    tags: ['Calcium', 'Probiotics', 'No Cook'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 cup Greek yogurt',
      '2 tbsp tahini',
      '1 tbsp maple syrup',
      '1/4 cup granola',
      '2 tbsp sesame seeds',
      '1/4 cup dried figs, chopped',
      '1 tbsp almond butter',
      'Cinnamon for dusting'
    ],
    instructions: [
      'Mix Greek yogurt with half the maple syrup',
      'Layer yogurt in glass or bowl',
      'Add layer of granola and sesame seeds',
      'Add chopped figs and drizzle tahini',
      'Top with almond butter',
      'Dust with cinnamon and remaining maple syrup'
    ],
    nutrition: {
      calories: 485,
      protein: 24,
      carbs: 42,
      fat: 26,
      calcium: 525,
      fiber: 8
    }
  },

  // POSTPARTUM RECIPES - 28 iron-dense, gut-sealing, lactation-safe recipes
  {
    id: 'postpartum-day1-healing-bone-broth',
    title: 'Postpartum Healing Bone Broth',
    description: 'Deep nourishing bone broth with warming herbs to support recovery and milk production',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Soups',
    tags: ['Healing', 'Bone Broth', 'Lactation Support', 'Warming'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '6 cups grass-fed bone broth',
      '1 inch fresh ginger, sliced',
      '2 carrots, diced',
      '2 celery stalks, diced',
      '1 onion, diced',
      '1 cup cooked chicken, shredded',
      '2 tbsp coconut oil',
      '1 tsp turmeric',
      '2 bay leaves',
      '2 tbsp fresh parsley',
      'Sea salt to taste'
    ],
    instructions: [
      'Heat coconut oil in large pot over medium heat',
      'Sauté onion, carrots, celery until softened',
      'Add ginger, turmeric, cook 1 minute',
      'Pour in bone broth, add bay leaves',
      'Bring to gentle simmer, cook 20 minutes',
      'Add shredded chicken, warm through',
      'Remove bay leaves, season with salt',
      'Serve hot garnished with fresh parsley'
    ],
    nutrition: {
      calories: 185,
      protein: 18,
      carbs: 8,
      fat: 8,
      iron: 2.4,
      fiber: 2
    }
  },
  {
    id: 'postpartum-day2-iron-rich-smoothie',
    title: 'Iron-Rich Recovery Smoothie',
    description: 'Powerhouse smoothie with spinach, spirulina, and blackstrap molasses to replenish iron stores',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1638436684761-367dbfead4f3',
    category: 'Breakfast',
    tags: ['Iron Rich', 'Recovery', 'Energy Boost', 'Lactation'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '2 cups spinach',
      '1 banana',
      '1 cup coconut milk',
      '1 tbsp blackstrap molasses',
      '1 tbsp spirulina powder',
      '1 tbsp almond butter',
      '1 tsp vanilla extract',
      '1 cup ice',
      '1 tbsp chia seeds'
    ],
    instructions: [
      'Add coconut milk and spinach to blender first',
      'Add banana, blackstrap molasses, and spirulina',
      'Add almond butter and vanilla extract',
      'Blend on high until completely smooth',
      'Add ice and chia seeds, blend briefly',
      'Pour into large glass and drink immediately',
      'This provides 6mg iron for recovery'
    ],
    nutrition: {
      calories: 385,
      protein: 12,
      carbs: 42,
      fat: 20,
      iron: 6.2,
      fiber: 12
    }
  },
  {
    id: 'postpartum-day3-lactation-cookies',
    title: 'Power Lactation Cookies',
    description: 'Nutrient-dense cookies with brewers yeast, oats, and flax to boost milk supply',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1606913947356-89296d414c0b',
    category: 'Snacks',
    tags: ['Lactation Support', 'Oats', 'Brewers Yeast', 'Batch Cook'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12', 'postpartum-3-6m'],
    servings: 24,
    difficulty: 'Easy',
    ingredients: [
      '3 cups rolled oats',
      '1 cup whole wheat flour',
      '5 tbsp brewers yeast',
      '3 tbsp ground flaxseed',
      '1/2 cup coconut oil, melted',
      '1/2 cup brown sugar',
      '2 eggs',
      '1 tsp vanilla extract',
      '1 cup dark chocolate chips',
      '1/2 cup chopped almonds',
      '1 tsp cinnamon'
    ],
    instructions: [
      'Preheat oven to 350°F, line baking sheets',
      'Mix oats, flour, brewers yeast, flaxseed, cinnamon',
      'Cream melted coconut oil with brown sugar',
      'Beat in eggs and vanilla extract',
      'Combine wet and dry ingredients',
      'Fold in chocolate chips and almonds',
      'Drop spoonfuls on baking sheet',
      'Bake 12-15 minutes until golden'
    ],
    nutrition: {
      calories: 185,
      protein: 5,
      carbs: 24,
      fat: 8,
      iron: 1.8,
      fiber: 4
    }
  },
  {
    id: 'postpartum-day4-gut-healing-stew',
    title: 'Gut-Healing Beef Stew',
    description: 'Slow-cooked beef stew with collagen-rich bone broth to heal the digestive tract',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Dinner',
    tags: ['Gut Healing', 'Collagen', 'Iron Rich', 'Warming'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      '2 lbs grass-fed beef chuck, cubed',
      '4 cups bone broth',
      '3 carrots, chunked',
      '3 celery stalks, chunked',
      '2 sweet potatoes, cubed',
      '1 onion, diced',
      '3 cloves garlic, minced',
      '2 tbsp avocado oil',
      '2 tbsp tomato paste',
      '2 tbsp fresh thyme',
      'Sea salt and pepper'
    ],
    instructions: [
      'Heat avocado oil in large Dutch oven',
      'Brown beef cubes on all sides',
      'Add onion and garlic, cook until fragrant',
      'Stir in tomato paste, cook 1 minute',
      'Add bone broth, bring to boil',
      'Reduce heat, simmer covered 1.5 hours',
      'Add vegetables, cook 30 minutes more',
      'Season with thyme, salt, and pepper'
    ],
    nutrition: {
      calories: 425,
      protein: 38,
      carbs: 18,
      fat: 22,
      iron: 4.8,
      fiber: 4
    }
  },
  {
    id: 'postpartum-day5-liver-power-pate',
    title: 'Iron-Rich Liver Pâté',
    description: 'Nutrient-dense liver pâté with herbs - the ultimate iron and B-vitamin source',
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
    category: 'Snacks',
    tags: ['Organ Meat', 'Iron Rich', 'B-Vitamins', 'Nutrient Dense'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 8,
    difficulty: 'Medium',
    ingredients: [
      '1 lb grass-fed chicken livers',
      '1/2 cup grass-fed butter',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '2 tbsp brandy (optional)',
      '2 tbsp fresh thyme',
      '1 bay leaf',
      'Sea salt and pepper',
      'Sourdough crackers for serving'
    ],
    instructions: [
      'Clean livers, pat dry, season with salt and pepper',
      'Heat half the butter in large skillet',
      'Sauté onion until translucent',
      'Add garlic and thyme, cook 1 minute',
      'Add livers, cook 5-6 minutes until just pink inside',
      'Add brandy if using, cook off alcohol',
      'Cool slightly, blend with remaining butter until smooth',
      'Serve on sourdough crackers'
    ],
    nutrition: {
      calories: 125,
      protein: 12,
      carbs: 2,
      fat: 8,
      iron: 8.2,
      folate: 145
    }
  },
  {
    id: 'postpartum-day6-golden-milk-latte',
    title: 'Postpartum Golden Milk',
    description: 'Anti-inflammatory golden milk with collagen and adaptogens for healing and stress support',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344',
    category: 'Beverages',
    tags: ['Anti-inflammatory', 'Adaptogens', 'Stress Support', 'Collagen'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12', 'postpartum-3-6m'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 cup coconut milk',
      '1 tsp turmeric powder',
      '1/2 tsp ginger powder',
      '1/4 tsp cinnamon',
      'Pinch of black pepper',
      '1 tbsp collagen powder',
      '1 tsp coconut oil',
      '1 tsp raw honey',
      '1/2 tsp ashwagandha powder'
    ],
    instructions: [
      'Heat coconut milk in small saucepan',
      'Whisk in turmeric, ginger, cinnamon, and pepper',
      'Simmer gently for 5 minutes',
      'Remove from heat, whisk in collagen until smooth',
      'Add coconut oil and ashwagandha',
      'Sweeten with honey, stir well',
      'Enjoy warm for anti-inflammatory benefits'
    ],
    nutrition: {
      calories: 185,
      protein: 12,
      carbs: 8,
      fat: 14,
      fiber: 2
    }
  },
  {
    id: 'postpartum-day7-red-meat-hash',
    title: 'Iron-Rich Sweet Potato Hash',
    description: 'Grass-fed beef hash with sweet potatoes and greens for iron and energy',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
    category: 'Breakfast',
    tags: ['Iron Rich', 'Energizing', 'Sweet Potato', 'Protein'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '1 lb grass-fed ground beef',
      '2 large sweet potatoes, diced',
      '4 cups spinach',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '3 tbsp avocado oil',
      '2 tbsp fresh rosemary',
      '4 eggs (optional)',
      'Sea salt and pepper'
    ],
    instructions: [
      'Heat 2 tbsp oil in large cast iron skillet',
      'Add diced sweet potatoes, cook 15 minutes until crispy',
      'Remove sweet potatoes, add remaining oil',
      'Brown ground beef, breaking it up',
      'Add onion and garlic, cook until fragrant',
      'Return sweet potatoes to pan with rosemary',
      'Add spinach, cook until wilted',
      'Top with fried eggs if desired'
    ],
    nutrition: {
      calories: 465,
      protein: 28,
      carbs: 22,
      fat: 28,
      iron: 6.2,
      fiber: 6
    }
  },
  {
    id: 'postpartum-day8-salmon-quinoa-bowl',
    title: 'Omega-3 Salmon Recovery Bowl',
    description: 'Wild salmon with quinoa and anti-inflammatory vegetables for brain health and recovery',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253',
    category: 'Lunch',
    tags: ['Omega-3', 'Anti-inflammatory', 'Complete Protein', 'Brain Health'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12', 'postpartum-3-6m'],
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '2 wild salmon fillets (6oz each)',
      '1 cup quinoa',
      '2 cups vegetable broth',
      '1 avocado, sliced',
      '2 cups arugula',
      '1/4 cup hemp hearts',
      '2 tbsp olive oil',
      '1 lemon, juiced',
      '1 tbsp tahini',
      'Sea salt and pepper'
    ],
    instructions: [
      'Cook quinoa in vegetable broth for 15 minutes',
      'Season salmon with salt, pepper, and lemon',
      'Pan-sear salmon 4-5 minutes per side',
      'Massage arugula with pinch of salt',
      'Whisk olive oil, lemon juice, and tahini',
      'Layer quinoa and arugula in bowls',
      'Top with salmon, avocado, and hemp hearts',
      'Drizzle with tahini dressing'
    ],
    nutrition: {
      calories: 585,
      protein: 42,
      carbs: 38,
      fat: 32,
      fiber: 12
    }
  },
  {
    id: 'postpartum-day9-nettle-tea-blend',
    title: 'Postpartum Herbal Tea Blend',
    description: 'Mineral-rich herbal tea with nettle, red raspberry leaf, and oat straw for recovery',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344',
    category: 'Beverages',
    tags: ['Herbal Tea', 'Minerals', 'Uterine Health', 'Lactation'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 tbsp dried nettle leaf',
      '1 tbsp dried red raspberry leaf',
      '1 tsp dried oat straw',
      '1 tsp dried alfalfa',
      '2 cups boiling water',
      '1 tsp raw honey',
      '1 slice fresh ginger'
    ],
    instructions: [
      'Combine all dried herbs in large mug or teapot',
      'Pour boiling water over herbs',
      'Add fresh ginger slice',
      'Steep covered for 10-15 minutes',
      'Strain herbs, sweeten with honey',
      'Drink 2-3 cups daily for mineral support',
      'Can be made in large batches and refrigerated'
    ],
    nutrition: {
      calories: 25,
      protein: 2,
      carbs: 6,
      fat: 0,
      iron: 1.2
    }
  },
  {
    id: 'postpartum-day10-collagen-rich-soup',
    title: 'Gut-Sealing Chicken Soup',
    description: 'Traditional chicken soup with extra gelatin and healing herbs for digestive repair',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Soups',
    tags: ['Gut Healing', 'Collagen', 'Traditional', 'Digestive Health'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      '1 whole organic chicken',
      '8 cups water',
      '2 tbsp apple cider vinegar',
      '2 carrots, diced',
      '2 celery stalks, diced',
      '1 onion, diced',
      '2 bay leaves',
      '2 tbsp fresh dill',
      '1 tbsp sea salt',
      '1/2 cup egg noodles'
    ],
    instructions: [
      'Place chicken in large pot with water and vinegar',
      'Let sit 30 minutes to extract minerals',
      'Bring to boil, skim foam, reduce heat',
      'Add vegetables and bay leaves',
      'Simmer 2-3 hours until chicken falls off bone',
      'Remove chicken, shred meat, discard skin and bones',
      'Strain broth, return shredded chicken',
      'Add noodles, cook until tender, finish with dill'
    ],
    nutrition: {
      calories: 285,
      protein: 28,
      carbs: 12,
      fat: 12,
      fiber: 2
    }
  },
  {
    id: 'postpartum-day11-iron-rich-meatballs',
    title: 'Grass-Fed Beef Meatballs',
    description: 'Iron-rich meatballs with hidden liver and served over zucchini noodles',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5',
    category: 'Dinner',
    tags: ['Iron Rich', 'Hidden Liver', 'Low Carb', 'Protein'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '1 lb grass-fed ground beef',
      '1/4 lb grass-fed beef liver, finely minced',
      '1 egg',
      '1/4 cup almond flour',
      '2 cloves garlic, minced',
      '2 tbsp fresh parsley',
      '4 large zucchini, spiralized',
      '2 cups marinara sauce',
      '2 tbsp olive oil',
      'Sea salt and pepper'
    ],
    instructions: [
      'Mix ground beef, minced liver, egg, and almond flour',
      'Add garlic, parsley, salt, and pepper',
      'Form into 20 meatballs',
      'Heat olive oil in large skillet',
      'Brown meatballs on all sides',
      'Add marinara sauce, simmer 15 minutes',
      'Sauté zucchini noodles for 2-3 minutes',
      'Serve meatballs over zucchini noodles'
    ],
    nutrition: {
      calories: 425,
      protein: 32,
      carbs: 15,
      fat: 26,
      iron: 8.5,
      fiber: 6
    }
  },
  {
    id: 'postpartum-day12-chia-seed-pudding',
    title: 'Lactation-Boosting Chia Pudding',
    description: 'Omega-3 rich chia pudding with coconut milk and lactation-supporting seeds',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c',
    category: 'Breakfast',
    tags: ['Omega-3', 'Lactation Support', 'Make Ahead', 'Seeds'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12', 'postpartum-3-6m'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '1/4 cup chia seeds',
      '1 cup coconut milk',
      '2 tbsp ground flaxseed',
      '1 tbsp maple syrup',
      '1 tsp vanilla extract',
      '2 tbsp almond butter',
      '1/4 cup blueberries',
      '2 tbsp hemp hearts',
      'Pinch of cinnamon'
    ],
    instructions: [
      'Whisk chia seeds with coconut milk in bowl',
      'Add ground flaxseed, maple syrup, and vanilla',
      'Let sit 5 minutes, whisk again to prevent clumping',
      'Refrigerate at least 2 hours or overnight',
      'Top with almond butter, blueberries, and hemp hearts',
      'Sprinkle with cinnamon before serving',
      'Perfect make-ahead breakfast for busy new moms'
    ],
    nutrition: {
      calories: 325,
      protein: 12,
      carbs: 24,
      fat: 22,
      fiber: 15
    }
  },
  {
    id: 'postpartum-day13-warming-lamb-stew',
    title: 'Warming Lamb and Root Vegetable Stew',
    description: 'Deeply nourishing lamb stew with warming spices to rebuild energy and warmth',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Dinner',
    tags: ['Warming', 'Lamb', 'Root Vegetables', 'Rebuilding'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      '2 lbs grass-fed lamb shoulder, cubed',
      '3 carrots, chunked',
      '3 parsnips, chunked',
      '2 turnips, cubed',
      '1 onion, diced',
      '4 cups bone broth',
      '2 tbsp avocado oil',
      '2 tbsp fresh rosemary',
      '1 tsp cinnamon',
      'Sea salt and pepper'
    ],
    instructions: [
      'Heat avocado oil in Dutch oven',
      'Brown lamb cubes on all sides',
      'Add onion, cook until translucent',
      'Add root vegetables and rosemary',
      'Pour in bone broth, add cinnamon',
      'Bring to boil, reduce heat and simmer',
      'Cover and cook 1.5-2 hours until tender',
      'Season with salt and pepper before serving'
    ],
    nutrition: {
      calories: 485,
      protein: 42,
      carbs: 18,
      fat: 26,
      iron: 6.8,
      fiber: 5
    }
  },
  {
    id: 'postpartum-day14-seaweed-salad',
    title: 'Mineral-Rich Seaweed Salad',
    description: 'Iodine and mineral-rich seaweed salad to support thyroid and metabolism',
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Lunch',
    tags: ['Seaweed', 'Minerals', 'Thyroid Support', 'Iodine'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12', 'postpartum-3-6m'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '1 cup mixed seaweed (wakame, dulse)',
      '1 cucumber, sliced thin',
      '1 carrot, julienned',
      '2 tbsp sesame oil',
      '1 tbsp rice vinegar',
      '1 tbsp tamari',
      '1 tsp ginger, minced',
      '2 tbsp sesame seeds',
      '1 avocado, sliced'
    ],
    instructions: [
      'Soak dried seaweed in warm water 10 minutes',
      'Drain and rinse seaweed well',
      'Slice cucumber and julienne carrot',
      'Whisk sesame oil, vinegar, tamari, and ginger',
      'Combine seaweed, cucumber, and carrot',
      'Toss with dressing and sesame seeds',
      'Top with avocado slices before serving'
    ],
    nutrition: {
      calories: 245,
      protein: 6,
      carbs: 12,
      fat: 20,
      fiber: 8,
      iodine: 185
    }
  },
  {
    id: 'postpartum-day15-coconut-rice-pudding',
    title: 'Nourishing Coconut Rice Pudding',
    description: 'Creamy rice pudding with coconut milk and warming spices for comfort and nourishment',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c',
    category: 'Snacks',
    tags: ['Comfort Food', 'Coconut', 'Warming Spices', 'Digestible'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '1 cup jasmine rice',
      '2 cups coconut milk',
      '1 cup water',
      '2 tbsp maple syrup',
      '1 tsp vanilla extract',
      '1/2 tsp cinnamon',
      '1/4 tsp cardamom',
      'Pinch of sea salt',
      '2 tbsp chopped almonds'
    ],
    instructions: [
      'Combine rice, coconut milk, and water in pot',
      'Bring to boil, reduce heat to low',
      'Simmer 20 minutes, stirring occasionally',
      'Add maple syrup, vanilla, and spices',
      'Cook 5 minutes more until creamy',
      'Serve warm topped with chopped almonds',
      'Perfect comforting snack for new mothers'
    ],
    nutrition: {
      calories: 285,
      protein: 5,
      carbs: 42,
      fat: 12,
      fiber: 2
    }
  },
  {
    id: 'postpartum-day16-organ-meat-pate',
    title: 'Nutrient-Dense Heart and Liver Pâté',
    description: 'Ultimate nutrient density with heart and liver pâté - nature\'s multivitamin',
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
    category: 'Snacks',
    tags: ['Organ Meat', 'Nutrient Dense', 'CoQ10', 'B-Vitamins'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 8,
    difficulty: 'Medium',
    ingredients: [
      '1/2 lb grass-fed beef heart',
      '1/2 lb grass-fed beef liver',
      '1/2 cup grass-fed butter',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '2 tbsp fresh thyme',
      '1 tbsp brandy (optional)',
      'Sea salt and pepper',
      'Sourdough bread for serving'
    ],
    instructions: [
      'Clean heart and liver, cut into small pieces',
      'Heat half the butter in large skillet',
      'Sauté onion until translucent',
      'Add garlic and thyme, cook 1 minute',
      'Add heart and liver, cook 8-10 minutes',
      'Add brandy if using, cook off alcohol',
      'Cool slightly, blend with remaining butter',
      'Season with salt and pepper, serve on bread'
    ],
    nutrition: {
      calories: 165,
      protein: 15,
      carbs: 2,
      fat: 11,
      iron: 12.5,
      folate: 185
    }
  },
  {
    id: 'postpartum-day17-warming-porridge',
    title: 'Warming Steel-Cut Oat Porridge',
    description: 'Slowly cooked steel-cut oats with warming spices and nourishing toppings',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea',
    category: 'Breakfast',
    tags: ['Warming', 'Oats', 'Slow Cooked', 'Digestible'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '1 cup steel-cut oats',
      '3 cups water',
      '1 cup coconut milk',
      '2 tbsp maple syrup',
      '1 tsp cinnamon',
      '1/2 tsp ginger powder',
      '1/4 tsp cardamom',
      '2 tbsp chopped walnuts',
      '2 tbsp dried fruit',
      'Pinch of sea salt'
    ],
    instructions: [
      'Bring water to boil in heavy-bottomed pot',
      'Add steel-cut oats and salt',
      'Reduce heat, simmer 25-30 minutes stirring occasionally',
      'Add coconut milk and spices',
      'Cook 5 minutes more until creamy',
      'Stir in maple syrup',
      'Serve topped with walnuts and dried fruit'
    ],
    nutrition: {
      calories: 285,
      protein: 8,
      carbs: 38,
      fat: 12,
      fiber: 6
    }
  },
  {
    id: 'postpartum-day18-healing-soup',
    title: 'Chinese Postpartum Healing Soup',
    description: 'Traditional Chinese confinement soup with ginger, dates, and healing herbs',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Soups',
    tags: ['Traditional', 'Warming', 'Chinese Medicine', 'Ginger'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '1 whole organic chicken',
      '2 inches fresh ginger, sliced',
      '6 red dates',
      '1 tbsp goji berries',
      '6 cups water',
      '2 tbsp Shaoxing wine (optional)',
      '1 tbsp sesame oil',
      '2 green onions, chopped',
      'Sea salt to taste'
    ],
    instructions: [
      'Place chicken in large pot with water',
      'Add ginger slices and bring to boil',
      'Skim foam, reduce heat and simmer 1 hour',
      'Add red dates and goji berries',
      'Continue cooking 30 minutes more',
      'Remove chicken, shred meat, return to pot',
      'Add wine and sesame oil',
      'Garnish with green onions before serving'
    ],
    nutrition: {
      calories: 285,
      protein: 32,
      carbs: 8,
      fat: 12,
      iron: 2.8
    }
  },
  {
    id: 'postpartum-day19-iron-rich-salad',
    title: 'Iron-Absorption Spinach Salad',
    description: 'Spinach salad with vitamin C-rich ingredients to maximize iron absorption',
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Lunch',
    tags: ['Iron Rich', 'Vitamin C', 'Raw Foods', 'Iron Absorption'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12', 'postpartum-3-6m'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '6 cups baby spinach',
      '1 orange, segmented',
      '1/2 cup strawberries, sliced',
      '1/4 cup pumpkin seeds',
      '2 tbsp hemp hearts',
      '3 tbsp olive oil',
      '2 tbsp lemon juice',
      '1 tbsp balsamic vinegar',
      '1 tsp Dijon mustard',
      'Sea salt and pepper'
    ],
    instructions: [
      'Wash and dry spinach leaves',
      'Segment orange and slice strawberries',
      'Toast pumpkin seeds lightly in dry pan',
      'Whisk olive oil, lemon juice, vinegar, and mustard',
      'Toss spinach with dressing',
      'Top with orange, strawberries, pumpkin seeds',
      'Sprinkle with hemp hearts before serving'
    ],
    nutrition: {
      calories: 325,
      protein: 10,
      carbs: 18,
      fat: 26,
      iron: 4.2,
      fiber: 8
    }
  },
  {
    id: 'postpartum-day20-nourishing-millet-bowl',
    title: 'Warming Millet Breakfast Bowl',
    description: 'Easily digestible millet porridge with warming spices and nourishing toppings',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea',
    category: 'Breakfast',
    tags: ['Millet', 'Warming', 'Digestible', 'Gluten-Free'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '1/2 cup millet',
      '2 cups almond milk',
      '1 tbsp coconut oil',
      '1 tsp cinnamon',
      '1/2 tsp vanilla extract',
      '2 tbsp maple syrup',
      '2 tbsp chopped almonds',
      '1 tbsp chia seeds',
      '1/2 banana, sliced'
    ],
    instructions: [
      'Toast millet in dry pan for 3 minutes',
      'Add almond milk and bring to boil',
      'Reduce heat, simmer 20 minutes stirring occasionally',
      'Stir in coconut oil, cinnamon, and vanilla',
      'Add maple syrup to taste',
      'Serve topped with almonds, chia seeds, and banana',
      'Perfect gentle breakfast for sensitive stomachs'
    ],
    nutrition: {
      calories: 365,
      protein: 10,
      carbs: 48,
      fat: 16,
      fiber: 8
    }
  },
  {
    id: 'postpartum-day21-bone-marrow-soup',
    title: 'Bone Marrow Recovery Soup',
    description: 'Ultimate recovery soup with roasted bone marrow for deep nourishment',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Soups',
    tags: ['Bone Marrow', 'Deep Nourishment', 'Recovery', 'Traditional'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '4 marrow bones (3-4 inches long)',
      '6 cups bone broth',
      '1 onion, diced',
      '2 carrots, diced',
      '2 celery stalks, diced',
      '2 cloves garlic, minced',
      '2 tbsp olive oil',
      '2 tbsp fresh parsley',
      'Sea salt and pepper',
      'Sourdough bread for serving'
    ],
    instructions: [
      'Preheat oven to 450°F',
      'Roast marrow bones 15-20 minutes',
      'Heat olive oil in large pot',
      'Sauté onion, carrots, celery until soft',
      'Add garlic, cook 1 minute',
      'Add bone broth, bring to simmer',
      'Scoop roasted marrow into soup',
      'Season and garnish with parsley'
    ],
    nutrition: {
      calories: 425,
      protein: 22,
      carbs: 12,
      fat: 32,
      iron: 3.8
    }
  },
  {
    id: 'postpartum-day22-fermented-vegetables',
    title: 'Probiotic Sauerkraut and Veggie Bowl',
    description: 'Gut-healing bowl with fermented vegetables to restore digestive health',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Lunch',
    tags: ['Probiotics', 'Gut Health', 'Fermented Foods', 'Digestive'],
    journey: ['postpartum'],
    stage: ['postpartum-6-12', 'postpartum-3-6m'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '4 cups mixed greens',
      '1/2 cup sauerkraut',
      '1/4 cup kimchi',
      '1 cup cooked quinoa',
      '1/2 avocado, sliced',
      '2 tbsp pumpkin seeds',
      '2 tbsp olive oil',
      '1 tbsp apple cider vinegar',
      '1 tsp Dijon mustard',
      'Sea salt and pepper'
    ],
    instructions: [
      'Layer mixed greens in bowls',
      'Add quinoa as base',
      'Top with sauerkraut and kimchi',
      'Add avocado slices and pumpkin seeds',
      'Whisk olive oil, vinegar, and mustard',
      'Drizzle with dressing',
      'Let fermented foods support gut healing'
    ],
    nutrition: {
      calories: 385,
      protein: 12,
      carbs: 32,
      fat: 24,
      fiber: 12
    }
  },
  {
    id: 'postpartum-day23-slow-cooked-short-ribs',
    title: 'Slow-Cooked Beef Short Ribs',
    description: 'Fall-off-the-bone short ribs with collagen and iron for deep healing',
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
    category: 'Dinner',
    tags: ['Collagen', 'Iron Rich', 'Slow Cooked', 'Comfort Food'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      '3 lbs grass-fed beef short ribs',
      '2 cups bone broth',
      '1 onion, quartered',
      '4 carrots, chunked',
      '3 celery stalks, chunked',
      '3 cloves garlic, whole',
      '2 tbsp tomato paste',
      '2 tbsp avocado oil',
      '2 bay leaves',
      'Sea salt and pepper'
    ],
    instructions: [
      'Preheat oven to 325°F',
      'Season short ribs with salt and pepper',
      'Heat avocado oil in Dutch oven',
      'Brown short ribs on all sides',
      'Remove ribs, add vegetables and tomato paste',
      'Cook 5 minutes, add broth and bay leaves',
      'Return ribs to pot, cover tightly',
      'Braise in oven 3-4 hours until tender'
    ],
    nutrition: {
      calories: 565,
      protein: 45,
      carbs: 12,
      fat: 38,
      iron: 6.8,
      fiber: 3
    }
  },
  {
    id: 'postpartum-day24-adaptogen-smoothie',
    title: 'Stress-Support Adaptogen Smoothie',
    description: 'Creamy smoothie with adaptogens to support adrenals and stress resilience',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1638436684761-367dbfead4f3',
    category: 'Breakfast',
    tags: ['Adaptogens', 'Stress Support', 'Adrenals', 'Energy'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12', 'postpartum-3-6m'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 cup coconut milk',
      '1/2 frozen banana',
      '1 cup frozen berries',
      '1 tbsp almond butter',
      '1 tsp ashwagandha powder',
      '1/2 tsp rhodiola powder',
      '1 tbsp collagen powder',
      '1 tsp vanilla extract',
      '1 tsp honey'
    ],
    instructions: [
      'Add coconut milk and almond butter to blender',
      'Add frozen banana and berries',
      'Add all adaptogen powders and collagen',
      'Add vanilla and honey',
      'Blend on high until completely smooth',
      'Pour into glass and enjoy for stress support'
    ],
    nutrition: {
      calories: 365,
      protein: 16,
      carbs: 32,
      fat: 20,
      fiber: 10
    }
  },
  {
    id: 'postpartum-day25-kidney-strengthening-soup',
    title: 'Kidney-Strengthening Black Bean Soup',
    description: 'Traditional Chinese medicine soup with black beans to strengthen kidney qi',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Soups',
    tags: ['Traditional Chinese Medicine', 'Kidney Support', 'Black Beans', 'Strengthening'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '2 cups cooked black beans',
      '4 cups vegetable broth',
      '1 piece kombu seaweed',
      '2 inches fresh ginger, sliced',
      '2 cloves garlic, minced',
      '1 onion, diced',
      '2 tbsp sesame oil',
      '1 tbsp tamari',
      '2 green onions, chopped',
      'Pinch of sea salt'
    ],
    instructions: [
      'Heat sesame oil in large pot',
      'Sauté onion until translucent',
      'Add garlic and ginger, cook 1 minute',
      'Add black beans, broth, and kombu',
      'Bring to boil, reduce heat and simmer 20 minutes',
      'Remove kombu, add tamari',
      'Garnish with green onions before serving',
      'This soup builds deep energy and warmth'
    ],
    nutrition: {
      calories: 245,
      protein: 12,
      carbs: 32,
      fat: 8,
      fiber: 12,
      iron: 3.2
    }
  },
  {
    id: 'postpartum-day26-warming-congee',
    title: 'Healing Ginger Chicken Congee',
    description: 'Traditional healing rice porridge with chicken and warming ginger',
    prepTime: '45 min',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea',
    category: 'Breakfast',
    tags: ['Traditional', 'Congee', 'Warming', 'Digestible'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '1 cup jasmine rice',
      '8 cups chicken broth',
      '1 cup cooked chicken, shredded',
      '2 inches fresh ginger, julienned',
      '2 tbsp sesame oil',
      '2 green onions, chopped',
      '1 tbsp tamari',
      'Sea salt to taste',
      'White pepper'
    ],
    instructions: [
      'Bring chicken broth to boil in large pot',
      'Add rice, reduce heat to low simmer',
      'Cook 45 minutes, stirring occasionally',
      'Rice should break down into porridge consistency',
      'Add shredded chicken and ginger',
      'Season with tamari and salt',
      'Serve topped with green onions and sesame oil',
      'Perfect warming breakfast for new mothers'
    ],
    nutrition: {
      calories: 285,
      protein: 18,
      carbs: 38,
      fat: 6,
      fiber: 1
    }
  },
  {
    id: 'postpartum-day27-nourishing-egg-drop-soup',
    title: 'Protein-Rich Egg Drop Soup',
    description: 'Simple, nourishing egg drop soup with bone broth for easy protein',
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Soups',
    tags: ['Protein', 'Simple', 'Digestible', 'Quick'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '4 cups bone broth',
      '3 eggs, beaten',
      '1 tbsp arrowroot powder',
      '2 tbsp water',
      '1 inch ginger, minced',
      '2 green onions, chopped',
      '1 tbsp sesame oil',
      'Sea salt and white pepper'
    ],
    instructions: [
      'Heat bone broth in medium pot',
      'Add minced ginger, simmer 5 minutes',
      'Mix arrowroot powder with water',
      'Add to broth to slightly thicken',
      'Slowly drizzle beaten eggs while stirring',
      'Season with salt and pepper',
      'Serve topped with green onions and sesame oil'
    ],
    nutrition: {
      calories: 165,
      protein: 14,
      carbs: 4,
      fat: 10,
      iron: 2.1
    }
  },
  {
    id: 'postpartum-day28-final-nourishing-stew',
    title: 'Complete Recovery Stew',
    description: 'Ultimate recovery stew combining all healing elements - bone broth, organ meat, and vegetables',
    prepTime: '35 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Dinner',
    tags: ['Complete Recovery', 'Bone Broth', 'Organ Meat', 'Ultimate Healing'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      '1 lb grass-fed stew meat',
      '1/4 lb grass-fed liver, diced',
      '6 cups bone broth',
      '3 carrots, chunked',
      '3 sweet potatoes, cubed',
      '2 cups kale, chopped',
      '1 onion, diced',
      '3 cloves garlic, minced',
      '2 tbsp avocado oil',
      '2 tbsp fresh herbs',
      'Sea salt and pepper'
    ],
    instructions: [
      'Heat avocado oil in large Dutch oven',
      'Brown stew meat and liver pieces',
      'Add onion and garlic, cook until fragrant',
      'Add bone broth, bring to boil',
      'Reduce heat, simmer covered 1 hour',
      'Add carrots and sweet potatoes',
      'Cook 30 minutes until vegetables tender',
      'Stir in kale and herbs, season to taste'
    ],
    nutrition: {
      calories: 485,
      protein: 38,
      carbs: 25,
      fat: 24,
      iron: 9.2,
      fiber: 6
    }
  }
];

export const mealPlans: MealPlan[] = [
  // TTC MEAL PLANS - Complete 30-day program
  {
    id: 'ttc-complete-30-day-fertility-plan',
    title: 'Complete 30-Day Fertility Transformation',
    description: 'Comprehensive month-long meal plan with hormone-balancing, fertility-boosting recipes designed to optimize conception naturally',
    duration: '30 Day Complete Plan',
    recipeCount: 30,
    avgPrepTime: '15-30 min/meal',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Fertility',
    tags: ['Complete Program', 'Hormone Balance', 'Fertility Optimization', 'Conception Support'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    recipes: [
      recipes.find(r => r.id === 'ttc-day1-hormone-smoothie'),
      recipes.find(r => r.id === 'ttc-day2-quinoa-power-bowl'),
      recipes.find(r => r.id === 'ttc-day3-wild-salmon'),
      recipes.find(r => r.id === 'ttc-day4-collagen-oats'),
      recipes.find(r => r.id === 'ttc-day5-fertility-soup'),
      recipes.find(r => r.id === 'ttc-day6-avocado-toast'),
      recipes.find(r => r.id === 'ttc-day7-lentil-curry'),
      recipes.find(r => r.id === 'ttc-day8-brazil-nut-smoothie'),
      recipes.find(r => r.id === 'ttc-day9-grass-fed-steak'),
      recipes.find(r => r.id === 'ttc-day10-chia-pudding'),
      recipes.find(r => r.id === 'ttc-day11-walnut-crusted-chicken'),
      recipes.find(r => r.id === 'ttc-day12-fertility-salad'),
      recipes.find(r => r.id === 'ttc-day13-turkey-meatballs'),
      recipes.find(r => r.id === 'ttc-day14-golden-milk'),
      recipes.find(r => r.id === 'ttc-day15-cod-vegetables'),
      recipes.find(r => r.id === 'ttc-day16-fertility-trail-mix'),
      recipes.find(r => r.id === 'ttc-day17-adaptogen-smoothie'),
      recipes.find(r => r.id === 'ttc-day18-bone-broth-risotto'),
      recipes.find(r => r.id === 'ttc-day19-coconut-curry-chicken'),
      recipes.find(r => r.id === 'ttc-day20-fermented-vegetables'),
      recipes.find(r => r.id === 'ttc-day21-matcha-latte'),
      recipes.find(r => r.id === 'ttc-day22-liver-detox-salad'),
      recipes.find(r => r.id === 'ttc-day23-grass-fed-liver'),
      recipes.find(r => r.id === 'ttc-day24-fertility-fat-bombs'),
      recipes.find(r => r.id === 'ttc-day25-sardines-toast'),
      recipes.find(r => r.id === 'ttc-day26-bison-sweet-potato'),
      recipes.find(r => r.id === 'ttc-day27-mushroom-soup'),
      recipes.find(r => r.id === 'ttc-day28-macadamia-crusted-fish'),
      recipes.find(r => r.id === 'ttc-day29-collagen-gummies'),
      recipes.find(r => r.id === 'ttc-day30-lamb-herbs')
    ].filter(Boolean)
  },

  // PREGNANCY MEAL PLANS - Complete 24-recipe program  
  {
    id: 'pregnancy-complete-24-day-plan',
    title: 'Complete Pregnancy Nutrition Plan',
    description: 'Comprehensive 24-day meal plan with folate-packed, heartburn-free recipes for optimal pregnancy nutrition',
    duration: '24 Day Complete Plan',
    recipeCount: 24,
    avgPrepTime: '10-25 min/meal',
    image: 'https://images.unsplash.com/photo-1616685803520-e1bb4aa5f8e4',
    category: 'Pregnancy',
    tags: ['Complete Program', 'Prenatal Nutrition', 'Folate Rich', 'Heartburn-Free'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    recipes: [
      recipes.find(r => r.id === 'pregnancy-day1-ginger-smoothie'),
      recipes.find(r => r.id === 'pregnancy-day2-folate-omelet'),
      recipes.find(r => r.id === 'pregnancy-day3-calcium-smoothie'),
      recipes.find(r => r.id === 'pregnancy-day4-iron-bowl'),
      recipes.find(r => r.id === 'pregnancy-day5-gentle-salmon'),
      recipes.find(r => r.id === 'pregnancy-day6-overnight-oats'),
      recipes.find(r => r.id === 'pregnancy-day7-heartburn-soup'),
      recipes.find(r => r.id === 'pregnancy-day8-calcium-salad'),
      recipes.find(r => r.id === 'pregnancy-day9-gentle-turkey'),
      recipes.find(r => r.id === 'pregnancy-day10-magnesium-smoothie'),
      recipes.find(r => r.id === 'pregnancy-day11-prenatal-bowl'),
      recipes.find(r => r.id === 'pregnancy-day12-bone-broth'),
      recipes.find(r => r.id === 'pregnancy-day13-sweet-potato-toast'),
      recipes.find(r => r.id === 'pregnancy-day14-gentle-fish'),
      recipes.find(r => r.id === 'pregnancy-day15-prenatal-snack-plate'),
      recipes.find(r => r.id === 'pregnancy-day16-folate-pasta'),
      recipes.find(r => r.id === 'pregnancy-day17-calcium-chia-pudding'),
      recipes.find(r => r.id === 'pregnancy-day18-iron-lentil-soup'),
      recipes.find(r => r.id === 'pregnancy-day19-gentle-chicken-rice'),
      recipes.find(r => r.id === 'pregnancy-day20-prenatal-smoothie-bowl'),
      recipes.find(r => r.id === 'pregnancy-day21-baked-sweet-potato'),
      recipes.find(r => r.id === 'pregnancy-day22-mild-vegetable-curry'),
      recipes.find(r => r.id === 'pregnancy-day23-protein-pancakes'),
      recipes.find(r => r.id === 'pregnancy-day24-calcium-parfait')
    ].filter(Boolean)
  },

  // POSTPARTUM MEAL PLANS - Complete 28-day recovery program
  {
    id: 'postpartum-complete-28-day-recovery-plan',
    title: 'Complete Postpartum Recovery Plan',
    description: 'Comprehensive 28-day meal plan with iron-dense, gut-sealing, lactation-safe recipes for optimal postpartum healing',
    duration: '28 Day Complete Recovery Plan',
    recipeCount: 28,
    avgPrepTime: '20-35 min/meal',
    image: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5',
    category: 'Postpartum',
    tags: ['Complete Recovery', 'Iron Dense', 'Gut Healing', 'Lactation Support'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12', 'postpartum-3-6m'],
    recipes: [
      recipes.find(r => r.id === 'postpartum-day1-healing-bone-broth'),
      recipes.find(r => r.id === 'postpartum-day2-iron-rich-smoothie'),
      recipes.find(r => r.id === 'postpartum-day3-lactation-cookies'),
      recipes.find(r => r.id === 'postpartum-day4-gut-healing-stew'),
      recipes.find(r => r.id === 'postpartum-day5-liver-power-pate'),
      recipes.find(r => r.id === 'postpartum-day6-golden-milk-latte'),
      recipes.find(r => r.id === 'postpartum-day7-red-meat-hash'),
      recipes.find(r => r.id === 'postpartum-day8-salmon-quinoa-bowl'),
      recipes.find(r => r.id === 'postpartum-day9-nettle-tea-blend'),
      recipes.find(r => r.id === 'postpartum-day10-collagen-rich-soup'),
      recipes.find(r => r.id === 'postpartum-day11-iron-rich-meatballs'),
      recipes.find(r => r.id === 'postpartum-day12-chia-seed-pudding'),
      recipes.find(r => r.id === 'postpartum-day13-warming-lamb-stew'),
      recipes.find(r => r.id === 'postpartum-day14-seaweed-salad'),
      recipes.find(r => r.id === 'postpartum-day15-coconut-rice-pudding'),
      recipes.find(r => r.id === 'postpartum-day16-organ-meat-pate'),
      recipes.find(r => r.id === 'postpartum-day17-warming-porridge'),
      recipes.find(r => r.id === 'postpartum-day18-healing-soup'),
      recipes.find(r => r.id === 'postpartum-day19-iron-rich-salad'),
      recipes.find(r => r.id === 'postpartum-day20-nourishing-millet-bowl'),
      recipes.find(r => r.id === 'postpartum-day21-bone-marrow-soup'),
      recipes.find(r => r.id === 'postpartum-day22-fermented-vegetables'),
      recipes.find(r => r.id === 'postpartum-day23-slow-cooked-short-ribs'),
      recipes.find(r => r.id === 'postpartum-day24-adaptogen-smoothie'),
      recipes.find(r => r.id === 'postpartum-day25-kidney-strengthening-soup'),
      recipes.find(r => r.id === 'postpartum-day26-warming-congee'),
      recipes.find(r => r.id === 'postpartum-day27-nourishing-egg-drop-soup'),
      recipes.find(r => r.id === 'postpartum-day28-final-nourishing-stew')
    ].filter(Boolean)
  }
];

export { type Recipe, type MealPlan };