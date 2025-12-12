import { ClientFormData } from './client';
import { DailyContext } from './context';

export type FoodTag =
    | 'breakfast' | 'snack' | 'main' | 'salad' | 'smoothie' | 'meal-prep' | 'drink' // Usage
    | 'vegan' | 'vegetarian' | 'gluten-free' | 'lactose-free' | 'fasting' // Dietary
    | 'diabetes-friendly' | 'cholesterol-friendly' | 'hypertension-friendly' | 'contralipid' // Pathology
    | 'kidney-friendly' | 'uric-acid-friendly' | 'nafld-friendly'
    | 'constipation-friendly' | 'ibs-friendly' | 'low-fodmap' | 'gastritis-friendly'
    | 'gluten-intolerance-friendly' | 'easy-digest' | 'high-protein' | 'low-carb'
    | 'high-fiber' | 'omega-3' | 'iron' | 'calcium' | 'oxidants'; // Added nutrient tags

export type FoodCategory =
    | 'Fruits' | 'Vegetables' | 'Protein' | 'Starch'
    | 'Dairy' | 'Fats' | 'Snacks' | 'Other';

export type FoodForm = 'raw' | 'cooked';

export type CostLevel = 'cheap' | 'moderate' | 'expensive';

export interface Micronutrients {
    // Minerals
    sodium?: number; // mg
    potassium?: number; // mg
    calcium?: number; // mg
    magnesium?: number; // mg
    phosphorus?: number; // mg
    iron?: number; // mg
    zinc?: number; // mg
    selenium?: number; // ug
    iodine?: number; // ug
    // Vitamins
    vitaminA?: number; // ug
    vitaminD?: number; // ug
    vitaminE?: number; // mg
    vitaminK?: number; // ug
    vitaminC?: number; // mg
    vitaminB1?: number; // mg
    vitaminB2?: number; // mg
    vitaminB3?: number; // mg
    vitaminB5?: number; // mg
    vitaminB6?: number; // mg
    vitaminB9?: number; // ug
    vitaminB12?: number; // ug
}

export interface FoodItem {
    id: string;
    name: string;
    category: FoodCategory;
    form: FoodForm;
    conversionFactor: number; // raw -> cooked (e.g. 3.0 for rice)
    macros: {
        calories: number; // per 100g
        protein: number;
        carbs: number;
        sugars?: number;
        fat: number;
        saturated?: number;
        monounsaturated?: number;
        polyunsaturated?: number;
        fiber?: number;
    };
    micros?: Micronutrients;
    tags: FoodTag[];
    cost?: CostLevel;

    // UI Helpers
    isLiquid?: boolean; // ml vs g
}

export type RecipeCategory =
    | 'breakfast' | 'snack' | 'main' | 'dinner'
    | 'dessert' | 'salad' | 'smoothie' | 'meal-prep';

export type RecipeTime = 'very_fast' | 'fast' | 'moderate' | 'slow';
export type RecipeDifficulty = 'very_easy' | 'easy' | 'moderate' | 'hard';
export type RecipeCost = 'cheap' | 'moderate' | 'expensive';

export interface RecipeIngredient {
    foodId: string; // Link to FoodItem
    name: string; // Display name override or snapshot
    amount: number; // Raw amount in grams
    unit?: string; // 'g', 'ml', 'pcs'
    note?: string; // 'chopped', etc.
}

export interface Recipe {
    id: string;
    name: string;
    category: RecipeCategory;
    description: string;
    instructions: string[]; // Bullets
    servings: number;

    time: RecipeTime;
    difficulty: RecipeDifficulty;
    cost: RecipeCost;

    tags: FoodTag[];

    ingredients: RecipeIngredient[];

    // Per serving calculated (or manual override)
    macros: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber?: number;
    };
    baseGrams?: number; // Total weight per serving (cooked usually)
}

export interface PlanSettings {
    calories: number;
    mealsCount: number; // 4 - 7
    startDate: string;
    dailyContexts?: DailyContext[];
    randomize?: boolean;
}

export type MealType = 'breakfast' | 'snack' | 'lunch' | 'dinner';

export interface DailyPlan {
    date: string;
    dayNumber: number;
    meals: Record<string, DietMeal>; // key: 'breakfast', 'snack1', etc.
    totalCalories: number;
    totalCalories: number;
    macros: { protein: number; carbs: number; fat: number };
    context?: DailyContext;
}

export interface DietMeal {
    id: string; // unique ID
    recipeId: string;
    recipeName: string;
    description: string; // "120g Kotopoulo..."
    calories: number;
    type: MealType;
    ingredients: { name: string; amount: number; unit?: string; foodId: string }[]; // Structured for editing
    locked?: boolean;
}

export interface WeeklyPlan {
    days: DailyPlan[];
    averageCalories: number;
}
