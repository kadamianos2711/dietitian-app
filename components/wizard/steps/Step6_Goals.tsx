import { ClientFormData, Goal } from '@/types/client';
import { Target } from 'lucide-react';

interface Props {
    data: ClientFormData;
    update: (data: Partial<ClientFormData>) => void;
}

const GOALS: { id: Goal; label: string }[] = [
    { id: 'weight_loss', label: 'Απώλεια βάρους' },
    { id: 'maintenance', label: 'Συντήρηση βάρους' },
    { id: 'muscle_gain', label: 'Αύξηση μυϊκής μάζας' },
    { id: 'energy', label: 'Περισσότερη ενέργεια' },
    { id: 'digestion', label: 'Λιγότερο φούσκωμα / καλύτερη πέψη' },
    { id: 'sugar_regulation', label: 'Ρύθμιση σακχάρων' },
    { id: 'cholesterol', label: 'Ρύθμιση χοληστερίνης' },
    { id: 'sleep', label: 'Καλύτερος ύπνος' },
];

export default function Step6_Goals({ data, update }: Props) {

    const toggleGoal = (goal: Goal) => {
        const current = data.goals;
        if (current.includes(goal)) {
            update({ goals: current.filter(g => g !== goal) });
        } else {
            update({ goals: [...current, goal] });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* Goals Grid */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-600" />
                    Τι στόχους έχετε;
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GOALS.map(goal => (
                        <label
                            key={goal.id}
                            className={`
                        relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all
                        ${data.goals.includes(goal.id)
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-green-200 bg-white'}
                    `}
                        >
                            <input
                                type="checkbox"
                                checked={data.goals.includes(goal.id)}
                                onChange={() => toggleGoal(goal.id)}
                                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-3"
                            />
                            <span className={`font-medium ${data.goals.includes(goal.id) ? 'text-green-900' : 'text-gray-700'}`}>
                                {goal.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Free Text Goal */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Πείτε μας με δικά σας λόγια, τι θα θέλατε να πετύχετε;
                </label>
                <textarea
                    rows={5}
                    value={data.goalNotes}
                    onChange={(e) => update({ goalNotes: e.target.value })}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border placeholder-gray-400"
                    placeholder="π.χ. Θέλω να νιώθω πιο άνετα με τα ρούχα μου και να έχω περισσότερη αντοχή..."
                />
            </div>

        </div>
    );
}
