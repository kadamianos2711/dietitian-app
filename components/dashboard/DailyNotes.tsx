import { Save } from 'lucide-react';

export function DailyNotes() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Σημειώσεις για σήμερα</h2>
            <div className="flex-1 flex flex-col">
                <textarea
                    className="flex-1 w-full p-4 rounded-lg bg-yellow-50/50 border border-yellow-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-200/50 resize-none text-sm leading-relaxed"
                    placeholder="Γράψε εδώ τις σημειώσεις, υπενθυμίσεις ή σκέψεις για σήμερα..."
                />
                <div className="mt-4 flex justify-end">
                    <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        <Save size={16} />
                        Αποθήκευση σημειώσεων
                    </button>
                </div>
            </div>
        </div>
    );
}
