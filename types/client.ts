export type Gender = 'male' | 'female' | 'other' | '';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete' | '';
export type Goal = 'weight_loss' | 'maintenance' | 'muscle_gain' | 'energy' | 'digestion' | 'sugar_regulation' | 'cholesterol' | 'sleep' | 'other';
export type FoodPreference = 'love' | 'like' | 'neutral' | 'dislike';

export interface Installment {
    number: number;
    amount: string;
    date: string;
    reminderDate: string;
    isPaid: boolean;
}

export interface PackageItem {
    id: string;
    type: string; // Relaxed to allow Greek strings like '1 μήνας' used in UI
    startDate: string;
    endDate: string;
    sessions: number;
    price: string;
    status: 'active' | 'completed' | 'future';
}

export interface ClientFormData {
    id?: string; // Optional for creation, required for updates
    // Step 1: Personal Info
    firstName: string;
    lastName: string;
    fathersName: string; // Added
    birthDate: string;
    gender: Gender;
    phone: string;
    email: string;
    occupation: string;
    address: { // Added
        street: string;
        number: string;
        area: string;
        city: string;
        postalCode: string;
    };

    // Step 2: Health
    conditions: string[];
    medications: string[];
    medicalNotes: string;

    // Step 3: Habits
    wakeUpTime: string;
    bedTime: string;
    workSchedule: string;
    workHoursFrom: string; // Added
    workHoursTo: string; // Added
    shiftRotation: '2_shifts' | '3_shifts' | ''; // Added
    shiftWork: boolean;
    mealsPerDay: string; // "2"-"7"
    skipBreakfast: boolean;
    lateNightEating: boolean;
    eatingOut: boolean;
    delivery: boolean;
    coffee: boolean;
    coffeeCups: string;
    coffeeSugar: 'sketos' | 'metrios' | 'glykos' | ''; // Added
    coffeeMilk: boolean; // Added
    alcohol: boolean;
    alcoholFrequency: string; // Added (string to handle empty state easily in forms)
    smoking: boolean;

    // Step 4: Diet Preferences
    // We'll store preferences as a map or simpler structure for the prototype
    foodPreferences: Record<string, FoodPreference>;
    dislikedFoods: string; // Text field
    likedFoods: string; // Text field
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
    paymentPlan: Installment[]; // Added
    packages: PackageItem[]; // Added for history
}

export const initialClientState: ClientFormData = {
    firstName: '',
    lastName: '',
    fathersName: '',
    birthDate: '',
    gender: '',
    phone: '',
    email: '',
    occupation: '',
    address: {
        street: '',
        number: '',
        area: '',
        city: '',
        postalCode: ''
    },
    conditions: [],
    medications: [],
    medicalNotes: '',
    wakeUpTime: '',
    bedTime: '',
    workSchedule: '',
    workHoursFrom: '',
    workHoursTo: '',
    shiftRotation: '',
    shiftWork: false,
    mealsPerDay: '3',
    skipBreakfast: false,
    lateNightEating: false,
    eatingOut: false,
    delivery: false,
    coffee: false,
    coffeeCups: '',
    coffeeSugar: '',
    coffeeMilk: false,
    alcohol: false,
    alcoholFrequency: '',
    smoking: false,
    foodPreferences: {},
    dislikedFoods: '',
    likedFoods: '',
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
    },
    paymentPlan: [],
    packages: []
};
