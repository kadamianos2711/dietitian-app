import Link from 'next/link';
import { UserPlus, FilePlus, Search } from 'lucide-react';

export function QuickActions() {
    const actions = [
        { label: 'Νέος πελάτης', icon: UserPlus, color: 'bg-blue-600 hover:bg-blue-700', href: '/clients/new' },
        { label: 'Δημιουργία νέου διαιτολογίου', icon: FilePlus, color: 'bg-green-600 hover:bg-green-700', href: '/clients' },
        { label: 'Αναζήτηση πελάτη', icon: Search, color: 'bg-purple-600 hover:bg-purple-700', href: '/clients' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Γρήγορες ενέργειες</h2>
            <div className="flex flex-col gap-3">
                {actions.map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        className={`flex items-center justify-center gap-3 w-full py-3 px-4 rounded-lg text-white font-medium transition-colors shadow-sm ${action.color}`}
                    >
                        <action.icon size={20} />
                        {action.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
