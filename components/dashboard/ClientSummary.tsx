import { Users, UserPlus, Clock } from 'lucide-react';

export function ClientSummary() {
    const stats = [
        { label: 'Ενεργοί πελάτες', value: '32', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Νέοι πελάτες αυτόν τον μήνα', value: '4', icon: UserPlus, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Πελάτες σε διάλειμμα', value: '6', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Σύνοψη πελατών</h2>
            <div className="space-y-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.bg}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
