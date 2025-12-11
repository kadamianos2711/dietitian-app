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
                <div className="md:col-span-2 space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Ωράριο εργασίας</label>
                    <select
                        value={data.workSchedule}
                        onChange={(e) => update({
                            workSchedule: e.target.value,
                            // Reset related fields when changing type
                            workHoursFrom: '',
                            workHoursTo: '',
                            shiftRotation: ''
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                    >
                        <option value="">Επιλογή...</option>
                        <option value="standard">Πρωινό (Σταθερό)</option>
                        <option value="part_time_fixed">Μειωμένο / Part-time (Σταθερό)</option>
                        <option value="night">Νυχτερινό</option>
                        <option value="shifts">Βάρδιες</option>
                        <option value="part_time_shifts">Μειωμένο με βάρδιες</option>
                        <option value="freelance">Ελεύθερο / Ακατάστατο</option>
                        <option value="other">Άλλο</option>
                    </select>

                    {/* Conditional Logic for Fixed Hours */}
                    {['standard', 'part_time_fixed', 'night'].includes(data.workSchedule) && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Από</label>
                                <input
                                    type="time"
                                    value={data.workHoursFrom}
                                    onChange={(e) => update({ workHoursFrom: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Έως</label>
                                <input
                                    type="time"
                                    value={data.workHoursTo}
                                    onChange={(e) => update({ workHoursTo: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                                />
                            </div>
                        </div>
                    )}

                    {/* Conditional Logic for Shifts */}
                    {['shifts', 'part_time_shifts'].includes(data.workSchedule) && (
                        <div className="p-4 bg-gray-50 rounded-lg animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Τύπος Βάρδιας</label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="shiftRotation"
                                        checked={data.shiftRotation === '2_shifts'}
                                        onChange={() => update({ shiftRotation: '2_shifts' })}
                                        className="mr-2 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">2 Βάρδιες (Πρωί - Απόγευμα)</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="shiftRotation"
                                        checked={data.shiftRotation === '3_shifts'}
                                        onChange={() => update({ shiftRotation: '3_shifts' })}
                                        className="mr-2 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">3 Βάρδιες (Πρωί - Απόγευμα - Βράδυ)</span>
                                </label>
                            </div>
                        </div>
                    )}
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

                <div className="md:col-span-2 space-y-6 pt-4 border-t border-gray-100">
                    {/* Coffee Detail */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
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
                                    placeholder="κούπες/μέρα"
                                    value={data.coffeeCups}
                                    onChange={(e) => update({ coffeeCups: e.target.value })}
                                    className="w-32 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-1 border"
                                />
                            )}
                        </div>
                        {data.coffee && (
                            <div className="ml-8 p-3 bg-gray-50 rounded-md space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="coffeeSugar"
                                            checked={data.coffeeSugar === 'sketos'}
                                            onChange={() => update({ coffeeSugar: 'sketos' })}
                                            className="mr-2 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">Σκέτος</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="coffeeSugar"
                                            checked={data.coffeeSugar === 'metrios'}
                                            onChange={() => update({ coffeeSugar: 'metrios' })}
                                            className="mr-2 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">Μέτριος</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="coffeeSugar"
                                            checked={data.coffeeSugar === 'glykos'}
                                            onChange={() => update({ coffeeSugar: 'glykos' })}
                                            className="mr-2 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">Γλυκός</span>
                                    </label>
                                </div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.coffeeMilk}
                                        onChange={(e) => update({ coffeeMilk: e.target.checked })}
                                        className="mr-2 rounded text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">Με γάλα</span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Alcohol Detail */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={data.alcohol}
                                onChange={(e) => update({ alcohol: e.target.checked })}
                                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Πίνετε αλκοόλ;</span>
                        </label>
                        {data.alcohol && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                                <span className="text-sm text-gray-500">Ποτά/εβδομάδα:</span>
                                <input
                                    type="number"
                                    value={data.alcoholFrequency}
                                    onChange={(e) => update({ alcoholFrequency: e.target.value })}
                                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-1 border"
                                />
                            </div>
                        )}
                    </div>

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
