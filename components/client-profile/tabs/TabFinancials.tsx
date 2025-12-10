import { useState } from 'react';
import { ClientFormData } from '@/types/client';
import { Calculator, Calendar, CreditCard, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Props {
    client: ClientFormData;
}

// Extended types for this view (mocking a backend structure)
interface Payment {
    id: string;
    date: string;
    amount: number;
    method: 'cash' | 'card' | 'transfer';
    description: string;
    isPaid: boolean;
}

const MOCK_PAYMENTS: Payment[] = [
    { id: '1', date: '2025-12-09', amount: 50, method: 'cash', description: '1η Συνεδρία', isPaid: true },
];

export default function TabFinancials({ client }: Props) {
    // State for package details (initialized from client data)
    const [packageDetails, setPackageDetails] = useState({
        type: client.collaborationType || '',
        price: client.packagePrice || '0',
        hasVat: client.hasVat,
        installments: client.installments || '1',
        startDate: client.startDate || new Date().toISOString().split('T')[0],
        endDate: client.endDate || '',
    });

    const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
    const [isAddingPayment, setIsAddingPayment] = useState(false);
    const [newPayment, setNewPayment] = useState<Partial<Payment>>({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        method: 'cash',
        description: '',
        isPaid: true
    });

    // Calculations
    const priceNum = parseFloat(packageDetails.price) || 0;
    const vatAmount = packageDetails.hasVat ? priceNum * 0.24 : 0;
    const finalPrice = priceNum + vatAmount;

    const totalPaid = payments.filter(p => p.isPaid).reduce((acc, p) => acc + p.amount, 0);
    const remaining = finalPrice - totalPaid;

    const handleAddPayment = () => {
        if (!newPayment.amount || !newPayment.description) return;

        const payment: Payment = {
            id: Math.random().toString(36).substr(2, 9),
            date: newPayment.date || '',
            amount: Number(newPayment.amount),
            method: newPayment.method as any,
            description: newPayment.description || '',
            isPaid: newPayment.isPaid || false
        };

        setPayments([...payments, payment]);
        setIsAddingPayment(false);
        setNewPayment({ date: new Date().toISOString().split('T')[0], amount: 0, method: 'cash', description: '', isPaid: true });
    };

    const deletePayment = (id: string) => {
        if (confirm('Διαγραφή πληρωμής;')) {
            setPayments(payments.filter(p => p.id !== id));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* Section 1: Package Settings */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center border-b pb-2">
                    <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                    Στοιχεία Πακέτου
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Τύπος Συνεργασίας</label>
                        <select
                            value={packageDetails.type}
                            onChange={e => setPackageDetails({ ...packageDetails, type: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        >
                            <option value="">Επιλογή...</option>
                            {['1 μήνας', '3 μήνες', '6 μήνες', '12 μήνες', 'Συνεδρία-συνεδρία'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Τιμή (καθαρή)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={packageDetails.price}
                                onChange={e => setPackageDetails({ ...packageDetails, price: e.target.value })}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border pr-8"
                            />
                            <span className="absolute right-3 top-2 text-gray-400">€</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-6">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={packageDetails.hasVat}
                                onChange={e => setPackageDetails({ ...packageDetails, hasVat: e.target.checked })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">ΦΠΑ 24%</span>
                        </label>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col justify-center">
                        <span className="text-xs text-gray-500 uppercase font-bold">Τελικο Συνολο</span>
                        <span className="text-xl font-bold text-blue-700">{finalPrice.toFixed(2)} €</span>
                    </div>

                    {/* Dates */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Έναρξη</label>
                        <input
                            type="date"
                            value={packageDetails.startDate}
                            onChange={e => setPackageDetails({ ...packageDetails, startDate: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Λήξη</label>
                        <input
                            type="date"
                            value={packageDetails.endDate}
                            onChange={e => setPackageDetails({ ...packageDetails, endDate: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Δόσεις</label>
                        <input
                            type="number"
                            value={packageDetails.installments}
                            onChange={e => setPackageDetails({ ...packageDetails, installments: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border"
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Payments */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b pb-2">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                        Ιστορικό Πληρωμών
                    </h3>
                    <button
                        onClick={() => setIsAddingPayment(true)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Νέα Πληρωμή
                    </button>
                </div>

                {/* Add Payment Form */}
                {isAddingPayment && (
                    <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-100 animate-in slide-in-from-top-2">
                        <h4 className="text-sm font-bold text-green-800 mb-3">Καταχώρηση Πληρωμής</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                            <input type="date" className="p-2 border rounded text-sm" value={newPayment.date} onChange={e => setNewPayment({ ...newPayment, date: e.target.value })} />
                            <input type="number" placeholder="Ποσό" className="p-2 border rounded text-sm" value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: Number(e.target.value) })} />
                            <select className="p-2 border rounded text-sm" value={newPayment.method} onChange={e => setNewPayment({ ...newPayment, method: e.target.value as any })}>
                                <option value="cash">Μετρητά</option>
                                <option value="card">Κάρτα</option>
                                <option value="transfer">Κατάθεση</option>
                            </select>
                            <input type="text" placeholder="Περιγραφή (π.χ. Δόση 1)" className="p-2 border rounded text-sm" value={newPayment.description} onChange={e => setNewPayment({ ...newPayment, description: e.target.value })} />
                            <div className="flex space-x-2">
                                <button onClick={handleAddPayment} className="bg-green-600 text-white px-3 py-2 rounded text-sm flex-1">Προσθήκη</button>
                                <button onClick={() => setIsAddingPayment(false)} className="bg-white text-gray-600 border px-3 py-2 rounded text-sm">Ακύρωση</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ημερομηνια</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Περιγραφη</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Τροπος</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ποσο</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Κατασταση</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Ενέργειες</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map(payment => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{format(new Date(payment.date), 'dd/MM/yyyy')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {payment.method === 'cash' ? 'Μετρητά' : payment.method === 'card' ? 'Κάρτα' : 'Κατάθεση'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{payment.amount} €</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={cn("inline-flex px-2 text-xs font-semibold leading-5 rounded-full", payment.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                                            {payment.isPaid ? 'Πληρωμένο' : 'Εκκρεμεί'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => deletePayment(payment.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 italic">Δεν υπάρχουν καταχωρημένες πληρωμές.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Section 3: Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                    <span className="text-sm font-medium text-gray-500 uppercase mb-1">Συνολικο Κοστος</span>
                    <span className="text-3xl font-bold text-gray-900">{finalPrice.toFixed(2)} €</span>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                    <span className="text-sm font-medium text-green-600 uppercase mb-1">Εισπραχθεντα</span>
                    <span className="text-3xl font-bold text-green-600">{totalPaid.toFixed(2)} €</span>
                </div>
                <div className={cn("p-6 rounded-xl border shadow-sm flex flex-col items-center", remaining > 0 ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100")}>
                    <span className={cn("text-sm font-medium uppercase mb-1", remaining > 0 ? "text-red-600" : "text-green-600")}>Υπολοιπο</span>
                    <span className={cn("text-3xl font-bold", remaining > 0 ? "text-red-600" : "text-green-600")}>{remaining.toFixed(2)} €</span>
                </div>
            </div>

        </div>
    );
}
