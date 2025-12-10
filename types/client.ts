export type Gender = 'male' | 'female' | 'other' | '';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete' | '';
export type Goal = 'weight_loss' | 'maintenance' | 'muscle_gain' | 'energy' | 'digestion' | 'sugar_regulation' | 'cholesterol' | 'sleep' | 'other';
export type FoodPreference = 'like' | 'neutral' | 'dislike';

export interface ClientFormData {
    // Step 1: Personal Info
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: Gender;
    phone: string;
    email: string;
    occupation: string;

    // Step 2: Health
    conditions: string[];
    medications: string[];
    medicalNotes: string;

    // Step 3: Habits
    wakeUpTime: string;
    bedTime: string;
    workSchedule: string;
    shiftWork: boolean;
    mealsPerDay: string; // "2"-"7"
    skipBreakfast: boolean;
    lateNightEating: boolean;
    eatingOut: boolean;
    delivery: boolean;
    coffee: boolean;
    coffeeCups: string;
    alcohol: boolean;
    smoking: boolean;

    // Step 4: Diet Preferences
    // We'll store preferences as a map or simpler structure for the prototype
    foodPreferences: Record<string, FoodPreference>;
    dislikedFoods: string; // Text field
    lovedFoods: string; // Text field

    // Step 5: Exercise & Sleep
    exercises: boolean;
    exerciseType: string;
    exerciseFrequency: string; // times per week
    sleepHours: string;

    // Step 6: Goals
    goals: Goal[];
    goalNotes: string;

    // Step 7: Review (No data, just view)

    // Step 8: Financial (Dietitian only)
    collaborationType: string;
    packagePrice: string;
    hasVat: boolean;
    finalPrice: string;
    installments: string;
    startDate: string;
    endDate: string;
    initialPayment: {
        amount: string;
        date: string;
        method: string;
    };
}

export const initialClientState: ClientFormData = {
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    phone: '',
    email: '',
    occupation: '',
    conditions: [],
    medications: [],
    medicalNotes: '',
    wakeUpTime: '',
    bedTime: '',
    workSchedule: '',
    shiftWork: false,
    mealsPerDay: '3',
    skipBreakfast: false,
    lateNightEating: false,
    eatingOut: false,
    delivery: false,
    coffee: false,
    coffeeCups: '',
    alcohol: false,
    smoking: false,
    foodPreferences: {},
    dislikedFoods: '',
    lovedFoods: '',
    exercises: false,
    exerciseType: '',
    exerciseFrequency: '',
    sleepHours: '',
    goals: [],
    goalNotes: '',
    collaborationType: '',
    packagePrice: '',
    hasVat: false,
    finalPrice: '',
    installments: '1',
    startDate: '',
    endDate: '',
    initialPayment: {
        amount: '',
        date: '',
        method: ''
    }
};
