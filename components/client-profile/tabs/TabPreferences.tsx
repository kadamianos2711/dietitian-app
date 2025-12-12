import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ClientFormData, FoodPreference } from '@/types/client';
import { ThumbsUp, ThumbsDown, Minus, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    client: ClientFormData;
}

export default function TabPreferences({ client }: Props) {
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/clients/new?editId=${client.id}&step=4`);
    };

    // Combine all preferences into a list for display, filtering by type if needed
    // Since our data model is just a Record<string, FoodPreference>, we'll iterate entries.
    const preferences = Object.entries(client.foodPreferences || {});

    const likes = preferences.filter(([_, pref]) => pref === 'like');
    const neutrals = preferences.filter(([_, pref]) => pref === 'neutral');
    const dislikes = preferences.filter(([_, pref]) => pref === 'dislike');

    const renderList = (items: [string, FoodPreference][], icon: any, colorClass: string, emptyText: string) => {
        if (items.length === 0) return <p className="text-gray-400 italic text-sm">{emptyText}</p>;

        return (
            <div className="flex flex-wrap gap-2">
                {items.map(([food]) => (
                    <span key={food} className={cn("inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border", colorClass)}>
                        {icon}
                        <span className="ml-2">{food}</span>
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Διατροφικές Προτιμήσεις</h3>
                {/* The button's onClick handler is updated and the button is now wrapped in a new div */}
                <div className="flex justify-end pb-2">
                    <button
                        onClick={() => window.location.href = `/clients/new?editId=${client.id}&step=4`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <Edit className="w-4 h-4 mr-1" />
                        Επεξεργασία
                    </button>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Likes */}
                <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm bg-green-50/30">
                    <h3 className="text-green-800 font-bold mb-4 flex items-center">
                        <ThumbsUp className="w-5 h-5 mr-2" />
                        Του αρέσουν
                    </h3>
                    {renderList(likes, null, "bg-white text-green-700 border-green-200", "Δεν έχει δηλώσει")}
                </div>

                {/* Neutrals */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-700 font-bold mb-4 flex items-center">
                        <Minus className="w-5 h-5 mr-2" />
                        Ουδέτερα
                    </h3>
                    {renderList(neutrals, null, "bg-gray-50 text-gray-700 border-gray-200", "-")}
                </div>

                {/* Dislikes */}
                <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm bg-red-50/30">
                    <h3 className="text-red-800 font-bold mb-4 flex items-center">
                        <ThumbsDown className="w-5 h-5 mr-2" />
                        Δεν του αρέσουν
                    </h3>
                    {renderList(dislikes, null, "bg-white text-red-700 border-red-200", "Δεν έχει δηλώσει")}
                </div>

            </div>

            {/* Special Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                    <h4 className="text-red-900 font-bold mb-2">Τρόφιμα που δεν θέλει ΚΑΘΟΛΟΥ</h4>
                    <p className="text-red-800 italic">{client.dislikedFoods || "Κανένα"}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h4 className="text-green-900 font-bold mb-2">Τρόφιμα που αγαπάει ΙΔΙΑΙΤΕΡΑ</h4>
                    <p className="text-green-800 italic">{client.lovedFoods || "Κανένα"}</p>
                </div>
            </div>

        </div>
    );
}
