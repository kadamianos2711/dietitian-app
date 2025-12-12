import { ClientFormData, FoodPreference } from '@/types/client';
import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, Heart } from 'lucide-react';

interface Props {
    data: ClientFormData;
    update: (data: Partial<ClientFormData>) => void;
}

import { FOOD_CATEGORIES } from '@/lib/constants';

export default function Step4_Diet({ data, update }: Props) {

    const setPreference = (food: string, pref: FoodPreference) => {
        // Toggle logic: if clicking the same preference, reset to neutral
        const current = data.foodPreferences[food] || 'neutral';
        const newValue = current === pref ? 'neutral' : pref;

        update({
            foodPreferences: {
                ...data.foodPreferences,
                [food]: newValue
            }
        });
    };

    const getPreference = (food: string): FoodPreference => {
        return data.foodPreferences[food] || 'neutral';
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">

            {FOOD_CATEGORIES.map(category => (
                <div key={category.name} className="border-b border-gray-100 pb-6 last:border-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{category.name}</h3>
                    <div className="space-y-3">
                        {category.items.map(item => (
                            <div key={item} className="flex items-center justify-between md:justify-start md:space-x-8">
                                <span className="text-sm font-medium text-gray-700 w-1/3 md:w-64">{item}</span>

                                <div className="flex bg-gray-100 rounded-lg p-1 gap-1">

                                    {/* Love */}
                                    <button
                                        onClick={() => setPreference(item, 'love')}
                                        className={cn(
                                            "p-2 rounded-md transition-all duration-200",
                                            getPreference(item) === 'love' 
                                                ? "bg-pink-500 text-white shadow-md transform scale-105" 
                                                : "text-gray-400 hover:bg-pink-100 hover:text-pink-500"
                                        )}
                                        title="Το αγαπώ!"
                                    >
                                        <Heart className={cn("w-4 h-4", getPreference(item) === 'love' && "fill-current")} />
                                    </button>

                                    {/* Like */}
                                    <button
                                        onClick={() => setPreference(item, 'like')}
                                        className={cn(
                                            "p-2 rounded-md transition-all duration-200",
                                            getPreference(item) === 'like' 
                                                ? "bg-green-500 text-white shadow-md transform scale-105" 
                                                : "text-gray-400 hover:bg-green-100 hover:text-green-500"
                                        )}
                                        title="Μου αρέσει"
                                    >
                                        <ThumbsUp className={cn("w-4 h-4", getPreference(item) === 'like' && "fill-current")} />
                                    </button>

                                    {/* Dislike */}
                                    <button
                                        onClick={() => setPreference(item, 'dislike')}
                                        className={cn(
                                            "p-2 rounded-md transition-all duration-200",
                                            getPreference(item) === 'dislike' 
                                                ? "bg-red-500 text-white shadow-md transform scale-105" 
                                                : "text-gray-400 hover:bg-red-100 hover:text-red-500"
                                        )}
                                        title="Δεν μου αρέσει"
                                    >
                                        <ThumbsDown className={cn("w-4 h-4", getPreference(item) === 'dislike' && "fill-current")} />
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Free Text Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                    <label className="block text-sm font-medium text-red-600 mb-2">
                        Τρόφιμα που δεν θέλετε ΚΑΘΟΛΟΥ;
                    </label>
                    <textarea
                        rows={3}
                        value={data.dislikedFoods}
                        onChange={(e) => update({ dislikedFoods: e.target.value })}
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-green-600 mb-2">
                        Τρόφιμα που αγαπάτε ΙΔΙΑΙΤΕΡΑ;
                    </label>
                    <textarea
                        rows={3}
                        value={data.lovedFoods}
                        onChange={(e) => update({ lovedFoods: e.target.value })}
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                </div>
            </div>

        </div>
    );
}
