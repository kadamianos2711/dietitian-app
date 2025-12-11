import { FoodItem } from '@/types/engine';

export const FOOD_DB: FoodItem[] = [
    // --- STARCH ---
    {
        id: 'f_rice_basmati',
        name: 'Ρύζι Μπασμάτι',
        category: 'Starch',
        form: 'raw',
        conversionFactor: 3.0,
        macros: { calories: 350, protein: 7, carbs: 78, fat: 0.5, fiber: 1 },
        tags: ['gluten-free', 'easy-digest', 'gastritis-friendly', 'low-fodmap'],
        cost: 'cheap'
    },
    {
        id: 'f_rice_brown',
        name: 'Ρύζι Καστανό',
        category: 'Starch',
        form: 'raw',
        conversionFactor: 2.8,
        macros: { calories: 360, protein: 7.5, carbs: 76, fat: 2.5, fiber: 3.5 },
        tags: ['gluten-free', 'diabetes-friendly', 'constipation-friendly', 'cholesterol-friendly'],
        cost: 'cheap'
    },
    {
        id: 'f_oats',
        name: 'Βρώμη',
        category: 'Starch',
        form: 'raw',
        conversionFactor: 3.5, // Porridge texture
        macros: { calories: 370, protein: 13, carbs: 60, fat: 7, fiber: 10 },
        tags: ['cholesterol-friendly', 'diabetes-friendly', 'constipation-friendly', 'vegan', 'breakfast'],
        cost: 'cheap'
    },
    {
        id: 'f_potato',
        name: 'Πατάτα',
        category: 'Starch',
        form: 'raw',
        conversionFactor: 0.9, // Roasted/Boiled slight loss
        macros: { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
        tags: ['gluten-free', 'easy-digest', 'low-fodmap', 'gastritis-friendly'],
        micros: { potassium: 420, vitaminC: 19 },
        cost: 'cheap'
    },
    {
        id: 'f_quinoa',
        name: 'Κινόα',
        category: 'Starch',
        form: 'raw',
        conversionFactor: 3.0,
        macros: { calories: 368, protein: 14, carbs: 64, fat: 6, fiber: 7 },
        tags: ['gluten-free', 'vegan', 'high-protein', 'diabetes-friendly', 'nafld-friendly'],
        cost: 'expensive'
    },

    // --- PROTEIN ---
    {
        id: 'f_chicken_breast',
        name: 'Κοτόπουλο Στήθος',
        category: 'Protein',
        form: 'raw',
        conversionFactor: 0.75, // Shrinks
        macros: { calories: 120, protein: 23, carbs: 0, fat: 2.5, fiber: 0 },
        tags: ['high-protein', 'easy-digest', 'gastritis-friendly', 'ibs-friendly', 'low-fodmap'],
        micros: { vitaminB3: 13, selenium: 25 },
        cost: 'moderate'
    },
    {
        id: 'f_beef_mince',
        name: 'Κιμάς Μοσχαρίσιος (άπαχος)',
        category: 'Protein',
        form: 'raw',
        conversionFactor: 0.70,
        macros: { calories: 180, protein: 20, carbs: 0, fat: 10 },
        tags: ['high-protein', 'iron'],
        micros: { iron: 2.5, zinc: 5, vitaminB12: 2.5 },
        cost: 'moderate'
    },
    {
        id: 'f_fish_tsipoura',
        name: 'Τσιπούρα',
        category: 'Protein',
        form: 'raw',
        conversionFactor: 0.75, // Whole fish -> fillet different but here simplest
        macros: { calories: 110, protein: 18, carbs: 0, fat: 4 },
        tags: ['high-protein', 'cholesterol-friendly', 'diabetes-friendly', 'nafld-friendly', 'gluten-free'],
        micros: { omega3: 1000, vitaminD: 5 }, // Mock generic
        cost: 'expensive'
    },
    {
        id: 'f_egg',
        name: 'Αυγό',
        category: 'Protein',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 140, protein: 12, carbs: 1, fat: 10 }, // Per 100g (~2 eggs)
        tags: ['high-protein', 'vegetarian', 'gastritis-friendly'],
        micros: { vitaminD: 2, vitaminB12: 1, selenium: 30 },
        cost: 'cheap'
    },

    // --- VEGETABLES ---
    {
        id: 'f_lettuce',
        name: 'Μαρούλι',
        category: 'Vegetables',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 15, protein: 1, carbs: 3, fat: 0.2, fiber: 1.5 },
        tags: ['diabetes-friendly', 'low-carb', 'vegan'],
        cost: 'cheap'
    },
    {
        id: 'f_tomato',
        name: 'Ντομάτα',
        category: 'Vegetables',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 18, protein: 1, carbs: 4, fat: 0.2, fiber: 1.2 },
        tags: ['vegan', 'oxidants'],
        micros: { vitaminC: 14, lycopene: 2500 },
        cost: 'cheap'
    },
    {
        id: 'f_beans_green',
        name: 'Φασολάκια',
        category: 'Vegetables',
        form: 'raw',
        conversionFactor: 0.95,
        macros: { calories: 31, protein: 1.8, carbs: 7, fat: 0.2, fiber: 3.4 },
        tags: ['diabetes-friendly', 'vegan', 'constipation-friendly'],
        cost: 'cheap'
    },

    // --- FRUITS ---
    {
        id: 'f_apple',
        name: 'Μήλο',
        category: 'Fruits',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
        tags: ['vegan', 'constipation-friendly', 'snack'],
        cost: 'cheap'
    },

    // --- DAIRY ---
    {
        id: 'f_yogurt',
        name: 'Γιαούρτι 2%',
        category: 'Dairy',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 60, protein: 10, carbs: 4, fat: 2 },
        tags: ['vegetarian', 'high-protein', 'ibs-friendly', 'easy-digest'],
        micros: { calcium: 150, phosphorus: 100 },
        cost: 'cheap'
    },

    // --- FATS ---
    {
        id: 'f_olive_oil',
        name: 'Ελαιόλαδο',
        category: 'Fats',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 884, protein: 0, carbs: 0, fat: 100, saturated: 14 },
        tags: ['vegan', 'cholesterol-friendly', 'diabetes-friendly', 'nafld-friendly'],
        micros: { vitaminE: 14 },
        cost: 'moderate'
    },
    {
        id: 'f_walnuts',
        name: 'Καρύδια',
        category: 'Fats',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 7 },
        tags: ['vegan', 'cholesterol-friendly', 'omega-3', 'snack'],
        cost: 'expensive'
    },
    {
        id: 'f_almonds',
        name: 'Αμύγδαλα',
        category: 'Fats',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12 },
        tags: ['vegan', 'cholesterol-friendly', 'nafld-friendly', 'snack'],
        cost: 'expensive'
    },

    // --- LEGUMES ---
    {
        id: 'f_lentils',
        name: 'Φακές',
        category: 'Starch', // Dominated by starch/protein
        form: 'raw',
        conversionFactor: 2.5,
        macros: { calories: 350, protein: 24, carbs: 63, fat: 1, fiber: 11 },
        tags: ['vegan', 'high-protein', 'high-fiber', 'constipation-friendly', 'iron'],
        cost: 'cheap'
    },
    {
        id: 'f_chickpeas',
        name: 'Ρεβύθια',
        category: 'Starch',
        form: 'raw',
        conversionFactor: 2.2,
        macros: { calories: 360, protein: 19, carbs: 61, fat: 6, fiber: 17 },
        tags: ['vegan', 'high-protein', 'high-fiber', 'constipation-friendly'],
        cost: 'cheap'
    },

    // --- DAIRY & CHEESE ---
    {
        id: 'f_feta',
        name: 'Φέτα',
        category: 'Dairy',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 260, protein: 14, carbs: 4, fat: 21 },
        tags: ['vegetarian', 'high-fat', 'calcium'],
        cost: 'moderate'
    },
    {
        id: 'f_cottage',
        name: 'Cottage Cheese',
        category: 'Dairy',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 98, protein: 11, carbs: 3, fat: 4 },
        tags: ['vegetarian', 'high-protein', 'low-fat', 'diet-friendly'],
        cost: 'moderate'
    },

    // --- PROTEIN (Extra) ---
    {
        id: 'f_chicken_thigh',
        name: 'Κοτόπουλο Μπούτι',
        category: 'Protein',
        form: 'raw',
        conversionFactor: 0.70,
        macros: { calories: 170, protein: 19, carbs: 0, fat: 10 },
        tags: ['high-protein', 'keto-friendly'],
        cost: 'moderate'
    },
    {
        id: 'f_salmon',
        name: 'Σολομός',
        category: 'Protein',
        form: 'raw',
        conversionFactor: 0.80,
        macros: { calories: 200, protein: 20, carbs: 0, fat: 13 },
        tags: ['high-protein', 'omega-3', 'cholesterol-friendly', 'nafld-friendly'],
        cost: 'expensive'
    },

    // --- VEGETABLES (Extra) ---
    {
        id: 'f_spinach',
        name: 'Σπανάκι',
        category: 'Vegetables',
        form: 'raw',
        conversionFactor: 0.8, // Wilts heavily
        macros: { calories: 23, protein: 3, carbs: 4, fat: 0.4, fiber: 2.2 },
        tags: ['vegan', 'iron', 'low-carb', 'keto-friendly'],
        cost: 'cheap'
    },
    {
        id: 'f_cucumber',
        name: 'Αγγούρι',
        category: 'Vegetables',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 15, protein: 1, carbs: 4, fat: 0, fiber: 0.5 },
        tags: ['vegan', 'low-cal', 'hydrating'],
        cost: 'cheap'
    },
    {
        id: 'f_broccoli',
        name: 'Μπρόκολο',
        category: 'Vegetables',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
        tags: ['vegan', 'high-fiber', 'detox', 'nafld-friendly'],
        cost: 'moderate'
    },

    // --- FRUITS (Extra) ---
    {
        id: 'f_banana',
        name: 'Μπανάνα',
        category: 'Fruits',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
        tags: ['vegan', 'potassium', 'energy', 'easy-digest'],
        cost: 'cheap'
    },
    {
        id: 'f_orange',
        name: 'Πορτοκάλι',
        category: 'Fruits',
        form: 'raw',
        conversionFactor: 1.0,
        macros: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 },
        tags: ['vegan', 'vitamin-c', 'easy-digest'],
        cost: 'cheap'
    }
];
