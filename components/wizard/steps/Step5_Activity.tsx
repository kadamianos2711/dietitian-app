import { ClientFormData } from '@/types/client';

interface Props {
    data: ClientFormData;
    update: (data: Partial<ClientFormData>) => void;
}

export default function Step5_Activity({ data, update }: Props) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* Exercise Boolean */}
            <div>
                <span className="block text-sm font-medium text-gray-700 mb-3">Γυμνάζεστε;</span>
                <div className="flex space-x-6">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full sm:w-auto">
                        <input
                            type="radio"
                            name="exercises"
                            checked={data.exercises}
                            onChange={() => update({ exercises: true })}
                            className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                        <span className="font-medium text-gray-900">Ναι</span>
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full sm:w-auto">
                        <input
                            type="radio"
                            name="exercises"
                            checked={!data.exercises}
                            onChange={() => update({ exercises: false })}
                            className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                        <span className="font-medium text-gray-900">Όχι</span>
                    </label>
                </div>
            </div>

            {/* Exercise Details (Conditional) */}
            {data.exercises && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Είδος άσκησης</label>
                        <input
                            type="text"
                            placeholder="π.χ. Τρέξιμο, Γυμναστήριο, Crossfit"
                            value={data.exerciseType}
                            onChange={(e) => update({ exerciseType: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Συχνότητα (φορές / εβδομάδα)</label>
                        <input
                            type="number"
                            value={data.exerciseFrequency}
                            onChange={(e) => update({ exerciseFrequency: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>
            )}

            {/* Sleep */}
            <div className="border-t border-gray-100 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Πόσες ώρες περίπου κοιμάστε; (Μ.Ο.)
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        value={data.sleepHours}
                        onChange={(e) => update({ sleepHours: e.target.value })}
                        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                    />
                    <span className="text-gray-500">ώρες / βράδυ</span>
                </div>
            </div>

        </div>
    );
}
