'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
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
import { MealPlan } from '@/lib/storage';

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

export default function EditMealPlanPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams(); // Add this
    const mealPlanId = params.mealPlanId as string;
    const clientId = params.id as string;

    // We start at Step 2 directly
    const [step, setStep] = useState(2);

    // Step 1 State (Populated from Plan)
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [calories, setCalories] = useState('1800');
    const [mealsCount, setMealsCount] = useState('5');
    const [planName, setPlanName] = useState('');

    // Step 2 State
    const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);

    // UI State
    const [showShoppingList, setShowShoppingList] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<{ dayIndex: number, slotId: string, meal: DietMeal } | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Context State
    const [dailyContexts, setDailyContexts] = useState<DailyContext[]>([]);
    const [editingDay, setEditingDay] = useState<number | null>(null);

    // Client Data State
    const [clientData, setClientData] = useState<typeof initialClientState>(initialClientState);

    // Fetch Client Data and Meal Plan
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Client
                const clientRes = await fetch(`/api/clients?id=${clientId}`);
                const clientD = await clientRes.json();
                if (clientD && !clientD.error) {
                    setClientData(prev => ({ ...prev, ...clientD, foodPreferences: clientD.foodPreferences || {} }));
                }

                // Fetch Meal Plan
                const planRes = await fetch(`/api/meal-plans?id=${mealPlanId}`);
                if (!planRes.ok) throw new Error('Meal plan not found');
                
                const planData: MealPlan = await planRes.json();
                
                // Hydrate State
                setWeeklyPlan(planData);
                if (planData.settings) {
                    setStartDate(planData.settings.startDate);
                    setCalories(planData.settings.calories.toString());
                    setMealsCount(planData.settings.mealsCount.toString());
                    setDailyContexts(planData.settings.dailyContexts || []);
                }
                setPlanName(planData.name);
                
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load data", error);
                alert('Δεν βρέθηκε το διαιτολόγιο');
                router.push(`/clients/${clientId}?tab=mealplans`);
            }
        };

        if (clientId && mealPlanId) {
            fetchData();
        }
    }, [clientId, mealPlanId, router]);

    // Handle Query Params for Print and Shop
    const hasPrinted = useRef(false);

    useEffect(() => {
        if (!isLoading && weeklyPlan) {
            const print = searchParams.get('print');
            const shop = searchParams.get('shop');

            if (print === 'true' && !hasPrinted.current) {
                hasPrinted.current = true;
                // Small delay to ensure render
                setTimeout(() => {
                    window.print();
                    // Optional: Close window after print if it was opened just for this? 
                    // Better to let user control it.
                }, 800);
            }
            
            if (shop === 'true') {
                 // No need to clear param if opening in new tab/modal usually, but okay to keep consistent
                // const newParams = new URLSearchParams(searchParams.toString());
                // newParams.delete('shop');
                // router.replace(`${window.location.pathname}?${newParams.toString()}`);
                
                setShowShoppingList(true);
            }
        }
    }, [isLoading, weeklyPlan, searchParams]);

    // Helper to get Meal from day
    const getMealForSlot = (dayIndex: number, slotId: string): DietMeal | undefined => {
        return weeklyPlan?.days[dayIndex]?.meals[slotId];
    };

    const handleAutoGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
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
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: mealPlanId,
                    updates: {
                        ...weeklyPlan,
                        name: planName || weeklyPlan.name, // Keep existing name or update if we exposed name editing
                        // Just merge weeklyPlan properties (days, settings)
                    }
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to update plan');
            }

            alert('Το διαιτολόγιο ενημερώθηκε επιτυχώς!');
            // router.push(`/clients/${clientId}?tab=mealplans`); // Keep user on page
        } catch (error: any) {
            console.error(error);
            alert(`Σφάλμα κατά την αποθήκευση: ${error.message}`);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
             <AppLayout>
                <div className="flex items-center justify-center min-h-[600px]">
                    <div className="text-gray-500">Φόρτωση...</div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
                {/* Header - Hidden on Print */}
                <div className="flex items-center justify-between mb-8 print:hidden">
                    <div>
                        <button
                            onClick={() => router.push(`/clients/${clientId}?tab=mealplans`)}
                            className="text-gray-500 hover:text-gray-700 flex items-center mb-2"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Πίσω στα διαιτολόγια
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Επεξεργασία: {planName}</h1>
                        <p className="text-sm text-gray-500 mt-1">Για τον πελάτη: <span className="font-medium text-gray-900">{clientData.firstName} {clientData.lastName}</span></p>
                    </div>
                    <div className="flex space-x-3">
                         <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Αποθήκευση αλλαγών
                        </button>
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
                                            Επανάληψη αυτόματης δημιουργίας
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
                                        
                                        // Determine calorie color
                                        let calColor = "text-gray-500";
                                        
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
                                                            <button 
                                                                onClick={() => {
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
                                                            
                                                            <button 
                                                                onClick={() => setEditingDay(dayNumber)}
                                                                className="mt-2 text-xs flex items-center text-gray-500 hover:text-blue-600"
                                                            >
                                                                <Settings className="w-3 h-3 mr-1" />
                                                                {(() => {
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
                    plan={weeklyPlan}
                />

                <RecipeModal
                    isOpen={!!selectedMeal}
                    meal={selectedMeal?.meal || null}
                    client={clientData}
                    onUpdateClient={setClientData}
                    onClose={() => setSelectedMeal(null)}
                    onUpdateMeal={(newMeal) => {
                        if (selectedMeal && weeklyPlan) {
                            const newPlan = { ...weeklyPlan };
                            const day = newPlan.days[selectedMeal.dayIndex];
                            if (day) {
                                day.meals[selectedMeal.slotId] = newMeal;
                            }
                            setWeeklyPlan(newPlan);
                            setSelectedMeal({ ...selectedMeal, meal: newMeal });
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
                    }}
                />
            </div>
        </AppLayout>
    );
}
