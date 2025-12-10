import { ClientFormData } from '@/types/client';
import { useEffect } from 'react';

interface Props {
    data: ClientFormData;
    update: (data: Partial<ClientFormData>) => void;
}

const COLLABORATION_TYPES = [
    'Πρώτη συνεδρία', '1 μήνας', '3 μήνες', '6 μήνες', '12 μήνες', 'Συνεδρία-συνεδρία', 'Custom'
];

export default function Step8_Financial({ data, update }: Props) {

    // Auto-calculate end date when startDate or type changes
    useEffect(() => {
        if (!data.startDate || !data.collaborationType) return;

        const start = new Date(data.startDate);
        let end = new Date(start);

        switch (data.collaborationType) {
            case '1 μήνας': end.setMonth(start.getMonth() + 1); break;
            case '3 μήνες': end.setMonth(start.getMonth() + 3); break;
            case '6 μήνες': end.setMonth(start.getMonth() + 6); break;
            case '12 μήνες': end.setMonth(start.getMonth() + 12); break;
            default: return; // Do not auto-set for others
        }

        update({ endDate: end.toISOString().split('T')[0] });
    }, [data.startDate, data.collaborationType]);

    // Auto-calculate VAT
    useEffect(() => {
        if (data.hasVat && data.packagePrice) {
            const price = parseFloat(data.packagePrice);
            if (!isNaN(price)) {
                const withVat = price * 1.24; // 24% VAT in Greece
                update({ finalPrice: withVat.toFixed(2) });
            }
        } else if (!data.hasVat && data.packagePrice) {
            update({ finalPrice: data.packagePrice });
        }
    }, [data.packagePrice, data.hasVat]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 text-sm">
                Αυτό το βήμα είναι ορατό <strong>μόνο σε εσάς</strong> (Διαιτολόγος). Ο πελάτης δεν βλέπει αυτή την οθόνη.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

                {/* Type & Dates */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Τύπος Συνεργασίας</label>
                        <select
                            value={data.collaborationType}
                            onChange={(e) => update({ collaborationType: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                        >
                            <option value="">Επιλογή...</option>
                            {COLLABORATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ημερομηνία Έναρξης</label>
                        <input
                            type="date"
                            value={data.startDate}
                            onChange={(e) => update({ startDate: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ημερομηνία Λήξης</label>
                        <input
                            type="date"
                            value={data.endDate}
                            onChange={(e) => update({ endDate: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>

                {/* Pricing */}
                <div className="border-t border-gray-100 md:col-span-2 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Τιμή Πακέτου (καθαρή)</label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <input
                                type="number"
                                value={data.packagePrice}
                                onChange={(e) => update({ packagePrice: e.target.value })}
                                className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                                placeholder="0.00"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-gray-500 sm:text-sm">€</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 pt-6">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={data.hasVat}
                                onChange={(e) => update({ hasVat: e.target.checked })}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Εφαρμογή ΦΠΑ (24%)</span>
                        </label>
                    </div>

                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                        <span className="font-bold text-gray-700">Τελικό Ποσό:</span>
                        <span className="text-2xl font-bold text-green-700">{data.finalPrice || '0.00'} €</span>
                    </div>
                </div>

                {/* Payment & Installments */}
                <div className="border-t border-gray-100 md:col-span-2 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Αριθμός Δόσεων</label>
                        <input
                            type="number"
                            value={data.installments}
                            onChange={(e) => update({ installments: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-2">Πρώτη Πληρωμή / Προκαταβολή</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <input
                                type="number"
                                placeholder="Ποσό (€)"
                                value={data.initialPayment.amount}
                                onChange={(e) => update({ initialPayment: { ...data.initialPayment, amount: e.target.value } })}
                                className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                            />
                            <input
                                type="date"
                                value={data.initialPayment.date}
                                onChange={(e) => update({ initialPayment: { ...data.initialPayment, date: e.target.value } })}
                                className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                            />
                            <select
                                value={data.initialPayment.method}
                                onChange={(e) => update({ initialPayment: { ...data.initialPayment, method: e.target.value } })}
                                className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                            >
                                <option value="">Τρόπος...</option>
                                <option value="cash">Μετρητά</option>
                                <option value="card">Κάρτα</option>
                                <option value="transfer">Κατάθεση</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
