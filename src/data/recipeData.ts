import { ContentItem } from '@/hooks/useContentFilter';

interface Recipe extends ContentItem {
  prepTime: string;
  image: string;
  servings?: number;
  difficulty?: string;
}

interface MealPlan extends ContentItem {
  duration: string;
  recipeCount: number;
  avgPrepTime: string;
  image: string;
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
    difficulty: 'Easy'
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
    difficulty: 'Medium'
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
    difficulty: 'Easy'
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
    difficulty: 'Easy'
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
    difficulty: 'Easy'
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
    difficulty: 'Medium'
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
    difficulty: 'Easy'
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
    difficulty: 'Easy'
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
    difficulty: 'Easy'
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
    difficulty: 'Medium'
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
    difficulty: 'Easy'
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
    difficulty: 'Medium'
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
    difficulty: 'Easy'
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
    stage: ['ttc-1-3', 'ttc-4-6', 'ttc-6-12', 'ttc-12+']
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
    stage: ['pregnant-1st-trimester']
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
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester']
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
    stage: ['pregnant-3rd-trimester']
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
    stage: ['pregnant-2nd-trimester', 'pregnant-3rd-trimester']
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
    stage: ['postpartum-0-6', 'postpartum-6-12']
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
    stage: ['postpartum-3-6m', 'postpartum-6-12m', 'postpartum-12m+']
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
    stage: ['toddler-1-2', 'toddler-2-3', 'toddler-3+']
  }
];