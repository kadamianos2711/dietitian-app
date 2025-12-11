import { useState } from 'react';
import { ClientFormData } from '@/types/client';
import { cn } from '@/lib/utils';
import { Calculator, Calendar, CreditCard, Plus, Trash2 } from 'lucide-react';
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

    // Local state for packages list, initialized from client data
    const [packages, setPackages] = useState<any[]>(client.packages || []);

    const [isRenewing, setIsRenewing] = useState(false);
    const [newPackage, setNewPackage] = useState({
        type: '3 μήνες',
        startDate: new Date().toISOString().split('T')[0],
        price: '150'
    });

    // Auto-calculate end date for the new package form
    // Logic: End Date is the date of the last session.
    // Formula: Start + ((Sessions - 1) * 7 days)
    const getCalculatedEndDate = (type: string, start: string) => {
        if (!start) return '';
        const date = new Date(start);

        let sessions = 0;
        switch (type) {
            case '1 μήνας': sessions = 4; break;
            case '3 μήνες': sessions = 12; break;
            case '6 μήνες': sessions = 24; break;
            case '12 μήνες': sessions = 48; break;
        }

        if (sessions > 0) {
            date.setDate(date.getDate() + ((sessions - 1) * 7));
            return date.toISOString().split('T')[0];
        }
        return '';
    };

    const handleAddRenewal = () => {
        const endDate = getCalculatedEndDate(newPackage.type, newPackage.startDate);

        let sessions = 0;
        switch (newPackage.type) {
            case '1 μήνας': sessions = 4; break;
            case '3 μήνες': sessions = 12; break;
            case '6 μήνες': sessions = 24; break;
            case '12 μήνες': sessions = 48; break;
        }

        const pkgToAdd = {
            id: Math.random().toString(36).substr(2, 9),
            type: newPackage.type,
            startDate: newPackage.startDate,
            endDate: endDate,
            sessions: sessions,
            price: newPackage.price,
            status: 'future'
        };

        setPackages([...packages, pkgToAdd]);
        setIsRenewing(false);
        setNewPackage({
            type: '3 μήνες',
            startDate: new Date().toISOString().split('T')[0],
            price: '150'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {isRenewing && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 animate-in slide-in-from-top-4 mb-6">
                    <h4 className="font-bold text-blue-800 mb-4">Νέα Ανανέωση / Πακέτο</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 uppercase mb-1">Τύπος</label>
                            <select
                                value={newPackage.type}
                                onChange={e => setNewPackage({ ...newPackage, type: e.target.value })}
                                className="w-full rounded-md border-blue-300 p-2 text-sm"
                            >
                                <option value="1 μήνας">1 μήνας (4 εβδ.)</option>
                                <option value="3 μήνες">3 μήνες (12 εβδ.)</option>
                                <option value="6 μήνες">6 μήνες (24 εβδ.)</option>
                                <option value="12 μήνες">12 μήνες (48 εβδ.)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 uppercase mb-1">Έναρξη</label>
                            <input
                                type="date"
                                value={newPackage.startDate}
                                onChange={e => setNewPackage({ ...newPackage, startDate: e.target.value })}
                                className="w-full rounded-md border-blue-300 p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 uppercase mb-1">Τιμή</label>
                            <input
                                type="number"
                                value={newPackage.price}
                                onChange={e => setNewPackage({ ...newPackage, price: e.target.value })}
                                className="w-full rounded-md border-blue-300 p-2 text-sm"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={handleAddRenewal} className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm font-medium">Αποθήκευση</button>
                            <button onClick={() => setIsRenewing(false)} className="px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 text-sm font-medium">Ακύρωση</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Section 1: Packages History */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b pb-2">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                        Πακέτα & Συνεργασίες
                    </h3>
                    <button
                        onClick={() => setIsRenewing(true)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Ανανέωση
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Header */}
                    <div className="grid grid-cols-5 gap-4 text-xs font-semibold text-gray-500 uppercase pb-2 border-b">
                        <div className="col-span-1">Τύπος</div>
                        <div className="col-span-1">Έναρξη</div>
                        <div className="col-span-1">Λήξη</div>
                        <div className="col-span-1">Συνεδρίες</div>
                        <div className="col-span-1 text-right">Τιμή</div>
                    </div>

                    {/* Rows - Mocking standard active package from legacy data + new packages array */}
                    {/* In a real app we'd map client.packages. For now we show the 'current' one as a row and allow adding more visualy */}
                    <div className="grid grid-cols-5 gap-4 py-3 items-center border-b last:border-0 hover:bg-gray-50 transition-colors">
                        <div className="col-span-1 font-medium text-gray-900">{packageDetails.type || '-'}</div>
                        <div className="col-span-1 text-sm text-gray-600">{packageDetails.startDate}</div>
                        <div className="col-span-1 text-sm text-gray-600">{packageDetails.endDate || '-'}</div>
                        <div className="col-span-1 text-sm text-gray-600">
                            {/* Auto-calc sessions for display */}
                            {packageDetails.type === '1 μήνας' ? '4' :
                                packageDetails.type === '3 μήνες' ? '12' :
                                    packageDetails.type === '6 μήνες' ? '24' :
                                        packageDetails.type === '12 μήνες' ? '48' : '-'}
                        </div>
                        <div className="col-span-1 text-right font-bold text-blue-600">{packageDetails.price} €</div>
                    </div>

                    {/* Future: Map through client.packages here */}
                    {packages.map((pkg, idx) => (
                        <div key={idx} className="grid grid-cols-5 gap-4 py-3 items-center border-b last:border-0 hover:bg-gray-50 transition-colors">
                            <div className="col-span-1 font-medium text-gray-900">{pkg.type}</div>
                            <div className="col-span-1 text-sm text-gray-600">{pkg.startDate}</div>
                            <div className="col-span-1 text-sm text-gray-600">{pkg.endDate}</div>
                            <div className="col-span-1 text-sm text-gray-600">{pkg.sessions}</div>
                            <div className="col-span-1 text-right font-bold text-blue-600">{pkg.price} €</div>
                        </div>
                    ))}
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

            {/* Installments Table */}
            {(client.paymentPlan || []).length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-900">Πλάνο Δόσεων</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Δόση</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ποσό</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ημ. Πληρωμής</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Υπενθύμιση</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Κατάσταση</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {client.paymentPlan.map((inst, idx) => (
                                    <tr key={idx} className={inst.isPaid ? 'bg-green-50' : 'hover:bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {inst.number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {inst.amount} €
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {inst.date || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {inst.reminderDate ? (
                                                <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", inst.isPaid ? "text-gray-400 bg-gray-100" : "bg-orange-100 text-orange-800")}>
                                                    {inst.reminderDate}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={inst.isPaid}
                                                    readOnly // Read-only for now as we don't have update logic in this view component yet
                                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                />
                                                <span className={cn("font-medium", inst.isPaid ? "text-green-700" : "text-gray-500")}>
                                                    {inst.isPaid ? 'Εξοφλήθηκε' : 'Εκκρεμεί'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
