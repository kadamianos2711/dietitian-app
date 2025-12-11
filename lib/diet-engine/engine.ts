import { ClientFormData } from '@/types/client';
import { PlanSettings, WeeklyPlan, DailyPlan, DietMeal, MealType, Recipe } from '@/types/engine';
import { RECIPE_DB } from '@/data/recipeDB';
import { FOOD_DB } from '@/data/foodDB';
import { v4 as uuidv4 } from 'uuid';

const MEAL_RATIOS: Record<number, Record<string, number>> = {
    4: { breakfast: 0.25, lunch: 0.40, dinner: 0.25, snack1: 0.10 },
    5: { breakfast: 0.25, snack1: 0.10, lunch: 0.35, dinner: 0.20, snack2: 0.10 },
    6: { breakfast: 0.20, snack1: 0.10, lunch: 0.30, afternoon1: 0.10, dinner: 0.20, bedtime: 0.10 },
    7: { breakfast: 0.20, snack1: 0.10, snack2: 0.05, lunch: 0.25, afternoon1: 0.10, afternoon2: 0.05, dinner: 0.20, bedtime: 0.05 }
};

const COLUMN_TO_TYPE: Record<string, MealType> = {
    breakfast: 'breakfast',
    snack1: 'snack',
    snack2: 'snack',
    lunch: 'lunch',
    afternoon1: 'snack',
    afternoon2: 'snack',
    dinner: 'dinner',
    bedtime: 'snack'
};

function getCookedFactor(foodId: string): number {
    const food = FOOD_DB.find(f => f.id === foodId);
    return food ? food.conversionFactor : 1.0;
}

export function generateWeeklyPlan(client: ClientFormData, settings: PlanSettings): WeeklyPlan {
    const days: DailyPlan[] = [];
    let weeklyCalories = 0;
    const activeSlots = getActiveSlots(settings.mealsCount);

    for (let i = 0; i < 7; i++) {
        const dayPlan = generateDailyPlan(i + 1, client, settings, activeSlots);
        days.push(dayPlan);
        weeklyCalories += dayPlan.totalCalories;
    }

    return {
        days,
        averageCalories: Math.round(weeklyCalories / 7)
    };
}

function getActiveSlots(count: number): string[] {
    if (count === 4) return ['breakfast', 'lunch', 'dinner', 'snack1'];
    if (count === 5) return ['breakfast', 'snack1', 'lunch', 'dinner', 'snack2'];
    if (count === 6) return ['breakfast', 'snack1', 'lunch', 'afternoon1', 'dinner', 'bedtime'];
    return ['breakfast', 'snack1', 'lunch', 'afternoon1', 'dinner'];
}

function getTargetCaloriesForSlot(totalCalories: number, slotId: string, count: number): number {
    const ratios = MEAL_RATIOS[count] || MEAL_RATIOS[5];
    let ratio = ratios[slotId];
    if (!ratio) {
        if (slotId.includes('snack') || slotId.includes('afternoon') || slotId.includes('bedtime')) {
            ratio = 0.10;
        } else {
            ratio = 0.25;
        }
    }
    return Math.round(totalCalories * ratio);
}

function generateDailyPlan(dayNum: number, client: ClientFormData, settings: PlanSettings, slots: string[]): DailyPlan {
    const meals: Record<string, DietMeal> = {};
    let dailyCalories = 0;
    let protein = 0, carbs = 0, fat = 0;

    slots.forEach(slotId => {
        const mealType = COLUMN_TO_TYPE[slotId] || 'snack';
        const targetCals = getTargetCaloriesForSlot(settings.calories, slotId, settings.mealsCount);

        const recipe = selectRecipe(client, mealType, slotId, dayNum);

        if (recipe) {
            const factor = targetCals / recipe.macros.calories;
            const finalCals = Math.round(recipe.macros.calories * factor);

            // Format Description with COOKED weights if applicable
            const description = formatIngredientsForDiet(recipe, factor);

            meals[slotId] = {
                id: uuidv4(),
                recipeId: recipe.id,
                recipeName: recipe.name,
                description: description,
                calories: finalCals,
                type: mealType,
                ingredients: recipe.ingredients.map(ing => ing.name)
            };

            dailyCalories += finalCals;
            protein += recipe.macros.protein * factor;
            carbs += recipe.macros.carbs * factor;
            fat += recipe.macros.fat * factor;
        }
    });

    const date = new Date(settings.startDate);
    date.setDate(date.getDate() + (dayNum - 1));

    return {
        date: date.toISOString().split('T')[0],
        dayNumber: dayNum,
        meals,
        totalCalories: dailyCalories,
        macros: {
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fat: Math.round(fat)
        }
    };
}

