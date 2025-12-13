'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { FoodItem, FoodCategory, FoodForm, CostLevel, FoodTag, Micronutrients } from '@/types/engine';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (food: FoodItem) => void;
    initialData?: FoodItem;
    foodDB?: FoodItem[]; // Made optional to avoid strict issues if not passed
}

const DEFAULT_CONVERSION_FACTORS: Record<string, number> = {
    'Protein': 0.75, // Meat loses water
    'Starch': 2.5,   // Rice/Pasta absorbs water
    'Vegetables': 1.0,
    'Fruits': 1.0,
    'Dairy': 1.0,
    'Fats': 1.0,
    'Snacks': 1.0,
    'Other': 1.0
};

type Tab = 'basic' | 'micros' | 'tags';

export default function FoodFormModal({ isOpen, onClose, onSave, initialData, foodDB = [] }: Props) {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState<Tab>('basic');
    const [formData, setFormData] = useState<Partial<FoodItem>>({
        name: '',
        category: 'Protein',
        form: 'raw',
        macros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        conversionFactor: 0.75,
        cost: 'moderate',
        tags: [],
        micros: {}
    });

    // Populate form on open
    useState(() => {
        if (initialData) {
            setFormData(JSON.parse(JSON.stringify(initialData))); // Deep copy
        }
    });

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value as FoodCategory;
        setFormData({
            ...formData,
            category: newCategory,
            conversionFactor: DEFAULT_CONVERSION_FACTORS[newCategory] || 1.0
        });
    };

    const handleMicroChange = (key: keyof Micronutrients, value: any) => {
        setFormData({
            ...formData,
            micros: {
                ...formData.micros,
                [key]: value
            }
        });
    };

    const toggleTag = (tag: FoodTag) => {
        const currentTags = formData.tags || [];
        if (currentTags.includes(tag)) {
            setFormData({ ...formData, tags: currentTags.filter(t => t !== tag) });
        } else {
            setFormData({ ...formData, tags: [...currentTags, tag] });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newFood: FoodItem = {
            id: initialData?.id || uuidv4(), // Use existing ID if editing
            name: formData.name || 'New Food',
            category: formData.category as FoodCategory,
            form: formData.form as FoodForm,
            macros: {
                calories: Number(formData.macros?.calories) || 0,
                protein: Number(formData.macros?.protein) || 0,
                carbs: Number(formData.macros?.carbs) || 0,
                fat: Number(formData.macros?.fat) || 0,
            },
            conversionFactor: Number(formData.conversionFactor) || 1,
            cost: formData.cost as CostLevel,
            tags: formData.tags || [],
            micros: formData.micros || {}
        };

        onSave(newFood);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">
                        {initialData ? 'Επεξεργασία Τροφίμου' : 'Προσθήκη Νέου Τροφίμου'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-6">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'basic' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Βασικά Στοιχεία
                    </button>
                    <button
                        onClick={() => setActiveTab('micros')}
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'micros' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Μικροθρεπτικά & Μέταλλα
                    </button>
                    <button
                        onClick={() => setActiveTab('tags')}
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tags' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Υγεία & Ετικέτες
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="food-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* BASIC TAB */}
                        {activeTab === 'basic' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Όνομα Τροφίμου</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Κατηγορία</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                            value={formData.category}
                                            onChange={handleCategoryChange}
                                        >
                                            <option value="Protein">Πρωτεΐνη</option>
                                            <option value="Starch">Υδατάνθρακας/Άμυλο</option>
                                            <option value="Fats">Λιπαρά</option>
                                            <option value="Vegetables">Λαχανικά</option>
                                            <option value="Fruits">Φρούτα</option>
                                            <option value="Dairy">Γαλακτοκομικά</option>
                                            <option value="Snacks">Σνακ</option>
                                            <option value="Other">Άλλο</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Κόστος</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                            value={formData.cost}
                                            onChange={e => setFormData({ ...formData, cost: e.target.value as CostLevel })}
                                        >
                                            <option value="cheap">Οικονομικό (€)</option>
                                            <option value="moderate">Μέτριο (€€)</option>
                                            <option value="expensive">Ακριβό (€€€)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Μακροθρεπτικά (ανά 100g)</h4>
                                    <div className="grid grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Θερμίδες</label>
                                            <input
                                                type="number"
                                                step="any"
                                                required
                                                className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
                                                value={formData.macros?.calories}
                                                onChange={e => setFormData({ ...formData, macros: { ...formData.macros!, calories: e.target.value as any } })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-blue-600 mb-1">Πρωτεΐνη</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
                                                value={formData.macros?.protein}
                                                onChange={e => setFormData({ ...formData, macros: { ...formData.macros!, protein: e.target.value as any } })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-green-600 mb-1">Υδατ/κες</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
                                                value={formData.macros?.carbs}
                                                onChange={e => setFormData({ ...formData, macros: { ...formData.macros!, carbs: e.target.value as any } })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-yellow-600 mb-1">Λιπαρά</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
                                                value={formData.macros?.fat}
                                                onChange={e => setFormData({ ...formData, macros: { ...formData.macros!, fat: e.target.value as any } })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Συντελεστής Μετατροπής (Ωμό → Μαγειρεμένο)
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            step="any"
                                            className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                                            value={formData.conversionFactor}
                                            onChange={e => setFormData({ ...formData, conversionFactor: e.target.value as any })}
                                        />
                                        <span className="text-xs text-gray-500">
                                            {Number(formData.conversionFactor) > 1 ? '(Το τρόφιμο διογκώνεται)' : '(Το τρόφιμο χάνει βάρος)'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-blue-600 mt-1">
                                        * Αυτόματη πρόταση βάσει κατηγορίας.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* MICROS TAB */}
                        {activeTab === 'micros' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                    <div className="col-span-2">
                                        <h4 className="text-sm font-bold text-gray-900 border-b pb-1 mb-2">Μέταλλα & Ιχνοστοιχεία</h4>
                                    </div>

                                    {/* Minerals Inputs */}
                                    {[
                                        { key: 'calcium', label: 'Ασβέστιο (mg)' },
                                        { key: 'iron', label: 'Σίδηρος (mg)' },
                                        { key: 'magnesium', label: 'Μαγνήσιο (mg)' },
                                        { key: 'potassium', label: 'Κάλιο (mg)' },
                                        { key: 'sodium', label: 'Νάτριο (mg)' },
                                        { key: 'zinc', label: 'Ψευδάργυρος (mg)' },
                                        { key: 'phosphorus', label: 'Φώσφορος (mg)' },
                                        { key: 'selenium', label: 'Σελήνιο (μg)' },
                                    ].map((m) => (
                                        <div key={m.key}>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">{m.label}</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                value={formData.micros?.[m.key as keyof Micronutrients] || ''}
                                                onChange={e => handleMicroChange(m.key as keyof Micronutrients, e.target.value)}
                                            />
                                        </div>
                                    ))}

                                    <div className="col-span-2 mt-4">
                                        <h4 className="text-sm font-bold text-gray-900 border-b pb-1 mb-2">Βιταμίνες</h4>
                                    </div>

                                    {/* Vitamins Inputs */}
                                    {[
                                        { key: 'vitaminA', label: 'Βιταμίνη A (μg)' },
                                        { key: 'vitaminC', label: 'Βιταμίνη C (mg)' },
                                        { key: 'vitaminD', label: 'Βιταμίνη D (μg)' },
                                        { key: 'vitaminE', label: 'Βιταμίνη E (mg)' },
                                        { key: 'vitaminB12', label: 'Βιταμίνη B12 (μg)' },
                                        { key: 'vitaminB9', label: 'Φυλλικό Οξύ (μg)' },
                                    ].map((v) => (
                                        <div key={v.key}>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">{v.label}</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                value={formData.micros?.[v.key as keyof Micronutrients] || ''}
                                                onChange={e => handleMicroChange(v.key as keyof Micronutrients, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAGS TAB */}
                        {activeTab === 'tags' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">

                                {/* Pathologies */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                                        <span className="bg-red-100 text-red-600 p-1 rounded mr-2">❤️</span>
                                        Φιλικό για Παθολογίες
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { tag: 'diabetes-friendly', label: 'Διαβήτης' },
                                            { tag: 'hypertension-friendly', label: 'Υπέρταση' },
                                            { tag: 'cholesterol-friendly', label: 'Χοληστερίνη' },
                                            { tag: 'ibs-friendly', label: 'Ευερέθιστο Έντερο (IBS)' },
                                            { tag: 'low-fodmap', label: 'Low FODMAP' },
                                            { tag: 'gluten-intolerance-friendly', label: 'Δυσανεξία Γλουτένης' },
                                            { tag: 'nafld-friendly', label: 'Λιπώδες Ήπαρ' },
                                            { tag: 'kidney-friendly', label: 'Νεφροπάθεια' },
                                            { tag: 'uric-acid-friendly', label: 'Ουρικό Οξύ' },
                                            { tag: 'gastritis-friendly', label: 'Γαστρίτιδα/ΓΟΠ' },
                                        ].map((item) => (
                                            <label key={item.tag} className="flex items-center space-x-2 text-sm cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.tags?.includes(item.tag as FoodTag)}
                                                    onChange={() => toggleTag(item.tag as FoodTag)}
                                                    className="rounded text-green-600 focus:ring-green-500"
                                                />
                                                <span className="text-gray-700">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Nutrients & Dietary */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                                        <span className="bg-blue-100 text-blue-600 p-1 rounded mr-2">🥗</span>
                                        Διατροφικά Στοιχεία
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { tag: 'high-protein', label: 'Υψηλή Πρωτεΐνη' },
                                            { tag: 'low-carb', label: 'Χαμηλοί Υδατάνθρακες' },
                                            { tag: 'high-fiber', label: 'Φυτικές Ίνες' },
                                            { tag: 'gluten-free', label: 'Χωρίς Γλουτένη' },
                                            { tag: 'lactose-free', label: 'Χωρίς Λακτόζη' },
                                            { tag: 'vegan', label: 'Vegan' },
                                            { tag: 'iron', label: 'Πηγή Σιδήρου' },
                                            { tag: 'calcium', label: 'Πηγή Ασβεστίου' },
                                            { tag: 'omega-3', label: 'Ωμέγα-3' },
                                            { tag: 'oxidants', label: 'Αντιοξειδωτικά' },
                                        ].map((item) => (
                                            <label key={item.tag} className="flex items-center space-x-2 text-sm cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.tags?.includes(item.tag as FoodTag)}
                                                    onChange={() => toggleTag(item.tag as FoodTag)}
                                                    className="rounded text-green-600 focus:ring-green-500"
                                                />
                                                <span className="text-gray-700">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 bg-white"
                    >
                        Ακύρωση
                    </button>
                    <button
                        form="food-form"
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                    >
                        Αποθήκευση
                    </button>
                </div>
            </div>
        </div>
    );
}
