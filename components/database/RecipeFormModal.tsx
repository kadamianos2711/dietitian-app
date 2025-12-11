'use client';

import { useState, useMemo } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { Recipe, RecipeCategory, RecipeTime, RecipeCost, RecipeDifficulty, RecipeIngredient, FoodItem } from '@/types/engine';
import { FOOD_DB } from '@/data/foodDB';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (recipe: Recipe) => void;
    initialData?: Recipe;
}

export default function RecipeFormModal({ isOpen, onClose, onSave, initialData }: Props) {
    if (!isOpen) return null;

    // Load custom foods optionally if we were passing them in props, but for now we use FOOD_DB + Local Foods from localStorage?
    // For simplicity in this modal, we will read localStorage directly for custom foods to allow picking them.
    const [localFoods, setLocalFoods] = useState<FoodItem[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('custom_foods');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const allFoods = useMemo(() => [...localFoods, ...FOOD_DB], [localFoods]);

    const [formData, setFormData] = useState<Partial<Recipe>>({
        name: '',
        description: '',
        category: 'main',
        time: 'moderate',
        difficulty: 'easy',
        cost: 'moderate',
        ingredients: [],
        instructions: [],
        tags: [],
        servings: 1
    });

    // Populate form on open
    useState(() => {
        if (initialData) {
            setFormData(JSON.parse(JSON.stringify(initialData))); // Deep copy
        }
    });

    const [ingredientSearch, setIngredientSearch] = useState('');
    const [selectedFoodId, setSelectedFoodId] = useState('');
    const [amount, setAmount] = useState(100);
    const [instructionText, setInstructionText] = useState('');

    const calculateMacros = (ingredients: RecipeIngredient[]) => {
        let calories = 0, protein = 0, carbs = 0, fat = 0;

        ingredients.forEach(ing => {
            const food = allFoods.find(f => f.id === ing.foodId);
            if (food) {
                const ratio = ing.amount / 100;
                calories += food.macros.calories * ratio;
                protein += food.macros.protein * ratio;
                carbs += food.macros.carbs * ratio;
                fat += food.macros.fat * ratio;
            }
        });

        return {
            calories: Math.round(calories),
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fat: Math.round(fat)
        };
    };

    const handleAddIngredient = () => {
        if (!selectedFoodId) return;
        const food = allFoods.find(f => f.id === selectedFoodId);
        if (!food) return;

        const newIngredient: RecipeIngredient = {
            foodId: food.id,
            name: food.name, // Snapshot name
            amount: amount,
            unit: 'g'
        };

        const updatedIngredients = [...(formData.ingredients || []), newIngredient];
        setFormData({ ...formData, ingredients: updatedIngredients });

        // Reset inputs
        setSelectedFoodId('');
        setIngredientSearch('');
        setAmount(100);
    };

    const handleRemoveIngredient = (idx: number) => {
        const updated = (formData.ingredients || []).filter((_, i) => i !== idx);
        setFormData({ ...formData, ingredients: updated });
    };

    const handleAddInstruction = () => {
        if (!instructionText.trim()) return;
        setFormData({ ...formData, instructions: [...(formData.instructions || []), instructionText] });
        setInstructionText('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const ingredients = formData.ingredients || [];
        const macros = calculateMacros(ingredients);

        const newRecipe: Recipe = {
            id: initialData?.id || uuidv4(),
            name: formData.name || 'New Recipe',
            description: formData.description || '',
            category: formData.category as RecipeCategory,
            time: formData.time as RecipeTime,
            difficulty: formData.difficulty as RecipeDifficulty,
            cost: formData.cost as RecipeCost,
            ingredients: ingredients,
            instructions: formData.instructions || [],
            macros: macros,
            tags: formData.tags || [],
            servings: formData.servings || 1
        };

        onSave(newRecipe);
        onClose();
    };

    const filteredFoods = allFoods.filter(f => f.name.toLowerCase().includes(ingredientSearch.toLowerCase())).slice(0, 10);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">
                        {initialData ? 'Επεξεργασία Συνταγής' : 'Προσθήκη Νέας Συνταγής'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Όνομα Συνταγής</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Περιγραφή</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                rows={2}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value as RecipeTime })}
                            >
                                <option value="very_fast">Πολύ γρήγορη (&lt;10')</option>
                                <option value="fast">Γρήγορη (10-20')</option>
                                <option value="moderate">Μέτρια (20-40')</option>
                                <option value="slow">Αργή (&gt;40')</option>
                            </select>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                value={formData.difficulty}
                                onChange={e => setFormData({ ...formData, difficulty: e.target.value as RecipeDifficulty })}
                            >
                                <option value="very_easy">Πολύ Εύκολη</option>
                                <option value="easy">Εύκολη</option>
                                <option value="moderate">Μέτρια</option>
                                <option value="hard">Δύσκολη</option>
                            </select>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                value={formData.cost}
                                onChange={e => setFormData({ ...formData, cost: e.target.value as RecipeCost })}
                            >
                                <option value="cheap">Οικονομική (€)</option>
                                <option value="moderate">Μέτρια (€€)</option>
                                <option value="expensive">Ακριβή (€€€)</option>
                            </select>
                            <div className="flex items-center space-x-2">
                                <label className="text-xs font-medium text-gray-700 whitespace-nowrap">Μερίδες:</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
                                    value={formData.servings}
                                    onChange={e => setFormData({ ...formData, servings: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <hr />

                    {/* Ingredients Builder */}
                    <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-900">Υλικά</h4>
                        <div className="flex space-x-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Αναζήτηση υλικού..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={ingredientSearch}
                                    onChange={e => {
                                        setIngredientSearch(e.target.value);
                                        setSelectedFoodId(''); // clear selection on type
                                    }}
                                />
                                {ingredientSearch && !selectedFoodId && (
                                    <div className="absolute z-10 w-full bg-white shadow-lg max-h-40 overflow-auto border border-gray-100 rounded-b-md">
                                        {filteredFoods.map(f => (
                                            <div
                                                key={f.id}
                                                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                                onClick={() => {
                                                    setIngredientSearch(f.name);
                                                    setSelectedFoodId(f.id);
                                                }}
                                            >
                                                {f.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <input
                                type="number"
                                className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                                value={amount}
                                onChange={e => setAmount(Number(e.target.value))}
                            />
                            <div className="py-2 text-sm text-gray-500">g</div>
                            <button
                                type="button"
                                onClick={handleAddIngredient}
                                disabled={!selectedFoodId}
                                className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List of Ingredients */}
                        <div className="bg-gray-50 rounded-md p-3 space-y-2">
                            {formData.ingredients?.map((ing, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm bg-white p-2 rounded shadow-sm">
                                    <span>{ing.amount}g <strong>{ing.name}</strong></span>
                                    <button onClick={() => handleRemoveIngredient(idx)} className="text-red-400 hover:text-red-600">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {(!formData.ingredients || formData.ingredients.length === 0) && (
                                <p className="text-gray-400 text-xs text-center py-2">Δεν έχουν προστεθεί υλικά</p>
                            )}
                        </div>
                    </div>

                    <hr />

                    {/* Instructions */}
                    <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-900">Οδηγίες</h4>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Προσθήκη βήματος..."
                                value={instructionText}
                                onChange={e => setInstructionText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddInstruction())}
                            />
                            <button
                                type="button"
                                onClick={handleAddInstruction}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                            {formData.instructions?.map((inst, idx) => (
                                <li key={idx}>{inst}</li>
                            ))}
                        </ol>
                    </div>

                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Ακύρωση
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Αποθήκευση Συνταγής
                    </button>
                </div>
            </div>
        </div>
    );
}
