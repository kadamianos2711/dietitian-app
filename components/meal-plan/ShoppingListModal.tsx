import { X, Printer, FileDown } from 'lucide-react';
import { WeeklyPlan } from '@/types/engine';
import { useMemo } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    plan: WeeklyPlan | null;
}

export default function ShoppingListModal({ isOpen, onClose, plan }: Props) {
    if (!isOpen) return null;

    const shoppingList = useMemo(() => {
        if (!plan) return [];

        const totals: Record<string, { amount: number; unit: string }> = {};

        // Iterate all days
        plan.days.forEach(day => {
            // Iterate all meals
            Object.values(day.meals).forEach(meal => {
                // Iterate all ingredients
                meal.ingredients.forEach(ing => {
                    const key = `${ing.name.toLowerCase()}_${ing.unit || ''}`;
                    if (!totals[key]) {
                        totals[key] = { amount: 0, unit: ing.unit || '' };
                    }
                    totals[key].amount += ing.amount;
                });
            });
        });

        return Object.entries(totals)
            .map(([key, data]) => {
                // Recover display name from key or we could store it better. 
                // Let's actually store name in the value to be safe.
                return {
                    name: key.split('_')[0], // simplistic, better to store name
                    amount: data.amount,
                    unit: data.unit
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [plan]);

    // Better aggregation logic
    const aggregatedList = useMemo(() => {
        if (!plan) return [];
        const map = new Map<string, { name: string, amount: number, unit: string }>();

        plan.days.forEach(day => {
             Object.values(day.meals).forEach(meal => {
                 meal.ingredients.forEach(ing => {
                     const key = `${ing.name}-${ing.unit || ''}`;
                     if (!map.has(key)) {
                         map.set(key, { name: ing.name, amount: 0, unit: ing.unit || '' });
                     }
                     const current = map.get(key)!;
                     current.amount += ing.amount;
                 });
             });
        });

        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [plan]);

    const handlePrint = () => {
        // Open a new window for clean printing of just the list
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Λίστα Ψωνιών</title>
                    <style>
                        body { font-family: system-ui, sans-serif; padding: 2rem; }
                        h1 { border-bottom: 2px solid #ddd; padding-bottom: 0.5rem; }
                        ul { list-style: none; padding: 0; }
                        li { padding: 0.5rem 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
                        .amount { font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h1>Λίστα Ψωνιών</h1>
                    <ul>
                        ${aggregatedList.map(item => `
                            <li>
                                <span>${item.name}</span>
                                <span class="amount">${Math.round(item.amount)} ${item.unit}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <script>window.print();</script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 print:hidden">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Λίστα Ψωνιών Εβδομάδας</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {aggregatedList.length === 0 ? (
                        <p className="text-gray-500 text-center">Δεν υπάρχουν υλικά στο διαιτολόγιο.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {aggregatedList.map((item, idx) => (
                                <li key={idx} className="py-3 flex justify-between items-center text-sm">
                                    <span className="text-gray-900 font-medium">{item.name}</span>
                                    <span className="text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                        {Math.round(item.amount)} {item.unit}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Εκτύπωση Λίστας
                    </button>
                </div>
            </div>
        </div>
    );
}
