import { FoodItem, Recipe, RecipeCategory, RecipeTime, RecipeCost, RecipeDifficulty } from '@/types/engine';
import { v4 as uuidv4 } from 'uuid';

export async function fetchGoogleSheetCsv(url: string): Promise<string> {
    // If user provides a normal sheet URL, try to convert to CSV export URL
    // e.g. https://docs.google.com/spreadsheets/d/ID/edit#gid=0 -> https://docs.google.com/spreadsheets/d/ID/export?format=csv
    let csvUrl = url;
    if (url.includes('/edit')) {
        csvUrl = url.replace('/edit', '/export?format=csv');
    }

    const response = await fetch(csvUrl, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    return response.text();
}


const parseNumber = (val: string | undefined): number => {
    if (!val) return 0;
    // Replace comma with dot for Greek/European format
    const normalized = val.replace(',', '.');
    // Remove non-numeric chars except dot and minus? No, keep it simple for now. 
    // Maybe handle "1.200,50" -> "1200.50"? No, simple CSV likely "1,5".
    const num = Number(normalized);
    return isNaN(num) ? 0 : num;
};

const parseOptionalNumber = (val: string | undefined): number | undefined => {
    if (!val || val.trim() === '') return undefined;
    const normalized = val.replace(',', '.');
    const num = Number(normalized);
    return isNaN(num) ? undefined : num;
};

// Simple CSV Parser avoiding external libs for now if simple
function parseCsv(csv: string): Record<string, string>[] {
    const lines = csv.split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
    
    return lines.slice(1).map(line => {
        // Handle quotes properly? For MVP maybe split by comma and hope no commas in content?
        // Let's do a slightly better regex split
        const values: string[] = [];
        let current = '';
        let inQuote = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        const entry: Record<string, string> = {};
        headers.forEach((h, i) => {
            entry[h] = values[i]?.replace(/^"|"$/g, '') || '';
        });
        return entry;
    });
}

export function parseFoodsCsv(csv: string): FoodItem[] {
    const rows = parseCsv(csv);
    return rows.map(row => ({
        id: row.id || uuidv4(),
        name: row.name || 'Unknown Food',
        category: (row.category || 'misc') as any,
        macros: {
            calories: parseNumber(row.calories),
            protein: parseNumber(row.protein),
            carbs: parseNumber(row.carbs),
            fat: parseNumber(row.fat)
        },
        conversionFactor: parseNumber(row.conversionfactor) || 1.0,
        form: (row.form || 'raw') as 'raw' | 'cooked',
        greekName: row.greekname || row.name, // Fallback
        tags: row.tags ? (row.tags.split('|') as any[]) : [],
        cost: (row.cost || 'moderate') as any,
        micros: {
            // Minerals
            sodium: parseOptionalNumber(row.sodium),
            potassium: parseOptionalNumber(row.potassium),
            calcium: parseOptionalNumber(row.calcium),
            magnesium: parseOptionalNumber(row.magnesium),
            phosphorus: parseOptionalNumber(row.phosphorus),
            iron: parseOptionalNumber(row.iron),
            zinc: parseOptionalNumber(row.zinc),
            selenium: parseOptionalNumber(row.selenium),
            iodine: parseOptionalNumber(row.iodine),
            // Vitamins
            vitaminA: parseOptionalNumber(row.vitamina),
            vitaminD: parseOptionalNumber(row.vitamind),
            vitaminE: parseOptionalNumber(row.vitamine),
            vitaminK: parseOptionalNumber(row.vitamink),
            vitaminC: parseOptionalNumber(row.vitaminc),
            vitaminB1: parseOptionalNumber(row.vitaminb1),
            vitaminB2: parseOptionalNumber(row.vitaminb2),
            vitaminB3: parseOptionalNumber(row.vitaminb3),
            vitaminB5: parseOptionalNumber(row.vitaminb5),
            vitaminB6: parseOptionalNumber(row.vitaminb6),
            vitaminB9: parseOptionalNumber(row.vitaminb9),
            vitaminB12: parseOptionalNumber(row.vitaminb12),
            omega3: parseOptionalNumber(row.omega3),
            lycopene: parseOptionalNumber(row.lycopene)
        }
    }));
}

export function parseRecipesCsv(csv: string): Recipe[] {
    const rows = parseCsv(csv);
    return rows.map(row => ({
        id: row.id || uuidv4(),
        name: row.name || 'New Recipe',
        description: row.description || '',
        category: (row.category || 'main') as RecipeCategory,
        time: (row.time || 'moderate') as RecipeTime,
        difficulty: (row.difficulty || 'easy') as RecipeDifficulty,
        cost: (row.cost || 'moderate') as RecipeCost,
        ingredients: row.ingredients ? row.ingredients.split('|').map(ing => {
            const [name, amountStr, unit] = ing.split(':');
            return {
                foodId: 'pending_lookup', // Will need to be resolved or ignored by UI
                name: name?.trim() || 'Unknown',
                amount: parseNumber(amountStr),
                unit: unit?.trim() || 'g'
            };
        }) : [],
        instructions: row.instructions ? row.instructions.split('|') : [],
        macros: {
            calories: parseNumber(row.calories),
            protein: parseNumber(row.protein),
            carbs: parseNumber(row.carbs),
            fat: parseNumber(row.fat)
        },
        tags: row.tags ? (row.tags.split('|') as any[]) : [],
        servings: parseNumber(row.servings) || 1
    }));
}
