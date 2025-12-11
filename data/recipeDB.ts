import { Recipe } from '@/types/engine';
import { FOOD_DB } from './foodDB';

// Helper to look up macros from FoodDB for estimation if needed, but we will hardcode recipe macros for now
// to match the requested prototype speed, but we use the ID linking.

export const RECIPE_DB: Recipe[] = [
    // --- BREAKFAST ---
    {
        id: 'r_oats_yogurt',
        name: 'Βρώμη με Γιαούρτι και Φρούτα',
        category: 'breakfast',
        description: 'Ιδανικό πρωινό πλούσιο σε φυτικές ίνες και πρωτεΐνη.',
        servings: 1,
        time: 'very_fast',
        difficulty: 'very_easy',
        cost: 'cheap',
        tags: ['breakfast', 'diabetes-friendly', 'high-protein', 'vegetarian', 'constipation-friendly'],
        macros: { calories: 350, protein: 20, carbs: 45, fat: 8, fiber: 8 },
        ingredients: [
            { foodId: 'f_oats', name: 'Βρώμη', amount: 50, unit: 'g' },
            { foodId: 'f_yogurt', name: 'Γιαούρτι 2%', amount: 150, unit: 'g' },
            { foodId: 'f_apple', name: 'Μήλο', amount: 100, unit: 'g' }
        ],
        instructions: [
            '1. Βάλτε τη βρώμη σε ένα μπολ.',
            '2. Προσθέστε το γιαούρτι και ανακατέψτε.',
            '3. Κόψτε το μήλο σε κομματάκια και προσθέστε το από πάνω.'
        ]
    },
    {
        id: 'r_omelet_veg',
        name: 'Ομελέτα με Λαχανικά',
        category: 'breakfast',
        description: 'Χορταστική ομελέτα, χαμηλή σε υδατάνθρακες.',
        servings: 1,
        time: 'fast',
        difficulty: 'easy',
        cost: 'cheap',
        tags: ['breakfast', 'low-carb', 'diabetes-friendly', 'gluten-free', 'high-protein', 'ibs-friendly'],
        macros: { calories: 320, protein: 22, carbs: 8, fat: 20 },
        ingredients: [
            { foodId: 'f_egg', name: 'Αυγά', amount: 120, unit: 'g' }, // ~2 eggs
            { foodId: 'f_lettuce', name: 'Λαχανικά (Πιπεριά/Σπανάκι)', amount: 50, unit: 'g', note: 'ψιλοκομμένα' },
            { foodId: 'f_olive_oil', name: 'Ελαιόλαδο', amount: 5, unit: 'ml' }
        ],
        instructions: [
            '1. Χτυπήστε τα αυγά σε ένα μπολ.',
            '2. Σοτάρετε ελαφρά τα λαχανικά στο τηγάνι με ελαιόλαδο.',
            '3. Ρίξτε τα αυγά και ψήστε μέχρι να σφίξει η ομελέτα.'
        ]
    },
    {
        id: 'r_tahini_bread',
        name: 'Ψωμί ολικής με Ταχίνι και Μέλι',
        category: 'breakfast',
        description: 'Γρήγορο και θρεπτικό, ιδανικό για ενέργεια.',
        servings: 1,
        time: 'very_fast',
        difficulty: 'very_easy',
        cost: 'cheap',
        tags: ['breakfast', 'vegetarian', 'cholesterol-friendly', 'constipation-friendly', 'fasting'],
        macros: { calories: 380, protein: 12, carbs: 48, fat: 16 },
        ingredients: [
            { foodId: 'f_rusks', name: 'Ψωμί Ολικής (ή φρυγανιές)', amount: 60, unit: 'g' }, // Using rusks as proxy
            { foodId: 'f_tahini', name: 'Ταχίνι', amount: 15, unit: 'g' },
            { foodId: 'f_honey', name: 'Μέλι', amount: 10, unit: 'g' }
        ],
        instructions: [
            '1. Αλείψτε το ταχίνι στο ψωμί.',
            '2. Περιχύστε με το μέλι.'
        ]
    },

    // --- SNACKS ---
    {
        id: 'r_fruit_nuts',
        name: 'Φρούτο και Αμύγδαλα',
        category: 'snack',
        description: 'Κλασικό υγιεινό σνακ.',
        servings: 1,
        time: 'very_fast',
        difficulty: 'very_easy',
        cost: 'cheap',
        tags: ['snack', 'diabetes-friendly', 'vegetarian', 'gluten-free', 'cholesterol-friendly', 'nafld-friendly', 'vegan'],
        macros: { calories: 180, protein: 5, carbs: 20, fat: 10 },
        ingredients: [
            { foodId: 'f_apple', name: 'Μήλο', amount: 120, unit: 'g' },
            { foodId: 'f_almonds', name: 'Αμύγδαλα', amount: 15, unit: 'g' }
        ],
        instructions: ['1. Πλύντε το φρούτο και καταναλώστε με τους ξηρούς καρπούς.']
    },
    {
        id: 'r_yogurt_walnut',
        name: 'Γιαούρτι με Καρύδια',
        category: 'snack',
        description: 'Πλούσιο σε προβιοτικά και καλά λιπαρά.',
        servings: 1,
        time: 'very_fast',
        difficulty: 'very_easy',
        cost: 'cheap',
        tags: ['snack', 'high-protein', 'low-carb', 'gluten-free', 'ibs-friendly'],
        macros: { calories: 200, protein: 12, carbs: 10, fat: 12 },
        ingredients: [
            { foodId: 'f_yogurt', name: 'Γιαούρτι 2%', amount: 150, unit: 'g' },
            { foodId: 'f_walnuts', name: 'Καρύδια', amount: 10, unit: 'g' }
        ],
        instructions: ['1. Προσθέστε τα καρύδια στο γιαούρτι.']
    },

    // --- MAIN ---
    {
        id: 'r_chicken_rice',
        name: 'Κοτόπουλο Φιλέτο με Ρύζι',
        category: 'main',
        description: 'Ελαφρύ γεύμα, εύπεπτο.',
        servings: 1,
        time: 'moderate',
        difficulty: 'easy',
        cost: 'moderate',
        tags: ['main', 'high-protein', 'easy-digest', 'gluten-free', 'ibs-friendly', 'gastritis-friendly'],
        macros: { calories: 450, protein: 35, carbs: 45, fat: 12 },
        ingredients: [
            { foodId: 'f_chicken_breast', name: 'Κοτόπουλο Στήθος', amount: 150, unit: 'g' }, // Raw
            { foodId: 'f_rice_basmati', name: 'Ρύζι Μπασμάτι', amount: 60, unit: 'g' }, // Raw
            { foodId: 'f_olive_oil', name: 'Ελαιόλαδο', amount: 10, unit: 'ml' }
        ],
        instructions: [
            '1. Βράστε το ρύζι.',
            '2. Ψήστε το φιλέτο στο αντικολλητικό ή βράστε το.',
            '3. Σερβίρετε με ελαιόλαδο ωμό στο τέλος.'
        ]
    },
    {
        id: 'r_beef_potatoes',
        name: 'Μπιφτέκια Μοσχαρίσια με Πατάτες',
        category: 'main',
        description: 'Παραδοσιακή συνταγή φούρνου.',
        servings: 1,
        time: 'moderate',
        difficulty: 'moderate',
        cost: 'moderate',
        tags: ['main', 'high-protein', 'kidney-friendly'],
        macros: { calories: 500, protein: 30, carbs: 40, fat: 22 },
        ingredients: [
            { foodId: 'f_beef_mince', name: 'Κιμάς Μοσχαρίσιος', amount: 120, unit: 'g' },
            { foodId: 'f_potato', name: 'Πατάτες', amount: 200, unit: 'g' },
            { foodId: 'f_olive_oil', name: 'Ελαιόλαδο', amount: 10, unit: 'ml' }
        ],
        instructions: [
            '1. Ζυμώστε τον κιμά με μπαχαρικά.',
            '2. Κόψτε τις πατάτες κυδωνάτες.',
            '3. Ψήστε στο φούρνο στους 200°C για 45-60 λεπτά.'
        ]
    },
    {
        id: 'r_green_beans',
        name: 'Φασολάκια Λαδερά',
        category: 'main',
        description: 'Κλασικό λαδερό, πλούσιο σε φυτικές ίνες.',
        servings: 1,
        time: 'slow',
        difficulty: 'moderate',
        cost: 'cheap',
        tags: ['main', 'vegetarian', 'diabetes-friendly', 'cholesterol-friendly', 'gluten-free', 'constipation-friendly', 'nafld-friendly', 'vegan', 'fasting'],
        macros: { calories: 400, protein: 8, carbs: 35, fat: 25 },
        ingredients: [
            { foodId: 'f_beans_green', name: 'Φασολάκια', amount: 350, unit: 'g' },
            { foodId: 'f_olive_oil', name: 'Ελαιόλαδο', amount: 20, unit: 'ml' },
            { foodId: 'f_tomato', name: 'Ντομάτα', amount: 100, unit: 'g' }
        ],
        instructions: [
            '1. Σοτάρετε ελαφρά τα λαχανικά.',
            '2. Προσθέστε την ντομάτα και νερό.',
            '3. Σιγοβράστε για 40-50 λεπτά.'
        ]
    },
    {
        id: 'r_fish_salad',
        name: 'Τσιπούρα Ψητή με Σαλάτα',
        category: 'main',
        description: 'Πλούσιο σε ωμέγα-3 λιπαρά.',
        servings: 1,
        time: 'moderate',
        difficulty: 'easy',
        cost: 'expensive',
        tags: ['main', 'high-protein', 'low-carb', 'gluten-free', 'diabetes-friendly', 'cholesterol-friendly', 'nafld-friendly'],
        macros: { calories: 350, protein: 35, carbs: 5, fat: 20 },
        ingredients: [
            { foodId: 'f_fish_tsipoura', name: 'Τσιπούρα', amount: 300, unit: 'g' }, // Whole raw
            { foodId: 'f_lettuce', name: 'Μαρούλι', amount: 150, unit: 'g' },
            { foodId: 'f_olive_oil', name: 'Ελαιόλαδο', amount: 10, unit: 'ml' }
        ],
        instructions: [
            '1. Αλατίστε το ψάρι και ψήστε στη σχάρα ή στο φούρνο.',
            '2. Ετοιμάστε τη σαλάτα.',
            '3. Σερβίρετε με λαδολέμονο.'
        ]
    },
    {
        id: 'r_quinoa_salad',
        name: 'Σαλάτα Κινόα με Λαχανικά',
        category: 'main',
        description: 'Δροσερή και θρεπτική σαλάτα.',
        servings: 1,
        time: 'fast',
        difficulty: 'easy',
        cost: 'expensive',
        tags: ['main', 'vegan', 'gluten-free', 'high-protein', 'cholesterol-friendly'],
        macros: { calories: 400, protein: 12, carbs: 50, fat: 15 },
        ingredients: [
            { foodId: 'f_quinoa', name: 'Κινόα', amount: 60, unit: 'g' },
            { foodId: 'f_tomato', name: 'Ντομάτα', amount: 100, unit: 'g' },
            { foodId: 'f_olive_oil', name: 'Ελαιόλαδο', amount: 10, unit: 'ml' }
        ],
    },
    // --- LEGUMES / TRADITIONAL ---
    {
        id: 'r_lentil_soup',
        name: 'Φακές Σούπα',
        category: 'main',
        description: 'Παραδοσιακές φακές, πηγή σιδήρου.',
        servings: 1,
        time: 'slow',
        difficulty: 'easy',
        cost: 'cheap',
        tags: ['main', 'vegan', 'high-fiber', 'constipation-friendly', 'fasting', 'iron'],
        macros: { calories: 380, protein: 18, carbs: 45, fat: 12 },
        ingredients: [
            { foodId: 'f_lentils', name: 'Φακές', amount: 70, unit: 'g' },
            { foodId: 'f_tomato', name: 'Ντομάτα', amount: 80, unit: 'g' },
            { foodId: 'f_olive_oil', name: 'Ελαιόλαδο', amount: 10, unit: 'ml' }
        ],
        instructions: ['1. Βράστε τις φακές.', '2. Προσθέστε ντομάτα και μυρωδικά.', '3. Στο τέλος προσθέστε το λάδι.']
    },
    {
        id: 'r_spinach_rice',
        name: 'Σπανακόρυζο',
        category: 'main',
        description: 'Κλασικό και θρεπτικό λαδερό.',
        servings: 1,
        time: 'moderate',
        difficulty: 'moderate',
        cost: 'cheap',
        tags: ['main', 'vegan', 'gluten-free', 'fasting', 'iron', 'constipation-friendly'],
        macros: { calories: 420, protein: 10, carbs: 55, fat: 18 },
        ingredients: [
            { foodId: 'f_spinach', name: 'Σπανάκι', amount: 150, unit: 'g' },
            { foodId: 'f_rice_brown', name: 'Ρύζι Καστανό', amount: 60, unit: 'g' },
            { foodId: 'f_olive_oil', name: 'Ελαιόλαδο', amount: 15, unit: 'ml' }
        ],
        instructions: ['1. Σοτάρετε το σπανάκι.', '2. Προσθέστε ρύζι και νερό.', '3. Σιγοβράστε μέχρι να πιει τα υγρά του.']
    },

    // --- SALADS / LIGHT ---
    {
        id: 'r_greek_salad',
        name: 'Χωριάτικη Σαλάτα (Ατομική)',
        category: 'main',
        description: 'Η κλασική ελληνική σαλάτα.',
        servings: 1,
        time: 'very_fast',
        difficulty: 'very_easy',
        cost: 'moderate',
        tags: ['main', 'vegetarian', 'gluten-free', 'raw'],
        macros: { calories: 450, protein: 16, carbs: 15, fat: 35 },
        ingredients: [
            { foodId: 'f_tomato', name: 'Ντομάτα', amount: 150, unit: 'g' },
            { foodId: 'f_cucumber', name: 'Αγγούρι', amount: 100, unit: 'g' },
            { foodId: 'f_feta', name: 'Φέτα', amount: 60, unit: 'g' },
            { foodId: 'f_olive_oil', name: 'Ελαιόλαδο', amount: 15, unit: 'ml' }
        ],
        instructions: ['1. Κόψτε λαχανικά.', '2. Προσθέστε τη φέτα.', '3. Περιχύστε με ελαιόλαδο.']
    },
    {
        id: 'r_salmon_broccoli',
        name: 'Σολομός με Μπρόκολο',
        category: 'main',
        description: 'Πλούσιο σε Ω3 και αντιοξειδωτικά.',
        servings: 1,
        time: 'fast',
        difficulty: 'easy',
        cost: 'expensive',
        tags: ['main', 'high-protein', 'keto-friendly', 'gluten-free', 'nafld-friendly', 'omega-3'],
        macros: { calories: 480, protein: 35, carbs: 8, fat: 32 },
        ingredients: [
            { foodId: 'f_salmon', name: 'Σολομός', amount: 180, unit: 'g' },
            { foodId: 'f_broccoli', name: 'Μπρόκολο', amount: 200, unit: 'g' },
            { foodId: 'f_olive_oil', name: 'Ελαιόλαδο', amount: 5, unit: 'ml' }
        ],
        instructions: ['1. Ψήστε το σολομό.', '2. Βράστε το μπρόκολο.', '3. Σερβίρετε με λεμόνι.']
    },

    // --- SNACKS / BREAKFAST EXTRA ---
    {
        id: 'r_banana_yogurt',
        name: 'Γιαούρτι με Μπανάνα & Μέλι',
        category: 'snack',
        description: 'Γλυκό και υγιεινό σνακ.',
        servings: 1,
        time: 'very_fast',
        difficulty: 'very_easy',
        cost: 'cheap',
        tags: ['snack', 'vegetarian', 'easy-digest', 'energy'],
        macros: { calories: 250, protein: 11, carbs: 40, fat: 4 },
        ingredients: [
            { foodId: 'f_yogurt', name: 'Γιαούρτι', amount: 150, unit: 'g' },
            { foodId: 'f_banana', name: 'Μπανάνα', amount: 100, unit: 'g' }, // ~1 small
            { foodId: 'f_honey', name: 'Μέλι', amount: 5, unit: 'g' }
        ],
        instructions: ['1. Κόψτε τη μπανάνα.', '2. Ανακατέψτε με γιαούρτι και μέλι.']
    }
];
