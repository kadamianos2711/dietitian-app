import { X, Printer, FileDown } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function ShoppingListModal({ isOpen, onClose }: Props) {
    if (!isOpen) return null;

    // Mock Data
    const items = {
        'Λαχανικά': [
            { name: 'Μπρόκολο', amount: '500g' },
            { name: 'Καρότα', amount: '300g' },
            { name: 'Σπανάκι', amount: '200g' },
        ],
        'Φρούτα': [
            { name: 'Μήλα', amount: '5 τμχ' },
            { name: 'Μπανάνες', amount: '1 τσαμπί' },
        ],
        'Πρωτεΐνη': [
            { name: 'Κοτόπουλο Στήθος', amount: '1kg' },
            { name: 'Γιαούρτι 2%', amount: '1kg' },
            { name: 'Αυγά', amount: '6 τμχ' },
        ],
        'Άμυλα': [
            { name: 'Βρώμη', amount: '500g' },
            { name: 'Ρύζι καστανό', amount: '500g' },
        ]
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 print:hidden">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Λίστα Ψωνιών Εβδομάδας</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="grid gap-6">
                        {Object.entries(items).map(([category, products]) => (
                            <div key={category}>
                                <h4 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-3 border-b border-green-100 pb-1">
                                    {category}
                                </h4>
                                <ul className="space-y-2">
                                    {products.map((item, idx) => (
                                        <li key={idx} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-900">{item.name}</span>
                                            <span className="text-gray-500 font-medium">{item.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm">
                        <Printer className="w-4 h-4 mr-2" />
                        Εκτύπωση
                    </button>
                    <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                        <FileDown className="w-4 h-4 mr-2" />
                        Εξαγωγή PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
