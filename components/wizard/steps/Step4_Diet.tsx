import { ClientFormData, FoodPreference } from '@/types/client';
import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

interface Props {
    data: ClientFormData;
    update: (data: Partial<ClientFormData>) => void;
}

const FOOD_CATEGORIES = [
    {
        name: 'Κρέας & Πουλερικά',
        items: ['Κοτόπουλο', 'Μοσχάρι', 'Χοιρινό', 'Αρνί', 'Γαλοπούλα']
    },
    {
        name: 'Ψάρια & Θαλασσινά',
        items: ['Λευκά ψάρια (π.χ. τσιπούρα)', 'Λιπαρά ψάρια (π.χ. σολομός)', 'Θαλασσινά (γαρίδες κ.λπ.)', 'Τόνος κονσέρβα']
    },
    {
        name: 'Όσπρια & Λαδερά',
        items: ['Φακές', 'Φασόλια', 'Ρεβύθια', 'Αρακάς / Φασολάκια']
    },
    {
        name: 'Λαχανικά & Φρούτα',
        items: ['Ωμή σαλάτα', 'Βραστά λαχανικά', 'Φρούτα εποχής', 'Ξηροί καρποί']
    },
    {
        name: 'Γαλακτοκομικά',
        items: ['Γάλα', 'Γιαούρτι', 'Τυρί', 'Αυγά']
    },
    {
        name: 'Υδατάνθρακες & Γλυκά',
        items: ['Ψωμί', 'Ζυμαρικά', 'Ρύζι', 'Πατάτες', 'Γλυκά / Σοκολάτα']
    }
];

export default function Step4_Diet({ data, update }: Props) {

    const setPreference = (food: string, pref: FoodPreference) => {
        update({
            foodPreferences: {
                ...data.foodPreferences,
                [food]: pref
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

                                <div className="flex bg-gray-100 rounded-lg p-1">

                                    {/* Like */}
                                    <button
                                        onClick={() => setPreference(item, 'like')}
                                        className={cn(
                                            "p-2 rounded-md transition-all",
                                            getPreference(item) === 'like' ? "bg-green-500 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                                        )}
                                        title="Μου αρέσει"
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                    </button>

                                    {/* Neutral */}
                                    <button
                                        onClick={() => setPreference(item, 'neutral')}
                                        className={cn(
                                            "p-2 rounded-md transition-all",
                                            getPreference(item) === 'neutral' ? "bg-white text-gray-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                        )}
                                        title="Ουδέτερο"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>

                                    {/* Dislike */}
                                    <button
                                        onClick={() => setPreference(item, 'dislike')}
                                        className={cn(
                                            "p-2 rounded-md transition-all",
                                            getPreference(item) === 'dislike' ? "bg-red-500 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                                        )}
                                        title="Δεν μου αρέσει"
                                    >
                                        <ThumbsDown className="w-4 h-4" />
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