function selectRecipe(client: ClientFormData, type: MealType, slotId: string, dayNum: number): Recipe | null {
    // 1. Filter by Category / Type
    // NOTE: 'dinner' usually takes 'main' recipes in this simple logic, unless we strictly filter for dinner recipes
    let candidates = RECIPE_DB.filter(r => {
        if (type === 'lunch' || type === 'dinner') return r.category === 'main' || r.tags.includes('main');
        return r.category === type || r.tags.includes(type);
    });

    // 2. Filter by Allergies / Dislikes
    const dislikeList = client.dislikedFoods ? client.dislikedFoods.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [];
    candidates = candidates.filter(r => {
        return !r.ingredients.some(ing => dislikeList.some(dislike => ing.name.toLowerCase().includes(dislike)));
    });

    // 3. Filter/Prioritize by Pathology (Expanded)
    const conditions = client.conditions || [];
    const hasDiabetes = conditions.some(c => c.includes('Διαβήτης'));
    const hasCholesterol = conditions.some(c => c.includes('Χοληστερίνη'));
    const hasIBS = conditions.some(c => c.includes('IBS') || c.includes('Κολίτιδα'));
    const hasGluten = conditions.some(c => c.includes('Κοιλιοκάκη') || c.includes('Γλουτένη'));
    const hasNAFLD = conditions.some(c => c.includes('Λιπώδες Ήπαρ'));
    const hasUric = conditions.some(c => c.includes('Ουρικό'));

    if (hasGluten) candidates = candidates.filter(r => r.tags.includes('gluten-free'));

    let suitable = candidates;

    // Scoring logic
    if (hasDiabetes || hasCholesterol || hasIBS || hasNAFLD || hasUric) {
        const scored = candidates.map(r => {
            let score = 0;
            if (hasDiabetes && r.tags.includes('diabetes-friendly')) score++;
            if (hasCholesterol && r.tags.includes('cholesterol-friendly')) score++;
            if (hasIBS && (r.tags.includes('ibs-friendly') || r.tags.includes('low-fodmap'))) score++;
            if (hasNAFLD && r.tags.includes('nafld-friendly')) score++;
            if (hasUric && r.tags.includes('uric-acid-friendly')) score++;
            return { r, score };
        });

        scored.sort((a, b) => b.score - a.score);
        if (scored.length > 0 && scored[0].score > 0) {
            suitable = scored.filter(item => item.score >= scored[0].score - 1).map(item => item.r);
        }
    }

    // 4. Variety Logic
    if (suitable.length === 0) return candidates.length > 0 ? candidates[0] : null;

    const index = (dayNum + slotId.length) % suitable.length;
    return suitable[index];
}

function formatIngredientsForDiet(recipe: Recipe, factor: number): string {
    // For the diet plan (what client sees), we might want to approximate Cooked weight for main items
    // and just Raw for others, or just list main items.

    return recipe.ingredients.map(ing => {
        const rawAmount = ing.amount * factor;
        // Use foodId to get accurate factor
        const convFactor = getCookedFactor(ing.foodId);
        const amount = Math.round(rawAmount * convFactor);

        // Suffix if it changes
        const suffix = (convFactor !== 1.0) ? ' (μαγ.)' : '';
        return `${amount}${ing.unit || 'g'} ${ing.name}${suffix}`;
    }).join(', ');
}
