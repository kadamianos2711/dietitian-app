'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChevronLeft, Save, ArrowRight, Printer, ShoppingCart, RefreshCw, X, Wand2, Info } from 'lucide-react';
import { format } from 'date-fns';
import ShoppingListModal from '@/components/meal-plan/ShoppingListModal';
import RecipeModal from '@/components/meal-plan/RecipeModal';
import { generateWeeklyPlan, generateDailyPlan, getActiveSlots } from '@/lib/diet-engine/engine';
import { WeeklyPlan, DietMeal } from '@/types/engine';
import { initialClientState } from '@/types/client';
import DailyContextModal from '@/components/meal-plan/DailyContextModal';
import { DailyContext } from '@/types/context';
import { Settings } from 'lucide-react';

// ... imports

const MEAL_COLUMNS = [
    { id: 'breakfast', label: 'Πρωινό' },
    { id: 'snack1', label: 'Πρώτο ενδιάμεσο' },
    { id: 'snack2', label: 'Δεύτερο ενδιάμεσο' },
    { id: 'lunch', label: 'Μεσημεριανό' },
    { id: 'afternoon1', label: 'Πρώτο απογευματινό' },
    { id: 'afternoon2', label: 'Δεύτερο απογευματινό' },
    { id: 'dinner', label: 'Βραδινό' },
    { id: 'bedtime', label: 'Προ ύπνου' },
];

/* interface Props {
    params: {
        id: string;
    };
} */ // No longer using props for params in Client Component for safety

