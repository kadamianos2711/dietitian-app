import { ClientFormData } from '@/types/client';
import { Stethoscope, Pill, FileText } from 'lucide-react';

interface Props {
    client: ClientFormData;
}

export default function TabMedical({ client }: Props) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* Conditions */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2 text-red-500" />
                    Παθολογικές Καταστάσεις
                </h2>
                {client.conditions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {client.conditions.map(c => (
                            <span key={c} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-100">
                                {c}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Δεν έχουν δηλωθεί παθήσεις.</p>
                )}
            </div>

            {/* Medications */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Pill className="w-5 h-5 mr-2 text-blue-500" />
                    Φαρμακευτική Αγωγή
                </h2>
                {client.medications.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {client.medications.map(m => (
                            <li key={m}>{m}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">Δεν λαμβάνει φαρμακευτική αγωγή.</p>
                )}
            </div>

            {/* Notes */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-500" />
                    Σημειώσεις Γιατρού / Εξετάσεις
                </h2>
                {client.medicalNotes ? (
                    <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {client.medicalNotes}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Δεν υπάρχουν σημειώσεις.</p>
                )}
            </div>

        </div>
    );
}
