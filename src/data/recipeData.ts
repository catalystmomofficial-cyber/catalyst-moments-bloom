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
  // TTC Recipes
  {
    id: 'ttc-fertility-smoothie',
    title: 'Fertility-Boosting Smoothie',
    description: 'Packed with folate, antioxidants, and healthy fats to support conception',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1638436684761-367dbfead4f3',
    category: 'Smoothies',
    tags: ['Folate Rich', 'Antioxidants', 'Quick'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 cup spinach',
      '1/2 avocado',
      '1 banana',
      '1 cup almond milk',
      '1 tbsp almond butter',
      '1 tsp chia seeds',
      '1/2 cup berries',
      '1 tsp honey'
    ],
    instructions: [
      'Add spinach and almond milk to blender first',
      'Add avocado, banana, and berries',
      'Add almond butter, chia seeds, and honey',
      'Blend until smooth and creamy',
      'Serve immediately'
    ],
    nutrition: {
      calories: 320,
      protein: 8,
      carbs: 42,
      fat: 16,
      fiber: 12,
      folate: 180
    }
  },
  {
    id: 'ttc-quinoa-power-bowl',
    title: 'Quinoa Power Bowl',
    description: 'Complete protein bowl with fertility-supporting nutrients',
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Lunch',
    tags: ['Protein Rich', 'Iron', 'Complete Nutrition'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '1 cup quinoa',
      '2 cups vegetable broth',
      '1 can black beans, drained',
      '1 avocado, sliced',
      '1 bell pepper, diced',
      '1/4 red onion, diced',
      '2 tbsp pumpkin seeds',
      '2 tbsp olive oil',
      '1 lemon, juiced',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Rinse quinoa and cook in vegetable broth for 15 minutes',
      'Meanwhile, dice bell pepper and onion',
      'Drain and rinse black beans',
      'Fluff quinoa and let cool slightly',
      'Combine quinoa, beans, vegetables',
      'Whisk olive oil and lemon juice',
      'Add dressing and toss',
      'Top with avocado and pumpkin seeds'
    ],
    nutrition: {
      calories: 485,
      protein: 18,
      carbs: 65,
      fat: 18,
      fiber: 15,
      iron: 5.2
    }
  },
  {
    id: 'ttc-zinc-trail-mix',
    title: 'Zinc-Rich Pumpkin Seed Trail Mix',
    description: 'Crunchy mix with pumpkin seeds, walnuts, and dark chocolate to support fertility.',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60',
    category: 'Snacks',
    tags: ['Zinc', 'Healthy Fats', 'No Cook'],
    journey: ['ttc'],
    stage: ['ttc-1-3','ttc-4-6','ttc-6-12','ttc-12+'],
    servings: 6,
    difficulty: 'Easy',
    ingredients: [
      '1 cup pumpkin seeds',
      '1/2 cup walnuts',
      '1/4 cup dark chocolate chips',
      '1/4 cup dried cranberries',
      '2 tbsp sunflower seeds',
      '1 tsp sea salt'
    ],
    instructions: [
      'Combine all ingredients in a large bowl',
      'Mix well to distribute evenly',
      'Store in airtight container',
      'Serve 1/4 cup portions'
    ],
    nutrition: {
      calories: 210,
      protein: 8,
      carbs: 12,
      fat: 16,
      fiber: 3
    }
  },
  {
    id: 'ttc-mediterranean-chickpea-salad',
    title: 'Mediterranean Chickpea Salad',
    description: 'Fiber-rich salad with olive oil and herbs for hormone harmony.',
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
    category: 'Lunch',
    tags: ['Fiber', 'Hormone Balance', 'Mediterranean'],
    journey: ['ttc'],
    stage: ['ttc-1-3','ttc-4-6','ttc-6-12','ttc-12+'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '1 can chickpeas, drained',
      '1 cucumber, diced',
      '1 cup cherry tomatoes, halved',
      '1/4 red onion, thinly sliced',
      '2 oz feta cheese, crumbled',
      '2 tbsp olive oil',
      '1 lemon, juiced',
      '1 tsp oregano',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Drain and rinse chickpeas',
      'Dice cucumber and halve tomatoes',
      'Slice red onion thinly',
      'Combine vegetables and chickpeas',
      'Whisk olive oil, lemon juice, and oregano',
      'Toss with dressing',
      'Top with feta cheese',
      'Season with salt and pepper'
    ],
    nutrition: {
      calories: 365,
      protein: 16,
      carbs: 42,
      fat: 16,
      fiber: 12
    }
  },

  // Additional TTC Recipes for complete meal plans
  {
    id: 'ttc-omega-salmon',
    title: 'Omega-3 Grilled Salmon',
    description: 'Wild salmon with herbs, rich in omega-3 fatty acids for reproductive health',
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1476127390620-9731f2a46f44',
    category: 'Dinner',
    tags: ['Omega-3', 'Protein', 'Brain Health'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '2 salmon fillets (6 oz each)',
      '2 tbsp olive oil',
      '1 lemon, sliced',
      '2 cloves garlic, minced',
      '1 tsp dried dill',
      'Salt and pepper to taste',
      '1 lb asparagus'
    ],
    instructions: [
      'Preheat grill to medium-high heat',
      'Season salmon with salt, pepper, and dill',
      'Brush with olive oil and top with garlic',
      'Grill salmon 4-5 minutes per side',
      'Grill asparagus alongside for 8-10 minutes',
      'Serve with lemon slices'
    ],
    nutrition: {
      calories: 420,
      protein: 35,
      carbs: 8,
      fat: 28,
      fiber: 4
    }
  },
  {
    id: 'ttc-spinach-omelet',
    title: 'Folate-Rich Spinach Omelet',
    description: 'Fluffy omelet packed with spinach and cheese for folate and protein',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
    category: 'Breakfast',
    tags: ['Folate', 'Protein', 'Quick'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '3 large eggs',
      '2 cups fresh spinach',
      '1/4 cup shredded cheese',
      '1 tbsp olive oil',
      '1 tbsp butter',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Whisk eggs with salt and pepper',
      'Heat olive oil in pan, sauté spinach until wilted',
      'Remove spinach, add butter to pan',
      'Pour in eggs, let set for 30 seconds',
      'Add spinach and cheese to half the omelet',
      'Fold omelet in half and serve'
    ],
    nutrition: {
      calories: 385,
      protein: 25,
      carbs: 3,
      fat: 30,
      folate: 165
    }
  },

  // Pregnancy Recipes
  {
    id: 'pregnancy-ginger-tea',
    title: 'Anti-Nausea Ginger Tea',
    description: 'Soothing tea to help manage morning sickness naturally',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344',
    category: 'Beverages',
    tags: ['Morning Sickness', 'Ginger', 'Soothing'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 inch fresh ginger, sliced',
      '2 cups water',
      '1 tsp honey',
      '1/2 lemon, juiced',
      '1 cinnamon stick (optional)'
    ],
    instructions: [
      'Bring water to boil in small pot',
      'Add sliced ginger and cinnamon stick',
      'Simmer for 8-10 minutes',
      'Strain into mug',
      'Add honey and lemon juice',
      'Sip slowly while warm'
    ],
    nutrition: {
      calories: 25,
      protein: 0,
      carbs: 7,
      fat: 0
    }
  },
  {
    id: 'pregnancy-calcium-rich-smoothie',
    title: 'Calcium-Rich Green Smoothie',
    description: 'Delicious way to get essential calcium for you and baby',
    prepTime: '8 min',
    image: 'https://images.unsplash.com/photo-1616685803520-e1bb4aa5f8e4',
    category: 'Smoothies',
    tags: ['Calcium', 'Prenatal Nutrition', 'Green'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 cup unsweetened almond milk',
      '1/2 cup Greek yogurt',
      '1 cup spinach',
      '1/2 banana',
      '1 tbsp almond butter',
      '1 tbsp chia seeds',
      '1 tsp vanilla extract',
      '1 tsp maple syrup'
    ],
    instructions: [
      'Add almond milk and spinach to blender',
      'Add yogurt, banana, and almond butter',
      'Add chia seeds, vanilla, and maple syrup',
      'Blend until smooth and creamy',
      'Add ice if desired consistency',
      'Serve immediately'
    ],
    nutrition: {
      calories: 285,
      protein: 15,
      carbs: 28,
      fat: 14,
      calcium: 450
    }
  },
  {
    id: 'pregnancy-protein-omelet',
    title: 'Protein-Packed Veggie Omelet',
    description: 'Fluffy omelet with spinach, bell peppers, and cheese to support steady energy',
    prepTime: '12 min',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
    category: 'Breakfast',
    tags: ['Protein', 'Energy', 'Easy'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '3 large eggs',
      '1 cup spinach',
      '1/2 bell pepper, diced',
      '1/4 cup shredded cheese',
      '1 tbsp olive oil',
      '1 tbsp butter',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Beat eggs with salt and pepper',
      'Heat oil in non-stick pan',
      'Sauté bell pepper until tender',
      'Add spinach, cook until wilted',
      'Remove vegetables, add butter',
      'Pour eggs, add vegetables and cheese',
      'Fold and serve hot'
    ],
    nutrition: {
      calories: 395,
      protein: 26,
      carbs: 6,
      fat: 30,
      calcium: 280
    }
  },
  {
    id: 'pregnancy-iron-boost-bowl',
    title: 'Iron-Boost Quinoa Bowl',
    description: 'Quinoa, lentils, and roasted veggies with vitamin C lemon-tahini dressing',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253',
    category: 'Lunch',
    tags: ['Iron', 'Fiber', 'Vegan'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '1 cup quinoa',
      '1/2 cup red lentils',
      '1 sweet potato, cubed',
      '1 bunch kale, chopped',
      '2 tbsp tahini',
      '1 lemon, juiced',
      '2 tbsp olive oil',
      '1 clove garlic, minced',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Cook quinoa and lentils separately',
      'Roast sweet potato at 400°F for 20 minutes',
      'Massage kale with olive oil',
      'Whisk tahini, lemon juice, and garlic',
      'Combine all ingredients in bowl',
      'Drizzle with dressing',
      'Season and serve'
    ],
    nutrition: {
      calories: 445,
      protein: 18,
      carbs: 58,
      fat: 18,
      iron: 6.5,
      fiber: 12
    }
  },
  {
    id: 'pregnancy-omega-salmon',
    title: 'Omega-3 Baked Salmon with Greens',
    description: 'Simple baked salmon served with sautéed greens and sweet potato',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1476127390620-9731f2a46f44',
    category: 'Dinner',
    tags: ['Omega-3', 'Brain Development', 'Protein'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '2 salmon fillets (6 oz each)',
      '1 large sweet potato',
      '4 cups mixed greens',
      '2 cloves garlic, minced',
      '3 tbsp olive oil',
      '1 lemon, sliced',
      'Salt and pepper to taste',
      '1 tsp dried herbs'
    ],
    instructions: [
      'Preheat oven to 400°F',
      'Slice sweet potato, drizzle with oil',
      'Roast sweet potato for 25 minutes',
      'Season salmon, bake for 15 minutes',
      'Sauté greens with garlic',
      'Serve salmon over greens with sweet potato'
    ],
    nutrition: {
      calories: 465,
      protein: 35,
      carbs: 25,
      fat: 25,
      fiber: 5
    }
  },
  {
    id: 'pregnancy-overnight-oats',
    title: 'Fiber-Rich Overnight Oats',
    description: 'Creamy oats with chia, berries, and almond butter to support digestion',
    prepTime: '5 min (+overnight)',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea',
    category: 'Breakfast',
    tags: ['Fiber', 'Make Ahead', 'Gut Health'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1/2 cup rolled oats',
      '1 tbsp chia seeds',
      '1 tbsp almond butter',
      '1 cup almond milk',
      '1 tsp maple syrup',
      '1/2 cup berries',
      '1 tsp vanilla extract'
    ],
    instructions: [
      'Combine oats, chia seeds in jar',
      'Whisk almond butter with milk',
      'Add maple syrup and vanilla',
      'Pour over oats, stir well',
      'Refrigerate overnight',
      'Top with berries before serving'
    ],
    nutrition: {
      calories: 315,
      protein: 10,
      carbs: 42,
      fat: 12,
      fiber: 12
    }
  },
  {
    id: 'pregnancy-snack-box',
    title: 'Prenatal Snack Box',
    description: 'Balanced snack with Greek yogurt, walnuts, and fresh fruit for stable blood sugar',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Snacks',
    tags: ['Balanced', 'Quick', 'No Cook'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester', 'pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 cup Greek yogurt',
      '1/4 cup walnuts',
      '1/2 apple, sliced',
      '1 tbsp honey',
      '1 tsp cinnamon'
    ],
    instructions: [
      'Place yogurt in bowl',
      'Slice apple into wedges',
      'Top yogurt with walnuts',
      'Arrange apple slices',
      'Drizzle with honey',
      'Sprinkle with cinnamon'
    ],
    nutrition: {
      calories: 285,
      protein: 18,
      carbs: 28,
      fat: 12,
      fiber: 4
    }
  },
  
  // Postpartum Recipes
  {
    id: 'postpartum-healing-soup',
    title: 'Postpartum Healing Soup',
    description: 'Warming, nutrient-dense soup to support recovery',
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    category: 'Soups',
    tags: ['Healing', 'Warming', 'Iron Rich'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '2 lbs beef bones',
      '1 onion, chopped',
      '2 carrots, chopped',
      '2 celery stalks, chopped',
      '1 bunch kale, chopped',
      '1 cup red lentils',
      '6 cups water',
      '2 bay leaves',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Roast bones at 400°F for 30 minutes',
      'Add bones to pot with water',
      'Simmer for 2 hours, skim foam',
      'Add vegetables and lentils',
      'Cook 30 minutes more',
      'Remove bones, season and serve'
    ],
    nutrition: {
      calories: 285,
      protein: 22,
      carbs: 25,
      fat: 8,
      iron: 4.5,
      fiber: 8
    }
  },
  {
    id: 'lactation-cookies',
    title: 'Lactation Support Cookies',
    description: 'Delicious cookies with ingredients to support milk production',
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1606913947356-89296d414c0b',
    category: 'Snacks',
    tags: ['Lactation', 'Oats', 'Batch Cook'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12', 'postpartum-3-6m'],
    servings: 24,
    difficulty: 'Easy',
    ingredients: [
      '3 cups oats',
      '1 cup flour',
      '5 tbsp brewers yeast',
      '3 tbsp flax meal',
      '1/2 cup coconut oil',
      '1/2 cup brown sugar',
      '2 eggs',
      '1 tsp vanilla',
      '1 cup chocolate chips'
    ],
    instructions: [
      'Preheat oven to 350°F',
      'Mix dry ingredients',
      'Cream coconut oil and sugar',
      'Add eggs and vanilla',
      'Combine wet and dry ingredients',
      'Fold in chocolate chips',
      'Bake 12-15 minutes'
    ],
    nutrition: {
      calories: 165,
      protein: 4,
      carbs: 22,
      fat: 7,
      fiber: 3
    }
  },
  
  // Toddler Mom Recipes
  {
    id: 'family-veggie-muffins',
    title: 'Hidden Veggie Muffins',
    description: 'Kid-approved muffins packed with vegetables',
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35',
    category: 'Snacks',
    tags: ['Kid Friendly', 'Hidden Veggies', 'Batch Cook'],
    journey: ['toddler'],
    stage: ['toddler-1-2', 'toddler-2-3', 'toddler-3+'],
    servings: 12,
    difficulty: 'Medium',
    ingredients: [
      '2 cups flour',
      '1 cup grated carrots',
      '1 cup grated zucchini',
      '1/2 cup applesauce',
      '1/3 cup honey',
      '2 eggs',
      '1/2 cup milk',
      '1 tsp baking powder',
      '1/2 tsp salt'
    ],
    instructions: [
      'Preheat oven to 375°F',
      'Mix flour, baking powder, salt',
      'Combine wet ingredients',
      'Fold in grated vegetables',
      'Fill muffin cups 2/3 full',
      'Bake 18-20 minutes'
    ],
    nutrition: {
      calories: 145,
      protein: 4,
      carbs: 28,
      fat: 2,
      fiber: 2
    }
  },
  {
    id: 'quick-family-pasta',
    title: 'One-Pot Family Pasta',
    description: 'Quick, nutritious pasta that pleases both kids and adults',
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5',
    category: 'Dinner',
    tags: ['One Pot', 'Family Friendly', 'Quick'],
    journey: ['toddler'],
    stage: ['toddler-1-2', 'toddler-2-3', 'toddler-3+'],
    servings: 6,
    difficulty: 'Easy',
    ingredients: [
      '1 lb whole wheat pasta',
      '1 jar marinara sauce',
      '1 lb ground turkey',
      '1 zucchini, diced',
      '1 bell pepper, diced',
      '1 cup spinach',
      '1 cup mozzarella cheese',
      '2 cloves garlic, minced',
      'Italian seasoning'
    ],
    instructions: [
      'Brown turkey in large pot',
      'Add garlic and vegetables',
      'Add pasta and sauce',
      'Add enough water to cover',
      'Simmer until pasta is tender',
      'Stir in spinach and cheese',
      'Serve immediately'
    ],
    nutrition: {
      calories: 385,
      protein: 28,
      carbs: 48,
      fat: 8,
      fiber: 6
    }
  }
];

