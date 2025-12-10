import { ClientFormData } from '@/types/client';

interface Props {
    data: ClientFormData;
    update: (data: Partial<ClientFormData>) => void;
}

export default function Step3_Habits({ data, update }: Props) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Wake up / Sleep */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ώρα αφύπνισης</label>
                    <input
                        type="time"
                        value={data.wakeUpTime}
                        onChange={(e) => update({ wakeUpTime: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ώρα ύπνου</label>
                    <input
                        type="time"
                        value={data.bedTime}
                        onChange={(e) => update({ bedTime: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                    />
                </div>

                {/* Work */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Ωράριο εργασίας</label>
                    <input
                        type="text"
                        placeholder="π.χ. 9:00 - 17:00"
                        value={data.workSchedule}
                        onChange={(e) => update({ workSchedule: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                    />
                </div>

                {/* Shift Work */}
                <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 w-full">Δουλεύετε σε βάρδιες;</span>
                    <div className="flex space-x-4">
                        <label className="flex items-center">
                            <input type="radio" checked={data.shiftWork} onChange={() => update({ shiftWork: true })} className="mr-2 text-green-600 focus:ring-green-500" />
                            Ναι
                        </label>
                        <label className="flex items-center">
                            <input type="radio" checked={!data.shiftWork} onChange={() => update({ shiftWork: false })} className="mr-2 text-green-600 focus:ring-green-500" />
                            Όχι
                        </label>
                    </div>
                </div>

                {/* Meals Per Day */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Γεύματα την ημέρα</label>
                    <select
                        value={data.mealsPerDay}
                        onChange={(e) => update({ mealsPerDay: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                    >
                        {[2, 3, 4, 5, 6, 7].map(num => (
                            <option key={num} value={num}>{num} γεύματα</option>
                        ))}
                    </select>
                </div>

                {/* Booleans Grid */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    {/* Skip Breakfast */}
                    <label className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <span className="text-sm font-medium text-gray-700">Παραλείπετε συχνά το πρωινό;</span>
                        <input
                            type="checkbox"
                            checked={data.skipBreakfast}
                            onChange={(e) => update({ skipBreakfast: e.target.checked })}
                            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                    </label>

                    {/* Late Dinner */}
                    <label className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <span className="text-sm font-medium text-gray-700">Τρώτε συχνά αργά το βράδυ;</span>
                        <input
                            type="checkbox"
                            checked={data.lateNightEating}
                            onChange={(e) => update({ lateNightEating: e.target.checked })}
                            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                    </label>

                    {/* Eating Out */}
                    <label className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <span className="text-sm font-medium text-gray-700">Τρώτε συχνά εκτός σπιτιού;</span>
                        <input
                            type="checkbox"
                            checked={data.eatingOut}
                            onChange={(e) => update({ eatingOut: e.target.checked })}
                            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                    </label>

                    {/* Delivery */}
                    <label className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <span className="text-sm font-medium text-gray-700">Παραγγέλνετε συχνά delivery;</span>
                        <input
                            type="checkbox"
                            checked={data.delivery}
                            onChange={(e) => update({ delivery: e.target.checked })}
                            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                    </label>
                </div>

                {/* Coffee / Alcohol / Smoking */}
                <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={data.coffee}
                                onChange={(e) => update({ coffee: e.target.checked })}
                                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Πίνετε καφέ;</span>
                        </label>
                        {data.coffee && (
                            <input
                                type="number"
                                placeholder="καφέδες/μέρα"
                                value={data.coffeeCups}
                                onChange={(e) => update({ coffeeCups: e.target.value })}
                                className="w-32 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-1 border"
                            />
                        )}
                    </div>

                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={data.alcohol}
                            onChange={(e) => update({ alcohol: e.target.checked })}
                            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Πίνετε αλκοόλ;</span>
                    </label>

                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={data.smoking}
                            onChange={(e) => update({ smoking: e.target.checked })}
                            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Καπνίζετε;</span>
                    </label>
                </div>

            </div>
        </div>
    );
}
