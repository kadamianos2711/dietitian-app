'use client';

import { useState, useEffect } from 'react';
// import { RECIPE_DB } from '@/data/recipeDB';
import { FoodItem } from '@/types/engine';
import { Search, Clock, BarChart, Euro, Plus, Pencil, Trash2 } from 'lucide-react';
import RecipeModal from '@/components/meal-plan/RecipeModal';
import RecipeFormModal from '@/components/database/RecipeFormModal';
import { AppLayout } from '@/components/layout/AppLayout';
import { Recipe } from '@/types/engine';

export default function RecipesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecipeName, setSelectedRecipeName] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [localRecipes, setLocalRecipes] = useState<Recipe[]>([]);
    const [dbRecipes, setDbRecipes] = useState<Recipe[]>([]);
    const [dbFoods, setDbFoods] = useState<FoodItem[]>([]);
    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>(undefined);

    useEffect(() => {
        try {
            const savedCustom = localStorage.getItem('custom_recipes');
            const savedDeleted = localStorage.getItem('deleted_recipe_ids');

            if (savedCustom) setLocalRecipes(JSON.parse(savedCustom));
            if (savedDeleted) setDeletedIds(JSON.parse(savedDeleted));
        } catch (e) {
            console.error('Failed to parse storage', e);
        }

        // Fetch DB
        fetch('/api/database')
            .then(res => res.json())
            .then(data => {
                if (data.recipes) setDbRecipes(data.recipes);
                if (data.foods) setDbFoods(data.foods);
            })
            .catch(err => console.error("Failed to fetch recipes", err));
    }, []);

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Stop row click
        if (!window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή τη συνταγή;')) return;

        // 1. Remove from localRecipes if present
        const isLocal = localRecipes.some(r => r.id === id);
        if (isLocal) {
            const updated = localRecipes.filter(r => r.id !== id);
            setLocalRecipes(updated);
            localStorage.setItem('custom_recipes', JSON.stringify(updated));
        }

        // 2. If it exists in DB (or we just deleted a shadow), add to deletedIds
        if (dbRecipes.some(r => r.id === id)) {
            const updatedDeleted = [...deletedIds, id];
            setDeletedIds(updatedDeleted);
            localStorage.setItem('deleted_recipe_ids', JSON.stringify(updatedDeleted));
        }
    };

    const handleSaveRecipe = (newRecipe: Recipe) => {
        const existingIdx = localRecipes.findIndex(r => r.id === newRecipe.id);
        let updated;

        if (existingIdx >= 0) {
            updated = [...localRecipes];
            updated[existingIdx] = newRecipe;
        } else {
            updated = [...localRecipes, newRecipe];
        }

        setLocalRecipes(updated);
        localStorage.setItem('custom_recipes', JSON.stringify(updated));
        setEditingRecipe(undefined);
    };

    const handleEditClick = (recipe: Recipe, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening valid modal
        setEditingRecipe(recipe);
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingRecipe(undefined);
    };

    // Shadowing logic for Recipes
    const allRecipes = [
        ...localRecipes,
        ...dbRecipes.filter(dbRecipe => !localRecipes.find(local => local.id === dbRecipe.id))
    ].filter(r => !deletedIds.includes(r.id)); // Filter deleted

    const filteredRecipes = allRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Helpers
    const getDifficultyLabel = (d: string) => {
        const map: any = { very_easy: 'Πολύ εύκολη', easy: 'Εύκολη', moderate: 'Μέτρια', hard: 'Δύσκολη' };
        return map[d] || d;
    };

    const getTimeLabel = (t: string) => {
        const map: any = { very_fast: "<10'", fast: "15'", moderate: "30'", slow: "45'+" };
        return map[t] || t;
    };

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Βάση Συνταγών</h1>
                        <p className="text-gray-500 mt-1">Κατάλογος διαθέσιμων συνταγών και γευμάτων</p>
                    </div>
                    <div className="flex space-x-4">
                        {/* Search Bar */}
                        <div className="relative w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Αναζήτηση συνταγής..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={() => {
                                setEditingRecipe(undefined);
                                setIsAddModalOpen(true);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Νέα Συνταγή
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Συνταγή
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Κατηγορία
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Χρόνος / Δυσκολία
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Κόστος
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Θερμίδες & Μάκρο (1 μερίδα)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ενέργειες
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRecipes.map((recipe) => (
                                    <tr
                                        key={recipe.id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                        onClick={() => setSelectedRecipeName(recipe.name)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg mr-3">
                                                    🍽️
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{recipe.name}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-xs">{recipe.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                                {recipe.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex items-center text-xs text-gray-600">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {getTimeLabel(recipe.time)}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-600">
                                                    <BarChart className="w-3 h-3 mr-1" />
                                                    {getDifficultyLabel(recipe.difficulty)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                                ${recipe.cost === 'cheap' ? 'bg-green-100 text-green-800' : ''}
                                                ${recipe.cost === 'moderate' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${recipe.cost === 'expensive' ? 'bg-red-100 text-red-800' : ''}
                                            `}>
                                                {recipe.cost === 'cheap' && '€'}
                                                {recipe.cost === 'moderate' && '€€'}
                                                {recipe.cost === 'expensive' && '€€€'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="font-medium text-gray-900 mb-1">{recipe.macros.calories} kcal</div>
                                            <div className="flex space-x-2 text-xs">
                                                <span className="text-blue-600" title="Πρωτεΐνη">{recipe.macros.protein}p</span>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-green-600" title="Υδατάνθρακες">{recipe.macros.carbs}c</span>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-yellow-600" title="Λιπαρά">{recipe.macros.fat}f</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={(e) => handleEditClick(recipe, e)}
                                                    className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full hover:bg-green-100 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Επεξεργασία"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(recipe.id, e)}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Διαγραφή"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredRecipes.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                Δεν βρέθηκαν αποτελέσματα για "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>

                {/* Recipe Modal */}
                <RecipeModal
                    isOpen={!!selectedRecipeName}
                    onClose={() => setSelectedRecipeName(null)}
                    meal={{
                        recipeName: selectedRecipeName || '',
                        recipeId: '', // Will search by name inside modal if ID missing, or we should pass ID. 
                        // Actually RecipeModal expects a 'meal' object. 
                        // The existing code was constructing a fake meal?
                        // "recipeName={selectedRecipeName}" was passed before but RecipeModal expects `meal` prop?
                        // Wait, previous code was: 
                        // <RecipeModal ... recipeName={selectedRecipeName || ''} />
                        // BUT RecipeModal props define `meal: DietMeal | null`.
                        // AND `recipeName` wasn't in props in the file I viewed earlier.
                        // Wait, I saw `interface Props { meal: DietMeal | null ... }`.
                        // The original usage in RecipesPage seemed to pass `recipeName` which implies I might have misread the file or RecipesPage was broken/using different version?
                        // Let's look at RecipesPage line 251 in previous `view_file`.
                        // It was: `recipeName={selectedRecipeName || ''}`
                        // BUT `RecipeModal.tsx` props were `meal: DietMeal | null`.
                        // This implies `RecipesPage` was ALREADY passing wrong props or I missed optional props?
                        // I checked `RecipeModal.tsx` content. It ONLY had `meal` in props.
                        // So `RecipesPage` was likely broken or I am confused.
                        // I will reconstruct a fake meal object to satisfy the prop.
                        // The modal logic searches by ID OR Name.
                        id: '', 
                        calories: 0, 
                        type: 'lunch', 
                        ingredients: [], 
                        description: '', 
                        locked: false 
                    }}
                    recipeDB={dbRecipes}
                    foodDB={dbFoods}
                />
                <RecipeFormModal
                    isOpen={isAddModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveRecipe}
                    initialData={editingRecipe}
                    foodDB={dbFoods}
                />
            </div>
        </AppLayout>
    );
}
