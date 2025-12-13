import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { fetchGoogleSheetCsv, parseFoodsCsv, parseRecipesCsv } from '@/lib/services/googleSheets';
import { FoodItem, Recipe } from '@/types/engine';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { foodSheetUrl, recipeSheetUrl } = body;

        if (!foodSheetUrl && !recipeSheetUrl) {
            return NextResponse.json({ error: 'Please provide at least one sheet URL' }, { status: 400 });
        }

        // 1. Read existing DB
        let data: { foods?: FoodItem[], recipes?: Recipe[] } = {};
        try {
            const fileContent = await fs.readFile(DB_PATH, 'utf-8');
            data = JSON.parse(fileContent);
        } catch (error) {
            // File might not exist or be empty
        }

        const existingFoods = data.foods || [];
        const existingRecipes = data.recipes || [];

        let addedFoods = 0;
        let updatedFoods = 0;
        let addedRecipes = 0;
        let updatedRecipes = 0;

        // 2. Import Foods
        if (foodSheetUrl) {
            const csv = await fetchGoogleSheetCsv(foodSheetUrl);
            const newFoods = parseFoodsCsv(csv);

            newFoods.forEach(newFood => {
                const index = existingFoods.findIndex(f => 
                    f.name.toLowerCase() === newFood.name.toLowerCase() || f.id === newFood.id
                );

                if (index >= 0) {
                    existingFoods[index] = { ...newFood, id: existingFoods[index].id };
                    updatedFoods++;
                } else {
                    // Add
                    existingFoods.push(newFood);
                    addedFoods++;
                }
            });
            data.foods = existingFoods; // Update reference
        }

        // 3. Import Recipes
        if (recipeSheetUrl) {
            const csv = await fetchGoogleSheetCsv(recipeSheetUrl);
            const newRecipes = parseRecipesCsv(csv);

            newRecipes.forEach(newRecipe => {
                const index = existingRecipes.findIndex(r => 
                    r.name.toLowerCase() === newRecipe.name.toLowerCase() || r.id === newRecipe.id
                );

                if (index >= 0) {
                    // Update - Strict overwrite
                    existingRecipes[index] = { ...newRecipe, id: existingRecipes[index].id };
                    updatedRecipes++;
                } else {
                    // Add
                    existingRecipes.push(newRecipe);
                    addedRecipes++;
                }
            });
            data.recipes = existingRecipes;
        }

        // 4. Save DB
        // We must preserve other keys in db.json (clients, mealPlans)
        let fullDb = {};
        try {
             const fileContent = await fs.readFile(DB_PATH, 'utf-8');
             fullDb = JSON.parse(fileContent);
        } catch(e) {}
        
        const mergedDb = {
            ...fullDb,
            foods: existingFoods,
            recipes: existingRecipes,
            settings: {
                ...(fullDb as any).settings,
                ...(foodSheetUrl ? { foodSheetUrl } : {}),
                ...(recipeSheetUrl ? { recipeSheetUrl } : {})
            }
        };

        await fs.writeFile(DB_PATH, JSON.stringify(mergedDb, null, 2));

        return NextResponse.json({
            success: true,
            stats: {
                addedFoods,
                updatedFoods,
                addedRecipes,
                updatedRecipes
            }
        });

    } catch (error: any) {
        console.error('Import failed', error);
        return NextResponse.json({ error: error.message || 'Import failed' }, { status: 500 });
    }
}
