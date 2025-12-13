'use client';

import { useState, useEffect } from 'react';
// import { FOOD_DB } from '@/data/foodDB';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import FoodFormModal from '@/components/database/FoodFormModal';
import { FoodItem } from '@/types/engine';

export default function FoodsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [localFoods, setLocalFoods] = useState<FoodItem[]>([]);
    const [dbFoods, setDbFoods] = useState<FoodItem[]>([]);
    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    const [editingFood, setEditingFood] = useState<FoodItem | undefined>(undefined);

    // Load custom foods and deleted IDs from localStorage on mount
    useEffect(() => {
        try {
            const savedCustom = localStorage.getItem('custom_foods');
            const savedDeleted = localStorage.getItem('deleted_food_ids');

            if (savedCustom) setLocalFoods(JSON.parse(savedCustom));
            if (savedDeleted) setDeletedIds(JSON.parse(savedDeleted));
        } catch (e) {
            console.error('Failed to parse storage', e);
        }

        // Fetch DB Foods
        fetch('/api/database', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (data.foods) setDbFoods(data.foods);
            })
            .catch(err => console.error("Failed to fetch foods", err));
    }, []);

    const handleDelete = (id: string) => {
        if (!window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το τρόφιμο;')) return;

        // 1. Remove from localFoods if present
        const isLocal = localFoods.some(f => f.id === id);
        if (isLocal) {
            const updated = localFoods.filter(f => f.id !== id);
            setLocalFoods(updated);
            localStorage.setItem('custom_foods', JSON.stringify(updated));
        }

        // 2. If it exists in DB (or we just deleted a shadow), add to deletedIds
        if (dbFoods.some(f => f.id === id)) {
            const updatedDeleted = [...deletedIds, id];
            setDeletedIds(updatedDeleted);
            localStorage.setItem('deleted_food_ids', JSON.stringify(updatedDeleted));
        }
    };

    const handleSaveFood = (newFood: FoodItem) => {
        // Check if updating existing
        const existingIdx = localFoods.findIndex(f => f.id === newFood.id);
        let updated;

        if (existingIdx >= 0) {
            updated = [...localFoods];
            updated[existingIdx] = newFood;
        } else {
            // Check if it's shadowing a DB item (same ID but not in local yet)
            // Actually, if we pass initialData, we keep the ID.
            // So if I edit a DB item, newFood has a DB ID.
            // We just add it to localFoods.
            updated = [...localFoods, newFood];
        }

        setLocalFoods(updated);
        localStorage.setItem('custom_foods', JSON.stringify(updated));
        setEditingFood(undefined);
    };

    const handleEditClick = (food: FoodItem) => {
        setEditingFood(food);
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingFood(undefined);
    };

    const handleResetLocal = () => {
        if (confirm('Προσοχή! Αυτή η ενέργεια θα διαγράψει ΟΛΕΣ τις χειροκίνητες αλλαγές που έχετε κάνει και θα επαναφέρει τη βάση στην αρχική της μορφή (όπως είναι στο αρχείο). Είστε σίγουροι;')) {
            localStorage.removeItem('custom_foods');
            localStorage.removeItem('deleted_food_ids');
            setLocalFoods([]);
            setDeletedIds([]);
            window.location.reload();
        }
    };

    // Combine static DB with local custom foods (Local shadows DB)
    const allFoods = [
        ...localFoods,
        ...dbFoods.filter(dbFood => !localFoods.find(local => local.id === dbFood.id))
    ].filter(f => !deletedIds.includes(f.id)); // Filter deleted

    const filteredFoods = allFoods.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Βάση Τροφίμων</h1>
                        <p className="text-gray-500 mt-1">Διαχείριση συστατικών και διατροφικών στοιχείων</p>
                    </div>
                    <div className="flex space-x-4">
                        {/* Search Bar */}
                        <div className="relative w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Αναζήτηση τροφίμου..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={() => {
                                setEditingFood(undefined);
                                setIsAddModalOpen(true);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Νέο Τρόφιμο
                        </button>
                        
                        {(localFoods.length > 0 || deletedIds.length > 0) && (
                            <button
                                onClick={handleResetLocal}
                                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                title="Διαγραφή όλων των χειροκίνητων αλλαγών και επαναφορά από το αρχείο"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Επαναφορά Βάσης
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Τρόφιμο
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Κατηγορία
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Θερμίδες (100g)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Μάκρο (P/C/F)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Μετατροπή (Ωμό → Μαγ.)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Κόστος
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ενέργειες
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredFoods.map((food) => (
                                    <tr key={food.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs mr-3">
                                                    {food.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">{food.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {food.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {food.macros.calories} kcal
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex space-x-2">
                                                <span className="text-blue-600" title="Πρωτεΐνη">{food.macros.protein}p</span>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-green-600" title="Υδατάνθρακες">{food.macros.carbs}c</span>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-yellow-600" title="Λιπαρά">{food.macros.fat}f</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            x{food.conversionFactor} {food.conversionFactor > 1 ? '(διογκώνεται)' : '(συρρικνώνεται)'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {food.cost && (
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                                    ${food.cost === 'cheap' ? 'bg-green-100 text-green-800' : ''}
                                                    ${food.cost === 'moderate' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${food.cost === 'expensive' ? 'bg-red-100 text-red-800' : ''}
                                                `}>
                                                    {food.cost === 'cheap' && '€'}
                                                    {food.cost === 'moderate' && '€€'}
                                                    {food.cost === 'expensive' && '€€€'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(food)}
                                                    className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full hover:bg-green-100 transition-colors"
                                                    title="Επεξεργασία"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(food.id)}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors"
                                                    title="Διαγραφή"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredFoods.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                Δεν βρέθηκαν αποτελέσματα για "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>

                <FoodFormModal
                    isOpen={isAddModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveFood}
                    initialData={editingFood}
                    foodDB={dbFoods} // Pass dynamic DB
                />
            </div>
        </AppLayout>
    );
}
