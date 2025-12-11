import { ClientFormData } from '@/types/client';

interface Props {
    data: ClientFormData;
    update: (data: Partial<ClientFormData>) => void;
}

const CONDITIONS = [
    'Διαβήτης',
    'Υπέρταση',
    'Υψηλή Χοληστερίνη',
    'Υποθυρεοειδισμός',
    'Hashimoto',
    'PCOS (Πολυκυστικές)',
    'Σιδηροπενική Αναιμία',
    'Γαστροοισοφαγική Παλινδρόμηση',
    'Δυσκοιλιότητα',
    'Χρόνια Διάρροια',
    'Σπαστική Κολίτιδα / IBS',
    'Ελκώδης Κολίτιδα',
    'Νόσος Crohn',
    'Λιπώδες Ήπαρ (NAFLD)',
    'Χολολιθίαση (Πέτρες)',
    'Ουρικό Οξύ / Αρθρίτιδα',
    'Χρόνια Νεφρική Νόσος',
    'Κοιλιοκάκη / Δυσανεξία Γλουτένη',
    'Παχυσαρκία',
    'Εμμηνόπαυση'
];

const MEDICATIONS = [
    'Κορτιζόνη', 'Αντισταμινικά', 'Αντιβιοτικά', 'Αντιφλεγμονώδη',
    'Φάρμακα για θυρεοειδή', 'Αντικαταθλιπτικά / αγχολυτικά'
];

export default function Step2_Health({ data, update }: Props) {

    const toggleCondition = (condition: string) => {
        const current = data.conditions;
        if (current.includes(condition)) {
            update({ conditions: current.filter(c => c !== condition) });
        } else {
            update({ conditions: [...current, condition] });
        }
    };

    const toggleMedication = (med: string) => {
        const current = data.medications;
        if (current.includes(med)) {
            update({ medications: current.filter(m => m !== med) });
        } else {
            update({ medications: [...current, med] });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* Conditions */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Παθολογικές Καταστάσεις</h3>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Επιλέξτε παθήσεις:</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {CONDITIONS.map((condition) => (
                            <label key={condition} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.conditions.includes(condition)}
                                    onChange={() => toggleCondition(condition)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">{condition}</span>
                            </label>
                        ))}
                        {/* Other field */}
                        <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer col-span-1 md:col-span-2">
                            <span className="text-sm text-gray-700 min-w-[50px]">Άλλο:</span>
                            <input
                                type="text"
                                placeholder="Π.χ. Καρδιακή ανεπάρκεια"
                                className="flex-1 border-0 border-b border-gray-300 focus:ring-0 focus:border-green-500 text-sm p-0 bg-transparent"
                                onChange={(e) => {
                                    // For now, allow typing but maybe not saving 'other' strictly unless we add logic.
                                    // Just keeping the UI requested.
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Medications */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Φαρμακευτική Αγωγή</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {MEDICATIONS.map(med => (
                        <label key={med} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.medications.includes(med)}
                                onChange={() => toggleMedication(med)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{med}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Σημειώσεις γιατρού / Εξετάσεις αίματος
                </label>
                <textarea
                    rows={4}
                    value={data.medicalNotes}
                    onChange={(e) => update({ medicalNotes: e.target.value })}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="Γράψτε εδώ τυχόν άλλες παρατηρήσεις..."
                />
            </div>
        </div>
    );
}
