import { ClientFormData } from '@/types/client';
import { useRouter } from 'next/navigation';
import { Clock, Briefcase, Utensils, Moon, Coffee, Cigarette, Wine, ShoppingBag, Truck, Edit } from 'lucide-react';

interface Props {
    client: ClientFormData;
}

export default function TabHabits({ client }: Props) {
    const router = useRouter();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

            <div className="flex justify-end pb-2">
                <button
                    onClick={() => window.location.href = `/clients/new?editId=${client.id}&step=3`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                    <Edit className="w-4 h-4 mr-1" />
                    Επεξεργασία
                </button>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                        Ωράριο & Ύπνος
                    </h3>
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                            <span className="text-gray-500">Έγερση</span>
                            <span className="font-semibold text-gray-900">{client.wakeUpTime || '-'}</span>
                        </li>
                        <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                            <span className="text-gray-500">Ύπνος</span>
                            <span className="font-semibold text-gray-900">{client.bedTime || '-'}</span>
                        </li>
                        <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                            <span className="text-gray-500">Ώρες Ύπνου</span>
                            <span className="font-semibold text-gray-900">{client.sleepHours || '-'}</span>
                        </li>
                        <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                            <span className="text-gray-500">Ωράριο Εργασίας</span>
                            <span className="font-semibold text-gray-900 text-right">{client.workSchedule || '-'}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-gray-500">Βάρδιες</span>
                            <span className={`font-semibold ${client.shiftWork ? 'text-orange-600' : 'text-gray-900'}`}>{client.shiftWork ? 'Ναι' : 'Όχι'}</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Utensils className="w-5 h-5 mr-2 text-green-600" />
                        Διατροφικές Συνήθειες
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Γεύματα / ημέρα</span>
                            <span className="text-xl font-bold text-green-600">{client.mealsPerDay}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center ${client.skipBreakfast ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                                <span className="text-xs text-gray-500 uppercase font-bold mb-1">Πρωινο</span>
                                {client.skipBreakfast ? <span className="text-red-600 font-bold text-sm">Παραλειψη</span> : <span className="text-green-600 font-bold text-sm">Τρωει</span>}
                            </div>
                            <div className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center ${client.lateNightEating ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                                <span className="text-xs text-gray-500 uppercase font-bold mb-1">Βραδινο</span>
                                {client.lateNightEating ? <span className="text-red-600 font-bold text-sm">Τρωει αργα</span> : <span className="text-green-600 font-bold text-sm">ΟΚ</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center ${client.eatingOut ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
                                <ShoppingBag className="w-4 h-4 mb-1 text-gray-400" />
                                <span className="text-xs font-bold text-gray-700">Φαγητό έξω</span>
                                <span className="text-sm">{client.eatingOut ? 'Συχνά' : 'Σπάνια'}</span>
                            </div>
                            <div className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center ${client.delivery ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
                                <Truck className="w-4 h-4 mb-1 text-gray-400" />
                                <span className="text-xs font-bold text-gray-700">Delivery</span>
                                <span className="text-sm">{client.delivery ? 'Συχνά' : 'Σπάνια'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lifestyle */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${client.coffee ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
                        <Coffee className="w-6 h-6" />
                    </div>
                    <div>
                        <dt className="text-sm text-gray-500 font-medium">Καφές</dt>
                        <dd className="text-lg font-bold text-gray-900">{client.coffee ? `${client.coffeeCups} / μέρα` : 'Όχι'}</dd>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${client.alcohol ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-500'}`}>
                        <Wine className="w-6 h-6" />
                    </div>
                    <div>
                        <dt className="text-sm text-gray-500 font-medium">Αλκοόλ</dt>
                        <dd className="text-lg font-bold text-gray-900">{client.alcohol ? 'Ναι' : 'Όχι'}</dd>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${client.smoking ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Cigarette className="w-6 h-6" />
                    </div>
                    <div>
                        <dt className="text-sm text-gray-500 font-medium">Κάπνισμα</dt>
                        <dd className="text-lg font-bold text-gray-900">{client.smoking ? 'Ναι' : 'Όχι'}</dd>
                    </div>
                </div>
            </div>

        </div>
    );
}
