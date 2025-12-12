
import { useState, useEffect } from 'react';
import { ClientFormData, FoodPreference } from '@/types/client';
import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, Heart, Save } from 'lucide-react';
import { FOOD_CATEGORIES } from '@/lib/constants';

interface Props {
    client: ClientFormData;
}

export default function TabFeedback({ client }: Props) {
    const [preferences, setPreferences] = useState<Record<string, FoodPreference>>(client.foodPreferences || {});
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Sync from parent if client data refreshes (e.g. returning from meal plan)
    useEffect(() => {
        if (client.foodPreferences) {
            setPreferences(client.foodPreferences);
        }
    }, [client.foodPreferences]);

    const getPreference = (food: string): FoodPreference => {
        return preferences[food] || 'neutral';
    };

    const setPreference = (food: string, pref: FoodPreference) => {
        // Toggle logic
        const current = preferences[food] || 'neutral';
        const newValue = current === pref ? 'neutral' : pref;
        
        setPreferences(prev => ({
            ...prev,
            [food]: newValue
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!hasChanges) return;
        setIsSaving(true);
        try {
            // We need to fetch the full client first to ensure we don't overwrite other changes
            // Or simpler: just patch the foodPreferences.
            // Since our API helper `updateClient` supports partial updates, we can just send what changed.
            // But here we might be reusing the wizard logic or plain API calls.
            // Let's use the API route directly.
            
            // Construct the updated client object (or just the part we need to merge)
            // The API expects a full object usually for PUT or specific fields.
            // Let's assume our /api/clients supports PUT with ID in query or body.
            // Wait, previous implementation of PUT in storage.ts updates the whole client.
            // So we should merge with current client prop.
            
            const updatedClient = {
                ...client,
                foodPreferences: preferences
            };

            const res = await fetch('/api/clients', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedClient)
            });

            if (!res.ok) throw new Error('Failed to update');
            
            setHasChanges(false);
            alert('Οι προτιμήσεις αποθηκεύτηκαν επιτυχώς!');
        } catch (error) {
            console.error(error);
            alert('Σφάλμα κατά την αποθήκευση.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Actions */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Feedback & Προτιμήσεις Τροφίμων</h3>
                    <p className="text-sm text-gray-500 mt-1">Διαχειριστείτε τις προτιμήσεις του πελάτη (Αγαπημένα, Αρέσουν, Δεν Αρέσουν).</p>
                </div>
                {hasChanges && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Αποθήκευση...' : 'Αποθήκευση Αλλαγών'}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {FOOD_CATEGORIES.map(category => (
                    <div key={category.name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                             {category.name}
                        </h4>
                        <div className="space-y-3">
                            {category.items.map(item => (
                                <div key={item} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 font-medium">{item}</span>
                                    
                                    <div className="flex bg-gray-50 rounded-lg p-1 gap-1">
                                        <button
                                            onClick={() => setPreference(item, 'love')}
                                            className={cn(
                                                "p-1.5 rounded-md transition-all duration-200",
                                                getPreference(item) === 'love' 
                                                    ? "bg-pink-500 text-white shadow-md transform scale-105" 
                                                    : "text-gray-300 hover:bg-pink-50 hover:text-pink-400"
                                            )}
                                        >
                                            <Heart className={cn("w-3.5 h-3.5", getPreference(item) === 'love' && "fill-current")} />
                                        </button>
                                        <button
                                            onClick={() => setPreference(item, 'like')}
                                            className={cn(
                                                "p-1.5 rounded-md transition-all duration-200",
                                                getPreference(item) === 'like' 
                                                    ? "bg-green-500 text-white shadow-md transform scale-105" 
                                                    : "text-gray-300 hover:bg-green-50 hover:text-green-400"
                                            )}
                                        >
                                            <ThumbsUp className={cn("w-3.5 h-3.5", getPreference(item) === 'like' && "fill-current")} />
                                        </button>
                                        <button
                                            onClick={() => setPreference(item, 'dislike')}
                                            className={cn(
                                                "p-1.5 rounded-md transition-all duration-200",
                                                getPreference(item) === 'dislike' 
                                                    ? "bg-red-500 text-white shadow-md transform scale-105" 
                                                    : "text-gray-300 hover:bg-red-50 hover:text-red-400"
                                            )}
                                        >
                                            <ThumbsDown className={cn("w-3.5 h-3.5", getPreference(item) === 'dislike' && "fill-current")} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Uncategorized Items */}
                {(() => {
                    const categorizedItems = new Set(FOOD_CATEGORIES.flatMap(c => c.items));
                    const uncategorized = Object.keys(preferences).filter(item => !categorizedItems.has(item) && preferences[item] !== 'neutral');

                    if (uncategorized.length === 0) return null;

                    return (
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                Άλλα / Προστέθηκαν
                            </h4>
                            <div className="space-y-3">
                                {uncategorized.map(item => (
                                    <div key={item} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 font-medium">{item}</span>
                                        <div className="flex bg-gray-50 rounded-lg p-1 gap-1">
                                            <button onClick={() => setPreference(item, 'love')} className={cn("p-1.5 rounded-md", getPreference(item) === 'love' ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-pink-50")}><Heart className={cn("w-3.5 h-3.5", getPreference(item) === 'love' && "fill-current")} /></button>
                                            <button onClick={() => setPreference(item, 'like')} className={cn("p-1.5 rounded-md", getPreference(item) === 'like' ? "bg-green-500 text-white" : "text-gray-300 hover:bg-green-50")}><ThumbsUp className={cn("w-3.5 h-3.5", getPreference(item) === 'like' && "fill-current")} /></button>
                                            <button onClick={() => setPreference(item, 'dislike')} className={cn("p-1.5 rounded-md", getPreference(item) === 'dislike' ? "bg-red-500 text-white" : "text-gray-300 hover:bg-red-50")}><ThumbsDown className={cn("w-3.5 h-3.5", getPreference(item) === 'dislike' && "fill-current")} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}
