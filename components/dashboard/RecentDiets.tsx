import { FileText, ArrowRight } from 'lucide-react';

export function RecentDiets() {
    const recentDiets = [
        { client: 'Γιώργος Παπαδόπουλος', date: '09/12/2025', program: 'Εβδομάδα 1' },
        { client: 'Μαρία Οικονόμου', date: '08/12/2025', program: 'Συντήρηση' },
        { client: 'Κώστας Δημητρίου', date: '07/12/2025', program: 'Εβδομάδα 4' },
        { client: 'Ελένη Γεωργίου', date: '05/12/2025', program: 'Detox' },
        { client: 'Αλέξανδρος Νικολάου', date: '03/12/2025', program: 'Εβδομάδα 2' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Πρόσφατα διαιτολόγια</h2>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                    Προβολή όλων <ArrowRight size={14} />
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Πελάτης</th>
                            <th className="px-6 py-3">Ημερομηνία</th>
                            <th className="px-6 py-3">Πρόγραμμα</th>
                            <th className="px-6 py-3 text-right">Ενέργειες</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {recentDiets.map((diet, index) => (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <span className="text-xs font-bold">{diet.client.charAt(0)}</span>
                                    </div>
                                    {diet.client}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{diet.date}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                        {diet.program}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-sm border border-gray-200 rounded-md px-3 py-1.5 text-gray-600 hover:text-green-700 hover:border-green-200 hover:bg-green-50 transition-all font-medium">
                                        Άνοιγμα
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