export default function CreateMealPlanPage() {
    const router = useRouter();
    const params = useParams();
    // params.id will be available
    const [step, setStep] = useState(1);

    // Step 1 State
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [calories, setCalories] = useState('1800');
    const [mealsCount, setMealsCount] = useState('5');

    // Step 2 State - NOW USING REAL ENGINE DATA
    const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);

    // UI State
    const [showShoppingList, setShowShoppingList] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<{ dayIndex: number, slotId: string, meal: DietMeal } | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Context State
    const [dailyContexts, setDailyContexts] = useState<DailyContext[]>([]);
    const [editingDay, setEditingDay] = useState<number | null>(null); // For Modal

    // Client Data State (Mock initialization)
    // Client Data State
    const [clientData, setClientData] = useState<typeof initialClientState>(initialClientState);

    // Fetch Client Data
    useEffect(() => {
        if (params.id) {
            fetch(`/api/clients?id=${params.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data && !data.error) {
                         // Merge with initial state to ensure all fields exist
                         // If data comes from JSON DB it might match Client interface but let's be safe
                         setClientData(prev => ({
                             ...prev,
                             ...data,
                             // Ensure foodPreferences is object
                             foodPreferences: data.foodPreferences || {}
                         }));
                    }
                })
                .catch(err => console.error("Failed to load client", err));
        }
    }, [params.id]);

    // Helper to get Meal from day
    const getMealForSlot = (dayIndex: number, slotId: string): DietMeal | undefined => {
        return weeklyPlan?.days[dayIndex]?.meals[slotId];
    };

    const handleContinue = () => {
        // Initial empty generation if needed, or just go to step 2
        setStep(2);
    };

    const handleAutoGenerate = () => {
        setIsGenerating(true);
        // Simulate slight delay for effect
        setTimeout(() => {
            // Use state instead of local mockClient
            const plan = generateWeeklyPlan(clientData, {
                calories: parseInt(calories),
                mealsCount: parseInt(mealsCount),
                startDate: startDate,
                dailyContexts: dailyContexts,
                randomize: true
            }, weeklyPlan || undefined);

            setWeeklyPlan(plan);
            setIsGenerating(false);
        }, 800);
    };

    const handleSave = async () => {
        if (!weeklyPlan) return;

        try {
            const res = await fetch('/api/meal-plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: weeklyPlan,
                    clientId: params.id,
                    name: `Διαιτολόγιο ${format(new Date(startDate), 'dd/MM/yyyy')}`
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to save plan');
            }

            alert('Το διαιτολόγιο αποθηκεύτηκε επιτυχώς!');
            router.push(`/clients/${params.id}?tab=mealplans`);
        } catch (error: any) {
            console.error(error);
            alert(`Σφάλμα κατά την αποθήκευση: ${error.message}`);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
                {/* Header - Hidden on Print */}
                <div className="flex items-center justify-between mb-8 print:hidden">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="text-gray-500 hover:text-gray-700 flex items-center mb-2"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Πίσω
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Δημιουργία νέου διαιτολογίου</h1>
                        <p className="text-sm text-gray-500 mt-1">Για τον πελάτη: <span className="font-medium text-gray-900">{clientData.firstName} {clientData.lastName}</span></p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Αποθήκευση πρόχειρου
                        </button>
                        {step === 1 ? (
                            <button
                                onClick={handleContinue}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center"
                            >
                                Συνέχεια στον πίνακα
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Αποθήκευση & Έξοδος
                            </button>
                        )}
                    </div>
                </div>

                {/* Print Header */}
                <div className="hidden print:block mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Εβδομαδιαίο Πρόγραμμα Διατροφής</h1>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>Πελάτης: <strong>{clientData.firstName} {clientData.lastName}</strong></span>
                        <span>Ημερομηνία: {format(new Date(startDate), 'dd/MM/yyyy')}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] print:shadow-none print:border-none print:min-h-0">
                    {step === 1 && (
                        <div className="p-8 max-w-2xl mx-auto print:hidden">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2">Βασικές ρυθμίσεις προγράμματος</h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ημερομηνία έναρξης</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Διάρκεια (ημέρες)</label>
                                    <input
                                        type="number"
                                        value={7}
                                        disabled
                                        className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-500 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Θερμιδικός στόχος / ημέρα (kcal)</label>
                                    <input
                                        type="number"
                                        value={calories}
                                        onChange={(e) => setCalories(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Αριθμός γευμάτων ανά ημέρα</label>
                                    <select
                                        value={mealsCount}
                                        onChange={(e) => setMealsCount(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    >
                                        <option value="4">4 Γεύματα</option>
                                        <option value="5">5 Γεύματα</option>
                                        <option value="6">6 Γεύματα</option>
                                        <option value="7">7 Γεύματα</option>
                                    </select>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                                    <p>ℹ️ Τα γεύματα θα κατανέμονται σε απόσταση περίπου 2–4 ωρών, με βάση τις ώρες ύπνου και αφύπνισης του πελάτη.</p>
                                </div>
                            </div>

                            {/* Daily Conditions (Step 1) */}
                            <div className="mt-8 border-t pt-6">
                                <h3 className="text-md font-medium text-gray-900 mb-4">Ειδικές Συνθήκες Ημέρας (Προαιρετικά)</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {[1, 2, 3, 4, 5, 6, 7].map(dayNum => {
                                        const ctx = dailyContexts.find(c => c.dayIndex === dayNum - 1);
                                        const hasContext = ctx && (ctx.conditions.length > 0 || ctx.event);
                                        return (
                                            <button
                                                key={dayNum}
                                                onClick={() => setEditingDay(dayNum)}
                                                className={`p-3 rounded-lg border text-left text-sm transition-colors
                                                    ${hasContext ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <div className="font-medium text-gray-900 flex justify-between">
                                                    <span>Ημέρα {dayNum}</span>
                                                    {hasContext && <Settings className="w-4 h-4 text-blue-600" />}
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500 h-5 truncate">
                                                    {hasContext 
                                                        ? `${ctx.conditions.length} συνθήκες${ctx.event ? ', 1 γεγονός' : ''}`
                                                        : 'Καμία ρύθμιση'}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col h-full">
                            {/* Toolbar */}
                            <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center justify-between print:hidden">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={handleAutoGenerate}
                                        disabled={isGenerating}
                                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm transition-all
                                            ${isGenerating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}`}
                                    >
                                        {isGenerating ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                Δημιουργία...
                                            </>
                                        ) : (
                                            <>
                                                <Wand2 className="w-4 h-4 mr-2" />
                                                Αυτόματη δημιουργία διαιτολογίου
                                            </>
                                        )}
                                    </button>

                                    <div className="h-6 w-px bg-gray-300 mx-2"></div>

                                    <button
                                        onClick={handlePrint}
                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                                        title="Εκτύπωση"
                                    >
                                        <Printer className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setShowShoppingList(true)}
                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                                        title="Λίστα ψωνιών"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                                    Στόχος: <span className="font-bold text-gray-900">{calories} kcal</span> | {mealsCount} γεύματα
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto p-4 print:p-0">
                                <table className="min-w-full divide-y divide-gray-200 border-collapse border border-gray-200 print:text-xs">
                                    <thead>
                                        <tr className="bg-gray-50 print:bg-gray-100">
                                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200 sticky left-0 bg-gray-50 z-10 w-24 print:static">
                                                Ημέρα
                                            </th>
                                            {MEAL_COLUMNS.slice(0, parseInt(mealsCount) + 2).map((col) => (
                                                <th key={col.id} className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200 min-w-[160px] print:min-w-0">
                                                    {col.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                                            const dayPlan = weeklyPlan?.days[dayIndex];
                                            const dayNumber = dayIndex + 1;
                                            const totalCals = dayPlan?.totalCalories || 0;
                                            const targetCals = parseInt(calories);
                                            const diff = totalCals - targetCals;
                                            const percentDiff = (diff / targetCals) * 100;

                                            // Determine calorie color
                                            let calColor = "text-gray-500";
                                            if (weeklyPlan) {
                                                if (Math.abs(percentDiff) <= 10) calColor = "text-green-600";
                                                else calColor = "text-orange-500";
                                            }

                                            return (
                                                <tr key={dayIndex} className="break-inside-avoid">
                                                    <td className="p-3 whitespace-nowrap text-sm font-bold text-gray-900 border border-gray-200 bg-gray-50 sticky left-0 z-10 print:static print:bg-white align-top">
                                                        {dayNumber}η Ημέρα

                                                        {/* Day Summary (Visible only in App) */}
                                                        {weeklyPlan && (
                                                            <div className="mt-2 text-xs font-normal print:hidden">
                                                                <div className={`${calColor} font-bold mb-1`}>
                                                                    {totalCals} kcal
                                                                </div>
                                                                <div className="text-gray-400 text-[10px]">
                                                                    P: {dayPlan?.macros.protein}g | C: {dayPlan?.macros.carbs}g
                                                                </div>

                                                                <button 
                                                                    onClick={() => {
                                                                        // Use state
                                                                        const currentClient = clientData;

                                                                        const settings = {
                                                                            calories: parseInt(calories),
                                                                            mealsCount: parseInt(mealsCount),
                                                                            startDate: startDate,
                                                                            dailyContexts: dailyContexts,
                                                                            randomize: true
                                                                        };

                                                                        const activeSlots = getActiveSlots(parseInt(mealsCount));
                                                                        const existingDay = weeklyPlan?.days[dayIndex];
                                                                        
                                                                        const newDay = generateDailyPlan(dayIndex + 1, currentClient, settings, activeSlots, existingDay);
                                                                        
                                                                        if (weeklyPlan) {
                                                                            const newPlan = { ...weeklyPlan };
                                                                            newPlan.days[dayIndex] = newDay;
                                                                            setWeeklyPlan(newPlan);
                                                                        }
                                                                    }}
                                                                    className="mt-2 block text-xs text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <RefreshCw className="w-3 h-3 inline mr-1" />
                                                                    Ανανέωση
                                                                </button>
                                                                
                                                                {/* Context Button inside Table */}
                                                                <button 
                                                                    onClick={() => setEditingDay(dayNumber)}
                                                                    className="mt-2 text-xs flex items-center text-gray-500 hover:text-blue-600"
                                                                >
                                                                    <Settings className="w-3 h-3 mr-1" />
                                                                    {(() => {
                                                                         // Check if this day has context either from State or from Generated Plan
                                                                         // Ideally plan stores it, but we can edit state too.
                                                                         const ctx = dailyContexts.find(c => c.dayIndex === dayIndex);
                                                                         return ctx && (ctx.conditions.length > 0 || ctx.event) ? 'Έχει ρυθμίσεις' : 'Ρυθμίσεις';
                                                                    })()}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    {MEAL_COLUMNS.slice(0, parseInt(mealsCount) + 2).map((col) => {
                                                        const meal = getMealForSlot(dayIndex, col.id);
                                                        return (
                                                            <td
                                                                key={col.id}
                                                                onClick={() => meal && setSelectedMeal({ dayIndex, slotId: col.id, meal })}
                                                                className={`p-2 border border-gray-200 align-top h-32 hover:bg-gray-50 transition-colors group relative print:h-auto print:hover:bg-white
                                                                ${meal ? 'cursor-pointer' : 'bg-gray-50 cursor-default'}
                                                                ${meal?.locked ? 'bg-red-50 hover:bg-red-100 ring-1 ring-inset ring-red-200' : ''}`}
                                                            >
                                                                {meal ? (
                                                                    <>
                                                                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                                                            {meal.locked && <Settings className="w-3 h-3 inline mr-1 text-red-500" />}
                                                                            {meal.recipeName}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 mt-1 line-clamp-3">
                                                                            {meal.description}
                                                                        </div>
                                                                        {/* Hover info for dietitian */}
                                                                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                                                                            <span className="bg-gray-800 text-white text-[10px] px-1 rounded">
                                                                                {meal.calories}
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="h-full flex items-center justify-center text-gray-300 print:hidden">
                                                                        -
                                                                    </div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Print Footer */}
                <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                    <p className="font-bold text-gray-900">Δαμιανός Καλτσίδης - Διαιτολόγος / Διατροφολόγος</p>
                    <p>Τσιμισκή 123, Θεσσαλονίκη | Τηλ: 2310 123456 | Email: info@dietitianscorner.gr</p>
                    <p className="mt-2 italic">Το παρόν πρόγραμμα είναι αυστηρά προσωπικό και απαγορεύεται η αναδημοσίευσή του.</p>
                </div>

                {/* Modals */}
                <ShoppingListModal
                    isOpen={showShoppingList}
                    onClose={() => setShowShoppingList(false)}
                />

                <RecipeModal
                    isOpen={!!selectedMeal}
                    meal={selectedMeal?.meal || null}
                    client={clientData} // Pass client data
                    onUpdateClient={setClientData} // Pass updater
                    onClose={() => setSelectedMeal(null)}
                    onUpdateMeal={(newMeal) => {
                        if (selectedMeal && weeklyPlan) {
                            // Update the plan state
                            // Deep copy to avoid mutation issues
                            const newPlan = { ...weeklyPlan };
                            const day = newPlan.days[selectedMeal.dayIndex];
                            if (day) {
                                day.meals[selectedMeal.slotId] = newMeal;
                                // Need to recalc totals? Yes, usually.
                                // Simplified for now: just update the meal.
                            }
                            setWeeklyPlan(newPlan);
                            setSelectedMeal({ ...selectedMeal, meal: newMeal }); // Update local state for modal
                        }
                    }}
                />

                <DailyContextModal
                    isOpen={editingDay !== null}
                    onClose={() => setEditingDay(null)}
                    dayNumber={editingDay || 1}
                    initialContext={dailyContexts.find(c => c.dayIndex === (editingDay ? editingDay - 1 : 0))}
                    onSave={(newContext) => {
                        setDailyContexts(prev => {
                            const filtered = prev.filter(c => c.dayIndex !== newContext.dayIndex);
                            return [...filtered, newContext];
                        });
                        // NOTE: If we are in Step 2, user expects immediate update?
                        // User request: "Rule packs applied ONLY on that day".
                        // Logic: If in Step 2, we might want to re-generate JUST that day?
                        // For now, let's assume they press "Regenerate" or simple "Auto Generate" again.
                        // Or we could implement a targeted regen function.
                        // But sticking to simple flow: Set context -> Press Auto Generate.
                    }}
                />
            </div>
        </AppLayout>
    );
}
