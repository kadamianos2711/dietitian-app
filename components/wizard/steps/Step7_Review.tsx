import { ClientFormData } from '@/types/client';
import { User, Activity, Utensils, Calendar, Heart } from 'lucide-react';

interface Props {
    data: ClientFormData;
}

export default function Step7_Review({ data }: Props) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-green-800 text-sm mb-6">
                Παρακαλώ ελέγξτε τα στοιχεία σας. Αν χρειάζεται κάποια διόρθωση, πατήστε "Προηγούμενο".
                Αν όλα είναι σωστά, πατήστε το κουμπί ολοκλήρωσης κάτω δεξιά.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Personal Info */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="flex items-center text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                        <User className="w-5 h-5 mr-2 text-green-600" />
                        Προσωπικά Στοιχεία
                    </h3>
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between"><dt className="text-gray-500">Ονοματεπώνυμο:</dt> <dd className="font-medium">{data.firstName} {data.lastName}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Ημ. Γέννησης:</dt> <dd className="font-medium">{data.birthDate || '-'}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Τηλέφωνο:</dt> <dd className="font-medium">{data.phone}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Email:</dt> <dd className="font-medium">{data.email || '-'}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Επάγγελμα:</dt> <dd className="font-medium">{data.occupation || '-'}</dd></div>
                    </dl>
                </div>

                {/* Health */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="flex items-center text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                        <Heart className="w-5 h-5 mr-2 text-green-600" />
                        Υγεία
                    </h3>
                    <dl className="space-y-4 text-sm">
                        <div>
                            <dt className="text-gray-500 mb-1">Παθήσεις:</dt>
                            <dd className="font-medium text-gray-900">{data.conditions.length > 0 ? data.conditions.join(', ') : 'Καμία'}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500 mb-1">Φάρμακα:</dt>
                            <dd className="font-medium text-gray-900">{data.medications.length > 0 ? data.medications.join(', ') : 'Κανένα'}</dd>
                        </div>
                        {data.medicalNotes && (
                            <div><dt className="text-gray-500 mb-1">Σημειώσεις:</dt> <dd className="text-gray-700 italic">{data.medicalNotes}</dd></div>
                        )}
                    </dl>
                </div>

                {/* Habits */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="flex items-center text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                        <Calendar className="w-5 h-5 mr-2 text-green-600" />
                        Καθημερινότητα
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                        <li>Ξύπνημα: <strong>{data.wakeUpTime || '-'}</strong>, Ύπνος: <strong>{data.bedTime || '-'}</strong> ({data.sleepHours} ώρες)</li>
                        <li>Γεύματα/μέρα: <strong>{data.mealsPerDay}</strong></li>
                        {data.skipBreakfast && <li>Παραλείπει πρωινό</li>}
                        {data.lateNightEating && <li>Τρώει αργά το βράδυ</li>}
                        {data.eatingOut && <li>Τρώει συχνά έξω</li>}
                        {data.delivery && <li>Παραγγέλνει delivery</li>}
                        <li>Καφές: {data.coffee ? `Ναι (${data.coffeeCups})` : 'Όχι'}</li>
                        <li>Αλκοόλ: {data.alcohol ? 'Ναι' : 'Όχι'}</li>
                        <li>Κάπνισμα: {data.smoking ? 'Ναι' : 'Όχι'}</li>
                    </ul>
                </div>

                {/* Diet & Activity */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="flex items-center text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                        <Utensils className="w-5 h-5 mr-2 text-green-600" />
                        Διατροφή & Άσκηση
                    </h3>
                    <dl className="space-y-3 text-sm">
                        <div>
                            <dt className="text-gray-500">Άσκηση:</dt>
                            <dd className="font-medium">
                                {data.exercises ? `${data.exerciseType} (${data.exerciseFrequency} φορές/βδομάδα)` : 'Όχι'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Αγαπημένα φαγητά:</dt>
                            <dd className="italic text-gray-700">{data.lovedFoods || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Αποστροφές:</dt>
                            <dd className="italic text-gray-700">{data.dislikedFoods || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Κύριοι Στόχοι:</dt>
                            <dd className="font-medium text-green-700">
                                {data.goals.length > 0 ? data.goals.map(g => g.replace('_', ' ')).join(', ') : '-'}
                            </dd>
                        </div>
                    </dl>
                </div>

            </div>
        </div>
    );
}
