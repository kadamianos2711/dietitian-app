'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RefreshCw, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';

export default function DataSyncPage() {
    const [foodSheetUrl, setFoodSheetUrl] = useState('');
    const [recipeSheetUrl, setRecipeSheetUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string, details?: any } | null>(null);

    // Fetch saved URLs on mount

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.foodSheetUrl) setFoodSheetUrl(data.foodSheetUrl);
                if (data.recipeSheetUrl) setRecipeSheetUrl(data.recipeSheetUrl);
            })
            .catch(console.error);
    }, []);

    const handleSync = async () => {
        if (!foodSheetUrl && !recipeSheetUrl) {
            setStatus({ type: 'error', message: 'Παρακαλώ εισάγετε τουλάχιστον ένα URL.' });
            return;
        }

        setIsLoading(true);
        setStatus(null);

        try {
            const res = await fetch('/api/admin/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ foodSheetUrl, recipeSheetUrl })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Sync failed');
            }

            setStatus({
                type: 'success',
                message: 'Ο συγχρονισμός ολοκληρώθηκε επιτυχώς!',
                details: data.stats
            });
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Error occurred during sync' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Συγχρονισμός Δεδομένων</h1>
                    <p className="text-gray-500 mt-1">Εισαγωγή τροφίμων και συνταγών από Google Sheets</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6 space-y-6">
                    {/* Instructions */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    Βεβαιωθείτε ότι τα Google Sheets είναι δημοσιευμένα ή έχουν δημόσια πρόσβαση "Anyone with the link".
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL Βάσης Τροφίμων (Google Sheet)</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FileSpreadsheet className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                    placeholder="https://docs.google.com/spreadsheets/d/..."
                                    value={foodSheetUrl}
                                    onChange={(e) => setFoodSheetUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL Βάσης Συνταγών (Google Sheet)</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FileSpreadsheet className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                    placeholder="https://docs.google.com/spreadsheets/d/..."
                                    value={recipeSheetUrl}
                                    onChange={(e) => setRecipeSheetUrl(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSync}
                            disabled={isLoading}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                                ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Συγχρονισμός...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
                                    Έναρξη Συγχρονισμού
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Status Output */}
                {status && (
                    <div className={`mt-6 rounded-md p-4 ${status.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {status.type === 'success' ? (
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                )}
                            </div>
                            <div className="ml-3">
                                <h3 className={`text-sm font-medium ${status.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                    {status.message}
                                </h3>
                                {status.details && (
                                    <div className={`mt-2 text-sm ${status.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Τρόφιμα: {status.details.addedFoods} νέα, {status.details.updatedFoods} ενημερώθηκαν</li>
                                            <li>Συνταγές: {status.details.addedRecipes} νέες, {status.details.updatedRecipes} ενημερώθηκαν</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
