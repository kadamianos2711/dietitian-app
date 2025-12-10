import { User, ChevronDown } from 'lucide-react';

export function Header() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-green-700">Dietitian’s Corner App</h1>
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">| Κεντρικός Πίνακας</span>
            </div>

            <div className="flex items-center gap-3 relative group cursor-pointer">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 border border-green-200">
                        <User size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Δαμιανός</span>
                    <ChevronDown size={14} className="text-gray-400" />
                </div>

                {/* Dropdown Menu (Hover based for simple CSS-only interaction) */}
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 hidden group-hover:block animate-in fade-in zoom-in-95 duration-100">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Ρυθμίσεις λογαριασμού</a>
                    <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Έξοδος</a>
                </div>
            </div>
        </header>
    );
}
