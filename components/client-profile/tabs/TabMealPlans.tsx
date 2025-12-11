import { ClientFormData } from '@/types/client';
import { FileText, Plus, ShoppingCart, Eye, Printer, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter, useParams } from 'next/navigation';

interface Props {
    client: ClientFormData;
}

// Mock type for meal plans
interface MealPlan {
    id: string;
    createdAt: string;
    calories: number;
    mealsCount: number;
    status: 'active' | 'archived';
    name: string;
}

const MOCK_PLANS: MealPlan[] = [
    { id: '1', name: 'Εβδομαδιαίο Πρόγραμμα 1', createdAt: '2025-12-09', calories: 1800, mealsCount: 5, status: 'active' },
    { id: '2', name: 'Πρόγραμμα Προσαρμογής', createdAt: '2025-11-25', calories: 2000, mealsCount: 4, status: 'archived' },
];

export default function TabMealPlans({ client }: Props) {
    const router = useRouter();
    const params = useParams();
    const clientId = params.id as string;

    const handleCreateNew = () => {
        router.push(`/clients/${clientId}/meal-plans/new`);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-green-600" />
                        Διαιτολόγια
                    </h3>
                    <button
                        onClick={handleCreateNew}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Νέο Διαιτολόγιο
                    </button>
                </div>

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
                            {MOCK_PLANS.map(plan => (
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
                                            <button className="text-blue-600 hover:text-blue-900" title="Προβολή"><Eye className="w-4 h-4" /></button>
                                            <button className="text-gray-600 hover:text-gray-900" title="Εκτύπωση"><Printer className="w-4 h-4" /></button>
                                            <button className="text-orange-600 hover:text-orange-900" title="Λίστα Ψωνιών"><ShoppingCart className="w-4 h-4" /></button>
                                            <button className="text-red-400 hover:text-red-600" title="Διαγραφή"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