export const mealPlans: MealPlan[] = [
  // TTC Meal Plans
  {
    id: 'ttc-fertility-boost-plan',
    title: 'Fertility Boost Meal Plan',
    description: 'Two weeks of fertility-supporting meals rich in folate, antioxidants, and healthy fats',
    duration: '2 Week Plan',
    recipeCount: 14,
    avgPrepTime: '20-30 min/meal',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Fertility',
    tags: ['Fertility', 'Hormone Balance', 'Nutrient Dense'],
    journey: ['ttc'],
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+'],
    recipes: [
      recipes.find(r => r.id === 'ttc-fertility-smoothie'),
      recipes.find(r => r.id === 'ttc-quinoa-power-bowl'),
      recipes.find(r => r.id === 'ttc-zinc-trail-mix'),
      recipes.find(r => r.id === 'ttc-mediterranean-chickpea-salad'),
      recipes.find(r => r.id === 'ttc-omega-salmon'),
      recipes.find(r => r.id === 'ttc-spinach-omelet')
    ].filter(Boolean)
  },
  {
    id: 'ttc-hormone-harmony-plan',
    title: 'Hormone Harmony Meal Plan',
    description: 'Balanced 3-week plan focusing on fiber, omega-3s, and micronutrients to support cycles.',
    duration: '3 Week Plan',
    recipeCount: 21,
    avgPrepTime: '15-30 min/meal',
    image: 'https://images.unsplash.com/photo-1543339318-b43dc53e19b3',
    category: 'Fertility',
    tags: ['Hormone Balance','Omega-3','Folate'],
    journey: ['ttc'],
    stage: ['ttc-1-3','ttc-4-6','ttc-6-12','ttc-12+'],
    recipes: [
      recipes.find(r => r.id === 'ttc-fertility-smoothie'),
      recipes.find(r => r.id === 'ttc-quinoa-power-bowl'),
      recipes.find(r => r.id === 'ttc-zinc-trail-mix'),
      recipes.find(r => r.id === 'ttc-mediterranean-chickpea-salad'),
      recipes.find(r => r.id === 'ttc-omega-salmon'),
      recipes.find(r => r.id === 'ttc-spinach-omelet')
    ].filter(Boolean)
  },
  
  // Pregnancy Meal Plans
  {
    id: 'pregnancy-first-trimester-plan',
    title: 'First Trimester Comfort Plan',
    description: 'Gentle, nausea-friendly meals for early pregnancy',
    duration: '4 Week Plan',
    recipeCount: 28,
    avgPrepTime: '15-25 min/meal',
    image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344',
    category: 'Pregnancy',
    tags: ['Morning Sickness', 'Gentle', 'Easy Digestion'],
    journey: ['pregnant'],
    stage: ['pregnant-1st-trimester'],
    recipes: [
      recipes.find(r => r.id === 'pregnancy-ginger-tea'),
      recipes.find(r => r.id === 'pregnancy-protein-omelet'),
      recipes.find(r => r.id === 'pregnancy-overnight-oats'),
      recipes.find(r => r.id === 'pregnancy-snack-box')
    ].filter(Boolean)
  },
  {
    id: 'pregnancy-growth-plan',
    title: 'Baby Growth Nutrition Plan',
    description: 'Nutrient-dense meals for second and third trimester development',
    duration: '6 Week Plan',
    recipeCount: 42,
    avgPrepTime: '25-35 min/meal',
    image: 'https://images.unsplash.com/photo-1616685803520-e1bb4aa5f8e4',
    category: 'Pregnancy',
    tags: ['Baby Development', 'Calcium Rich', 'Iron'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    recipes: [
      recipes.find(r => r.id === 'pregnancy-calcium-rich-smoothie'),
      recipes.find(r => r.id === 'pregnancy-iron-boost-bowl'),
      recipes.find(r => r.id === 'pregnancy-omega-salmon'),
      recipes.find(r => r.id === 'pregnancy-overnight-oats'),
      recipes.find(r => r.id === 'pregnancy-snack-box')
    ].filter(Boolean)
  },
  {
    id: 'pregnancy-third-trimester-comfort',
    title: 'Third Trimester Comfort Plan',
    description: 'Heartburn-friendly, magnesium-rich meals to support sleep and comfort',
    duration: '3 Week Plan',
    recipeCount: 21,
    avgPrepTime: '20-30 min/meal',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0',
    category: 'Pregnancy',
    tags: ['Heartburn Friendly', 'Magnesium', 'Sleep Support'],
    journey: ['pregnant'],
    stage: ['pregnant-3rd-trimester'],
    recipes: [
      recipes.find(r => r.id === 'pregnancy-calcium-rich-smoothie'),
      recipes.find(r => r.id === 'pregnancy-omega-salmon'),
      recipes.find(r => r.id === 'pregnancy-overnight-oats'),
      recipes.find(r => r.id === 'pregnancy-snack-box')
    ].filter(Boolean)
  },
  {
    id: 'gestational-diabetes-support',
    title: 'Gestational Diabetes Support Plan',
    description: 'Balanced, low glycemic meals to stabilize blood sugar during pregnancy',
    duration: '4 Week Plan',
    recipeCount: 28,
    avgPrepTime: '20-30 min/meal',
    image: 'https://images.unsplash.com/photo-1526312426976-593c017fcf2c',
    category: 'Pregnancy',
    tags: ['Low GI', 'Balanced Carbs', 'Protein Focus'],
    journey: ['pregnant'],
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester'],
    recipes: [
      recipes.find(r => r.id === 'pregnancy-protein-omelet'),
      recipes.find(r => r.id === 'pregnancy-iron-boost-bowl'),
      recipes.find(r => r.id === 'pregnancy-omega-salmon'),
      recipes.find(r => r.id === 'pregnancy-snack-box')
    ].filter(Boolean)
  },
  
  // Postpartum Meal Plans
  {
    id: 'postpartum-recovery-plan',
    title: 'Postpartum Recovery Meal Plan',
    description: 'Nutrient-dense meals designed to support healing and milk production',
    duration: '4 Week Plan',
    recipeCount: 28,
    avgPrepTime: '20-30 min/meal',
    image: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5',
    category: 'Postpartum',
    tags: ['Recovery', 'Lactation', 'Healing'],
    journey: ['postpartum'],
    stage: ['postpartum-0-6', 'postpartum-6-12'],
    recipes: [
      recipes.find(r => r.id === 'postpartum-healing-soup'),
      recipes.find(r => r.id === 'lactation-cookies')
    ].filter(Boolean)
  },
  {
    id: 'energy-balance-plan',
    title: 'Energy & Balance Meal Plan',
    description: 'Optimize your energy levels and hormonal balance with nutrient-balanced meals',
    duration: '4 Week Plan',
    recipeCount: 24,
    avgPrepTime: '15-40 min/meal',
    image: 'https://images.unsplash.com/photo-1543339318-b43dc53e19b3',
    category: 'Postpartum',
    tags: ['Energy', 'Hormone Balance', 'Weight Management'],
    journey: ['postpartum'],
    stage: ['postpartum-3-6m', 'postpartum-6-12m', 'postpartum-12m+'],
    recipes: [
      recipes.find(r => r.id === 'postpartum-healing-soup'),
      recipes.find(r => r.id === 'lactation-cookies')
    ].filter(Boolean)
  },
  
  // Toddler Mom Meal Plans
  {
    id: 'family-friendly-plan',
    title: 'Family-Friendly Meal Plan',
    description: 'Wholesome meals that work for the whole family, including picky toddlers',
    duration: '3 Week Plan',
    recipeCount: 21,
    avgPrepTime: '20-30 min/meal',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5',
    category: 'Family',
    tags: ['Kid Friendly', 'Family Meals', 'Quick Prep'],
    journey: ['toddler'],
    stage: ['toddler-1-2', 'toddler-2-3', 'toddler-3+'],
    recipes: [
      recipes.find(r => r.id === 'family-veggie-muffins'),
      recipes.find(r => r.id === 'quick-family-pasta')
    ].filter(Boolean)
  }
];

export { type Recipe, type MealPlan };