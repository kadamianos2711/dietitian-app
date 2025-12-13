import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { FOOD_DB } from '@/data/foodDB';
import { RECIPE_DB } from '@/data/recipeDB';
import { FoodItem, Recipe } from '@/types/engine';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

interface DBData {
    foods?: FoodItem[];
    recipes?: Recipe[];
}

export async function GET() {
    try {
        // Read db.json
        let data: DBData = {};
        try {
            const fileContent = await fs.readFile(DB_PATH, 'utf-8');
            data = JSON.parse(fileContent);
        } catch (error) {
            console.warn('Database file not found or invalid, using defaults');
        }

        // Merge or Fallback
        // Preference: db.json > static defaults
        // If db.json has empty array, it means user deleted everything? Or just initialized empty?
        // Let's assume if key is present, use it. If undefined, use default.
        
        const foods = data.foods || FOOD_DB;
        const recipes = data.recipes || RECIPE_DB;

        return NextResponse.json({
            foods,
            recipes
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load database' }, { status: 500 });
    }
}
