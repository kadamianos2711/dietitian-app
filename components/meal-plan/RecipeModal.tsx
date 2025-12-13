import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Printer, Lock, Unlock, RefreshCw, ChevronRight, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
// import { RECIPE_DB } from '@/data/recipeDB';
import { DietMeal, Recipe, FoodItem } from '@/types/engine';
import { getRecipeAlternates, getIngredientSubstitutes, smartRound } from '@/lib/diet-engine/engine';
import { initialClientState, ClientFormData, FoodPreference } from '@/types/client'; // Using default for now

interface Props {
    isOpen: boolean;
    onClose: () => void;
    meal: DietMeal | null;
    onUpdateMeal?: (newMeal: DietMeal) => void;
    client?: ClientFormData;
    onUpdateClient?: (client: ClientFormData) => void;
    recipeDB: Recipe[];
    foodDB: FoodItem[];
}

export default function RecipeModal({ isOpen, onClose, meal, onUpdateMeal, client, onUpdateClient, recipeDB = [], foodDB = [] }: Props) {
    const [view, setView] = useState<'details' | 'replace_meal' | 'replace_ingredient'>('details');
    const [selectedIngIndex, setSelectedIngIndex] = useState<number | null>(null);

    if (!isOpen || !meal) return null;

    const recipe = recipeDB.find(r => r.id === meal.recipeId) || recipeDB.find(r => r.name === meal.recipeName);

    // Locking
    const toggleLock = () => {
        if (!meal || !onUpdateMeal) return;
        onUpdateMeal({ ...meal, locked: !meal.locked });
    };

    // Feedback Logic
    const toggleFeedback = async (type: FoodPreference, targetName?: string) => {
        if (!client || !onUpdateClient) return;
        
        // If no targetName provided, use recipe name (Meal Feedback)
        const nameToCheck = targetName || (recipe ? recipe.name : '');
        if (!nameToCheck) return;

        // Use the new foodPreferences map
        const currentPrefs = client.foodPreferences || {};
        const current = currentPrefs[nameToCheck] || 'neutral';
        
        // Toggle: if same type, reset to neutral. Else set type.
        const newValue = current === type ? 'neutral' : type;

        const newClient = {
            ...client,
            foodPreferences: {
                ...currentPrefs,
                [nameToCheck]: newValue
            }
        };

        // UI Update
        onUpdateClient(newClient);

        // API Persistence (Fire and Forget)
        // Check if client has a real ID (not mock '12' unless we want to persist demo changes partially)
        // For now, we always try to save if ID exists.
        if (client.id) {
            try {
                fetch('/api/clients', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newClient)
                }).catch(e => console.error('Background save failed', e)); // Silent fail for UX speed
            } catch (e) {
                console.error(e);
            }
        }
    };

    const getPreference = (name: string): FoodPreference => {
        return client?.foodPreferences?.[name] || 'neutral';
    };



    // Replace Meal Logic
    const alternates = view === 'replace_meal' 
        ? getRecipeAlternates(meal.recipeId, meal.type, initialClientState, recipeDB) // Passing mock client for now
        : [];

    const handleReplaceMeal = (newRecipe: Recipe) => {
        // Recalculate everything for new recipe
        // We need target calories. We can infer it from current meal.
        const currentCals = meal.calories;
        const factor = currentCals / newRecipe.macros.calories;
        
        // Structure ingredients
        const newIngredients = newRecipe.ingredients.map(ing => {
            const rawAmount = ing.amount * factor;
             return {
                 name: ing.name,
                 amount: smartRound(rawAmount),
                 unit: ing.unit || 'g',
                 foodId: ing.foodId
             };
        });

        // Update description
        const desc = newIngredients.map(i => `${i.amount}${i.unit} ${i.name}`).join(', ');

        if (onUpdateMeal) {
            onUpdateMeal({
                ...meal,
                recipeId: newRecipe.id,
                recipeName: newRecipe.name,
                description: desc,
                ingredients: newIngredients,
                // Keep calories same
            });
        }
        setView('details');
    };

    // Replace Ingredient Logic
    const substitutes = (view === 'replace_ingredient' && selectedIngIndex !== null)
        ? getIngredientSubstitutes(meal.ingredients[selectedIngIndex].foodId, foodDB)
        : [];
    
    const handleReplaceIngredient = (sub: { foodId: string, name: string }) => {
        if (selectedIngIndex === null) return;
        
        const oldIng = meal.ingredients[selectedIngIndex];
        const newIngs = [...meal.ingredients];
        
        // Swap
        newIngs[selectedIngIndex] = {
            ...oldIng,
            name: sub.name,
            foodId: sub.foodId
        };

        // Update description
        const desc = newIngs.map(i => `${i.amount}${i.unit} ${i.name}`).join(', ');

        // Update Recipe Name (Dynamic Renaming)
        let newRecipeName = meal.recipeName;
        
        // Escape function for regex safety
        const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        const oldNameRegex = new RegExp(escapeRegExp(oldIng.name), 'gi'); 
        if (oldNameRegex.test(newRecipeName)) {
             newRecipeName = newRecipeName.replace(oldNameRegex, sub.name);
        }

        if (onUpdateMeal) {
            onUpdateMeal({
                ...meal,
                recipeName: newRecipeName,
                ingredients: newIngs,
                description: desc
            });
        }
        setView('details');
        setSelectedIngIndex(null);
    };


    const getTime = (t?: string) => {
        const map: Record<string, string> = { very_fast: "<10'", fast: "10-20'", moderate: "20-40'", slow: ">40'" };
        return t ? (map[t] || "20-40'") : "-";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        {view === 'details' ? (
                            <>
                                <h3 className="text-xl font-bold text-gray-900">{meal.recipeName}</h3>
                                <p className="text-sm text-gray-500 mt-1">{meal.calories} kcal</p>
                            </>
                        ) : (
                            <button 
                                onClick={() => {
                                    setView('details');
                                    setSelectedIngIndex(null);
                                }} 
                                className="text-sm text-blue-600 font-medium flex items-center"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                                Πίσω στη συνταγή
                            </button>
                        )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        {view === 'details' && (
                            <button 
                                onClick={toggleLock}
                                className={`p-2 rounded-full transition-colors ${meal.locked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                title={meal.locked ? "Ξεκλείδωμα" : "Κλείδωμα"}
                            >
                                {meal.locked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                            </button>
                        )}
                        
                        {/* Feedback Buttons (Recipe) */}
                        {view === 'details' && client && (
                            <>
                                <button 
                                    onClick={() => toggleFeedback('love')}
                                    className={cn(
                                        "p-2 rounded-full transition-colors",
                                        getPreference(recipe?.name || '') === 'love' ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                    )}
                                    title="Το λατρεύω! (Θα εμφανίζεται συχνότερα)"
                                >
                                    <Heart className={cn("w-5 h-5", getPreference(recipe?.name || '') === 'love' && "fill-current")} />
                                </button>
                                <button 
                                    onClick={() => toggleFeedback('like')}
                                    className={cn(
                                        "p-2 rounded-full transition-colors",
                                        getPreference(recipe?.name || '') === 'like' ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                    )}
                                    title="Μου αρέσει"
                                >
                                    <ThumbsUp className={cn("w-5 h-5", getPreference(recipe?.name || '') === 'like' && "fill-current")} />
                                </button>
                                <button 
                                    onClick={() => toggleFeedback('dislike')}
                                    className={cn(
                                        "p-2 rounded-full transition-colors",
                                        getPreference(recipe?.name || '') === 'dislike' ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                    )}
                                    title="Δεν μου αρέσει (Αποφυγή)"
                                >
                                    <ThumbsDown className={cn("w-5 h-5", getPreference(recipe?.name || '') === 'dislike' && "fill-current")} />
                                </button>
                            </>
                        )}
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {view === 'details' && (
                        <>
                             {/* Actions Row */}
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => setView('replace_meal')}
                                    className="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Αλλαγή Γεύματος
                                </button>
                                <button 
                                    onClick={() => setView('replace_ingredient')}
                                    className="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Αλλαγή Υλικού
                                </button>
                            </div>

                            {/* Metadata */}
                            <div className="flex space-x-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    ⏱️ {getTime(recipe?.time)}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Υλικά (Επεξεργάσιμα)</h3>
                                <ul className="space-y-2">
                                    {meal.ingredients.map((ing, idx) => (
                                        <li key={idx} className="flex justify-between items-center text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                            <span>{ing.amount}{ing.unit} <strong>{ing.name}</strong></span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Εκτέλεση</h3>
                                <div className="space-y-3 text-gray-600 text-sm">
                                    {recipe?.instructions?.map((step, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <span className="font-bold text-green-600 shrink-0">{idx + 1}.</span>
                                            <p>{step.replace(/^\d+\.\s*/, '')}</p>
                                        </div>
                                    )) || <p>Δεν βρέθηκαν οδηγίες</p>}
                                </div>
                            </div>
                        </>
                    )}

                    {view === 'replace_meal' && (
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Επιλέξτε εναλλακτικό γεύμα</h3>
                            <div className="space-y-3">
                                {alternates.map(alt => (
                                    <button
                                        key={alt.id}
                                        onClick={() => handleReplaceMeal(alt)}
                                        className="w-full text-left p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex justify-between items-center"
                                    >
                                        <div>
                                            <div className="font-medium text-gray-900">{alt.name}</div>
                                            <div className="text-xs text-gray-500">{alt.macros.calories} kcal • {alt.ingredients.length} υλικά</div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </button>
                                ))}
                                {alternates.length === 0 && <p className="text-gray-500 text-sm">Δεν βρέθηκαν εναλλακτικές.</p>}
                            </div>
                        </div>
                    )}

                    {view === 'replace_ingredient' && (
                        <div>
                            {selectedIngIndex === null ? (
                                <>
                                    <h3 className="font-bold text-gray-900 mb-4">Ποιο υλικό θέλετε να αλλάξετε;</h3>
                                    <div className="space-y-2">
                                        {meal.ingredients.map((ing, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedIngIndex(idx)}
                                                className="w-full text-left p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50"
                                            >
                                                <span className="font-medium">{ing.name}</span>
                                                <span className="text-gray-500 text-sm ml-2">({ing.amount}{ing.unit})</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-gray-900">Αντικατάσταση για: {meal.ingredients[selectedIngIndex].name}</h3>
                                        <button 
                                            onClick={() => setSelectedIngIndex(null)}
                                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Πίσω
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {substitutes.map(sub => {
                                            const pref = getPreference(sub.name);

                                            return (
                                                <div key={sub.foodId} className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleReplaceIngredient(sub)}
                                                        className="flex-1 text-left p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50"
                                                    >
                                                        {sub.name}
                                                    </button>
                                                    
                                                    {/* Feedback for Substitute */}
                                                    <div className="flex space-x-1 shrink-0">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleFeedback('love', sub.name);
                                                            }}
                                                            className={cn(
                                                                "p-2 rounded-full transition-all duration-200",
                                                                pref === 'love' 
                                                                    ? "bg-pink-500 text-white shadow-md transform scale-110" 
                                                                    : "bg-gray-50 text-gray-300 hover:bg-pink-100 hover:text-pink-500"
                                                            )}
                                                            title="Το λατρεύω!"
                                                        >
                                                            <Heart className={cn("w-4 h-4", pref === 'love' && "fill-current")} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleFeedback('like', sub.name);
                                                            }}
                                                            className={cn(
                                                                "p-2 rounded-full transition-all duration-200",
                                                                pref === 'like' 
                                                                    ? "bg-green-500 text-white shadow-md transform scale-110" 
                                                                    : "bg-gray-50 text-gray-300 hover:bg-green-100 hover:text-green-500"
                                                            )}
                                                            title="Μου αρέσει"
                                                        >
                                                            <ThumbsUp className={cn("w-4 h-4", pref === 'like' && "fill-current")} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleFeedback('dislike', sub.name);
                                                            }}
                                                            className={cn(
                                                                "p-2 rounded-full transition-all duration-200",
                                                                pref === 'dislike' 
                                                                    ? "bg-red-500 text-white shadow-md transform scale-110" 
                                                                    : "bg-gray-50 text-gray-300 hover:bg-red-100 hover:text-red-500"
                                                            )}
                                                            title="Δεν μου αρέσει"
                                                        >
                                                            <ThumbsDown className={cn("w-4 h-4", pref === 'dislike' && "fill-current")} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {substitutes.length === 0 && <p className="text-gray-500 text-sm">Δεν βρέθηκαν παρόμοια υλικά.</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
