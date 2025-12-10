import Link from 'next/link';
import { Home, Users, BookOpen, UtensilsCrossed, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const menuItems = [
        { label: 'Κεντρικός Πίνακας', icon: Home, href: '/', active: true },
        { label: 'Πελάτες', icon: Users, href: '/clients', active: false },
        { label: 'Συνταγές', icon: BookOpen, href: '/recipes', active: false },
        { label: 'Τρόφιμα', icon: UtensilsCrossed, href: '/foods', active: false },
        { label: 'Ρυθμίσεις', icon: Settings, href: '/settings', active: false },
    ];

    return (
        <div className="w-64 bg-white h-full border-r border-gray-200 flex flex-col p-4 shadow-sm">
            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                            item.active
                                ? "bg-green-50 text-green-700"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <item.icon
                            className={cn(
                                "mr-3 h-5 w-5 flex-shrink-0",
                                item.active ? "text-green-600" : "text-gray-400 group-hover:text-gray-500"
                            )}
                        />
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
