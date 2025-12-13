import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { RefreshCw, Database } from 'lucide-react';

export default function SettingsPage() {
    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Ρυθμίσεις</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Data Sync Card */}
                    <Link href="/admin/data-sync" className="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                <RefreshCw className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Συγχρονισμός Δεδομένων</h3>
                                <p className="text-sm text-gray-500 mt-1">Εισαγωγή από Google Sheets</p>
                            </div>
                        </div>
                    </Link>

                    {/* Placeholder for future settings */}
                    <div className="group block p-6 bg-white border border-gray-200 rounded-xl opacity-60 cursor-not-allowed">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <Database className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Διαχείριση Αντιγράφων</h3>
                                <p className="text-sm text-gray-500 mt-1">Σύντομα κοντά σας</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
