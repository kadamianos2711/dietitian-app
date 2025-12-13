import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ClientFormData } from '@/types/client';
interface Props {
    data: ClientFormData;
    update: (data: Partial<ClientFormData>) => void;
}

const COLLABORATION_TYPES = [
    'Πρώτη συνεδρία', '1 μήνας', '3 μήνες', '6 μήνες', '12 μήνες', 'Συνεδρία-συνεδρία', 'Custom'
];

export default function Step8_Financial({ data, update }: Props) {

    // Auto-calculate end date when startDate or type changes
    // Auto-calculate end date when startDate or type changes
    useEffect(() => {
        if (!data.startDate || !data.collaborationType) return;

        // If 'First Session', endDate is same as startDate (conceptually) or empty if we don't track it yet
        if (data.collaborationType === 'Πρώτη συνεδρία') {
            update({ endDate: data.startDate }); // Or leave empty
            return;
        }

        const start = new Date(data.startDate);
        let end = new Date(start);

        // Logic change per user request:
        // End Date means the date of the LAST session.
        // If 1 month = 4 sessions (weekly), the duration spans 3 weeks from start.
        // Formula: Start + ((Sessions - 1) * 7) days.

        const addWeeks = (date: Date, weeks: number) => {
            date.setDate(date.getDate() + (weeks * 7));
            return date;
        };

        const sessionsMap: Record<string, number> = {
            '1 μήνας': 4,
            '3 μήνες': 12,
            '6 μήνες': 24,
            '12 μήνες': 48
        };

        const sessions = sessionsMap[data.collaborationType] || 0;

        if (sessions > 0) {
            // We add (sessions - 1) weeks to get the date of the last session
            // e.g. 4 sessions: Start (1), +1wk(2), +1wk(3), +1wk(4). Total +3 weeks.
            end.setDate(start.getDate() + ((sessions - 1) * 7));
        } else {
            return;
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

    // Sync Payment Plan with Installments
    useEffect(() => {
        const count = parseInt(data.installments);
        if (isNaN(count) || count < 2) {
            if ((data.paymentPlan || []).length > 0) {
                update({ paymentPlan: [] });
            }
            return;
        }

        // If count changes, adjust array
        if ((data.paymentPlan || []).length !== count) {
            const currentPlan = [...(data.paymentPlan || [])];

            // If growing
            if (count > currentPlan.length) {
                const remainingPrice = parseFloat(data.finalPrice || '0') - (parseFloat(data.initialPayment.amount) || 0);
                const amountPerInstallment = count > 0 ? (remainingPrice / count).toFixed(2) : '0';

                for (let i = currentPlan.length; i < count; i++) {
                    currentPlan.push({
                        number: i + 1,
                        amount: amountPerInstallment,
                        date: '',
                        reminderDate: '',
                        isPaid: false
                    });
                }
            }
            // If shrinking
            else {
                currentPlan.length = count;
            }

            update({ paymentPlan: currentPlan });
        }
    }, [data.installments, data.finalPrice, data.initialPayment.amount]);

    const updateInstallment = (index: number, field: keyof typeof data.paymentPlan[0], value: any) => {
        const newPlan = [...(data.paymentPlan || [])];
        if (!newPlan[index]) return; // Guard
        newPlan[index] = { ...newPlan[index], [field]: value };
        update({ paymentPlan: newPlan });
    };

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
                    {data.collaborationType !== 'Πρώτη συνεδρία' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ημερομηνία Λήξης</label>
                            <input
                                type="date"
                                value={data.endDate}
                                onChange={(e) => update({ endDate: e.target.value })}
                                readOnly // Auto-calculated mostly
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border bg-gray-50"
                            />
                        </div>
                    )}
                </div>

                {/* Pricing - Hidden for First Session? Or maybe they pay for it? Usually they pay per session. Let's keep pricing but simplify */}
                {data.collaborationType !== 'Πρώτη συνεδρία' ? (
                    <div className="border-t border-gray-100 md:col-span-2 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Τιμή Πακέτου (καθαρή)</label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <input
                                    type="number"
                                    step="0.01"
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
                ) : (
                    <div className="md:col-span-2 border-t pt-4">
                        <p className="text-sm text-gray-500 italic">Για την "Πρώτη συνεδρία", η χρέωση γίνεται συνήθως μεμονωμένα (π.χ. 50€). Μπορείτε να την καταχωρήσετε στην Επόμενη ενότητα (Προκαταβολή/Πληρωμή).</p>
                    </div>
                )}

                {/* Payment & Installments */}
                <div className="border-t border-gray-100 md:col-span-2 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Αριθμός Δόσεων</label>
                        <input
                            type="number"
                            min="1"
                            value={data.installments}
                            onChange={(e) => update({ installments: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Πρώτη Πληρωμή / Προκαταβολή</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <input
                                    type="number"
                                    step="0.01"
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

                        {/* Dynamic Installments */}
                        {(data.paymentPlan || []).length > 0 && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                                <h4 className="font-medium text-gray-900">Πλάνο Δόσεων</h4>
                                {(data.paymentPlan || []).map((inst, idx) => (
                                    <div key={idx} className={cn(
                                        "grid grid-cols-1 md:grid-cols-9 gap-4 items-center border p-3 rounded-lg shadow-sm transition-colors",
                                        inst.isPaid ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                                    )}>
                                        <div className="md:col-span-1 font-medium text-gray-500 text-sm">
                                            Δόση {inst.number}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs text-gray-400 mb-1">Ποσό (€)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={inst.amount}
                                                onChange={(e) => updateInstallment(idx, 'amount', e.target.value)}
                                                disabled={inst.isPaid}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-1 border disabled:bg-gray-100 disabled:text-gray-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs text-gray-400 mb-1">Ημ. Πληρωμής</label>
                                            <input
                                                type="date"
                                                value={inst.date}
                                                onChange={(e) => updateInstallment(idx, 'date', e.target.value)}
                                                disabled={inst.isPaid}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-1 border disabled:bg-gray-100 disabled:text-gray-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={cn("block text-xs mb-1 transition-colors", inst.isPaid ? "text-gray-300" : "text-orange-400")}>
                                                Υπενθύμιση
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={inst.reminderDate}
                                                    onChange={(e) => updateInstallment(idx, 'reminderDate', e.target.value)}
                                                    disabled={inst.isPaid}
                                                    className={cn(
                                                        "w-full rounded-md shadow-sm sm:text-sm p-1 border transition-colors",
                                                        inst.isPaid
                                                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                                            : "border-orange-200 focus:border-orange-500 focus:ring-orange-500 bg-orange-50"
                                                    )}
                                                />
                                                {inst.isPaid && <div className="absolute inset-x-0 top-1/2 border-t border-gray-400" />}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 flex items-end justify-center pb-1">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={inst.isPaid}
                                                    onChange={(e) => updateInstallment(idx, 'isPaid', e.target.checked)}
                                                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                />
                                                <span className={cn("text-sm font-medium", inst.isPaid ? "text-green-700" : "text-gray-600")}>
                                                    {inst.isPaid ? 'Εξοφλήθηκε' : 'Εξόφληση;'}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
