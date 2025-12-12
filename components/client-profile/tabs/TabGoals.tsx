import { ClientFormData, Goal } from '@/types/client';
import { useRouter } from 'next/navigation';
import { Target, Quote, Edit } from 'lucide-react';

interface Props {
    client: ClientFormData;
}

const GOAL_LABELS: Record<Goal, string> = {
    'weight_loss': 'Απώλεια βάρους',
    'maintenance': 'Συντήρηση βάρους',
    'muscle_gain': 'Αύξηση μυϊκής μάζας',
    'energy': 'Περισσότερη ενέργεια',
    'digestion': 'Λιγότερο φούσκωμα / καλύτερη πέψη',
    'sugar_regulation': 'Ρύθμιση σακχάρων',
    'cholesterol': 'Ρύθμιση χοληστερίνης',
    'sleep': 'Καλύτερος ύπνος',
    'other': 'Άλλο',
};

export default function TabGoals({ client }: Props) {
    const router = useRouter();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

            <div className="flex justify-end pb-2">
                <button
                    onClick={() => window.location.href = `/clients/new?editId=${client.id}&step=6`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                    <Edit className="w-4 h-4 mr-1" />
                    Επεξεργασία
                </button>
            </div>

            {/* Primary Goals */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-600" />
                    Κύριοι Στόχοι
                </h3>

                {client.goals.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {client.goals.map(goal => (
                            <div key={goal} className="flex items-center p-3 bg-green-50 border border-green-100 rounded-lg text-green-800 font-medium">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                {GOAL_LABELS[goal] || goal}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Δεν έχουν οριστεί στόχοι.</p>
                )}
            </div>

            {/* Goal Description */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Quote className="w-5 h-5 mr-2 text-blue-500" />
                    "Τι θα ήθελες να πετύχεις;"
                </h3>
                {client.goalNotes ? (
                    <blockquote className="border-l-4 border-blue-200 pl-4 py-2 italic text-gray-700 bg-gray-50 rounded-r-lg">
                        {client.goalNotes}
                    </blockquote>
                ) : (
                    <p className="text-gray-500 italic">Δεν υπάρχει περιγραφή.</p>
                )}
            </div>

        </div>
    );
}
