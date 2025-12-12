import { cn } from '@/lib/utils';
import {
    User, Stethoscope, Clock, Utensils, Target,
    CreditCard, FileText, FileEdit, MessageSquare
} from 'lucide-react';

export type TabId = 'profile' | 'medical' | 'habits' | 'preferences' | 'goals' | 'financials' | 'mealplans' | 'feedback' | 'notes';

interface Props {
    activeTab: TabId;
    onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: any }[] = [
    { id: 'profile', label: 'Προφίλ', icon: User },
    { id: 'medical', label: 'Ιατρικό', icon: Stethoscope },
    { id: 'habits', label: 'Συνήθειες', icon: Clock },
    { id: 'preferences', label: 'Διατροφή', icon: Utensils }, // Renamed from "Προτιμήσεις" to clear confusion, though user asked for side-by-side. Wait, user said "card next to notes".
    { id: 'goals', label: 'Στόχοι', icon: Target },
    { id: 'financials', label: 'Πακέτο & Πληρωμές', icon: CreditCard },
    { id: 'mealplans', label: 'Διαιτολόγια', icon: FileText },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare }, // Using generic MessageSquare if available, or imports.
    { id: 'notes', label: 'Σημειώσεις', icon: FileEdit },
];

export default function ProfileTabs({ activeTab, onChange }: Props) {
    return (
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
            <nav className="-mb-px flex space-x-4 min-w-max px-1" aria-label="Tabs">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className={cn(
                                "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                                isActive
                                    ? "border-green-500 text-green-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "-ml-0.5 mr-2 h-4 w-4",
                                    isActive ? "text-green-500" : "text-gray-400 group-hover:text-gray-500"
                                )}
                            />
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
