import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MealPlan } from '@/lib/storage';
import { ClientFormData } from '@/types/client';
import { Eye, Printer, ShoppingCart, Trash2, Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface TabMealPlansProps {
    client: ClientFormData;
}

export default function TabMealPlans({ client }: TabMealPlansProps) {
    const router = useRouter();
    const params = useParams();
    const clientId = params.id as string;
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/meal-plans?clientId=${clientId}`)
            .then(res => res.json())
            .then(data => {
                setMealPlans(Array.isArray(data) ? data : []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, [clientId]);

    const handleCreateNew = () => {
        router.push(`/clients/${clientId}/meal-plans/new`);
    };

    const handleView = (planId: string) => {
        router.push(`/clients/${clientId}/meal-plans/${planId}`);
    };

    const handleDeleteClick = (planId: string) => {
        setPlanToDelete(planId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!planToDelete) return;
        
        try {
            const res = await fetch(`/api/meal-plans?id=${planToDelete}`, { method: 'DELETE' });
            if (res.ok) {
                setMealPlans(prev => prev.filter(p => p.id !== planToDelete));
            } else {
                alert('Σφάλμα κατά τη διαγραφή.');
            }
        } catch (e) {
            console.error(e);
            alert('Σφάλμα κατά τη διαγραφή.');
        }
    };

    const handlePrint = (planId: string) => {
        window.open(`/clients/${clientId}/meal-plans/${planId}?print=true`, '_blank');
    };

    const handleShop = (planId: string) => {
        router.push(`/clients/${clientId}/meal-plans/${planId}?shop=true`);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">Διαιτολόγια</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Διαχείριση των εβδομαδιαίων προγραμμάτων διατροφής.
                    </p>
                </div>
                <div>
                    <button
                        onClick={handleCreateNew}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Νέο Διαιτολόγιο
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ονομασια / Ημ.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Στοχος</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Γευματα</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Κατασταση</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Ενέργειες</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mealPlans.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Δεν υπάρχουν διαιτολόγια ακόμα.
                                    </td>
                                </tr>
                            )}
                            {mealPlans.map(plan => (
                                <tr key={plan.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{plan.name}</div>
                                        <div className="text-xs text-gray-500">{format(new Date(plan.createdAt), 'dd/MM/yyyy')}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {plan.calories} kcal
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {plan.mealsCount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {plan.status === 'active' ? 'Ενεργό' : 'Αρχείο'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => handleView(plan.id)} className="text-blue-600 hover:text-blue-900" title="Προβολή"><Eye className="w-4 h-4" /></button>
                                            <button onClick={() => handlePrint(plan.id)} className="text-gray-600 hover:text-gray-900" title="Εκτύπωση"><Printer className="w-4 h-4" /></button>
                                            <button onClick={() => handleShop(plan.id)} className="text-orange-600 hover:text-orange-900" title="Λίστα Ψωνιών"><ShoppingCart className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteClick(plan.id)} className="text-red-400 hover:text-red-600" title="Διαγραφή"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Διαγραφή Διαιτολογίου"
                message="Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το διαιτολόγιο; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί."
                confirmText="Διαγραφή"
                isDestructive={true}
            />
        </div>
    );
}
