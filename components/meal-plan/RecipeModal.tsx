import { X, Printer } from 'lucide-react';
import { RECIPE_DB } from '@/data/recipeDB';
import { Recipe } from '@/types/engine';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    recipeName: string;
}

export default function RecipeModal({ isOpen, onClose, recipeName }: Props) {
    if (!isOpen) return null;

    const recipe = RECIPE_DB.find(r => r.name === recipeName);

    // Helpers for badges
    const getTime = (t?: string) => {
        const map: Record<string, string> = { very_fast: "<10'", fast: "10-20'", moderate: "20-40'", slow: ">40'" };
        return t ? (map[t] || "20-40'") : "-";
    };
    const getDifficulty = (d?: string) => {
        const map: Record<string, string> = { very_easy: "Πολύ εύκολη", easy: "Εύκολη", moderate: "Μέτρια", hard: "Δύσκολη" };
        return d ? (map[d] || "Εύκολη") : "-";
    };
    const getCost = (c?: string) => {
        const map: Record<string, string> = { cheap: "Οικονομική", moderate: "Μέτρια", expensive: "Ακριβή" };
        return c ? (map[c] || "Οικονομική") : "-";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{recipeName || 'Λεπτομέρειες Συνταγής'}</h3>
                        <p className="text-sm text-gray-500 mt-1">1 μερίδα • {recipe?.macros.calories || 450} kcal</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-8">
                    <div>
                        {/* Metadata Badges */}
                        <div className="flex space-x-2 mb-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                ⏱️ {getTime(recipe?.time)}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                📊 {getDifficulty(recipe?.difficulty)}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                💰 {getCost(recipe?.cost)}
                            </span>
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-3">Υλικά</h3>
                        <ul className="list-disc list-inside space-y-1 mb-6 text-gray-600">
                            {recipe?.ingredients.map((ing, idx) => (
                                <li key={idx}>
                                    {ing.amount}{ing.unit || 'g'} {ing.name}
                                </li>
                            )) || <li>Δεν βρέθηκαν υλικά</li>}
                        </ul>

                        <h3 className="text-lg font-medium text-gray-900 mb-3">Εκτέλεση</h3>
                        <div className="space-y-3 text-gray-600">
                            {recipe?.instructions.map((step, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <span className="font-bold text-green-600 shrink-0">{idx + 1}.</span>
                                    <p>{step.replace(/^\d+\.\s*/, '')}</p>
                                </div>
                            )) || <p>Δεν βρέθηκαν οδηγίες</p>}
                        </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-xs text-green-800 font-medium">
                            Tip: Η συνταγή αυτή βγάζει 1 μερίδα. Μπορείτε να προετοιμάσετε πολλαπλές μερίδες από το βράδυ (Overnight Oats).
                        </p>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button className="w-full flex justify-center items-center px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 font-medium text-sm transition-colors">
                        <Printer className="w-4 h-4 mr-2" />
                        Εκτύπωση Συνταγής
                    </button>
                </div>
            </div>
        </div>
    );
}
