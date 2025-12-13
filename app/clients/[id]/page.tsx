'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import ProfileHeader from '@/components/client-profile/ProfileHeader';
import ProfileTabs, { TabId } from '@/components/client-profile/ProfileTabs';
import { initialClientState, ClientFormData } from '@/types/client';

// Tab Components
import TabProfile from '@/components/client-profile/tabs/TabProfile';
import TabMedical from '@/components/client-profile/tabs/TabMedical';
import TabHabits from '@/components/client-profile/tabs/TabHabits';
import TabPreferences from '@/components/client-profile/tabs/TabPreferences';
import TabGoals from '@/components/client-profile/tabs/TabGoals';
import TabFinancials from '@/components/client-profile/tabs/TabFinancials';
import TabMealPlans from '@/components/client-profile/tabs/TabMealPlans';
import TabNotes from '@/components/client-profile/tabs/TabNotes';
import TabFeedback from '@/components/client-profile/tabs/TabFeedback';

// Printing
import { Printer } from 'lucide-react';
import RecommendationsPrint from '@/components/print/RecommendationsPrint';
import { RECOMMENDATIONS_DB, RecommendationData } from '@/data/recommendations';

import { useParams, useSearchParams } from 'next/navigation';

export default function ClientProfilePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params?.id as string; // Safely access id

    const [activeTab, setActiveTab] = useState<TabId>((searchParams.get('tab') as TabId) || 'profile');

    useEffect(() => {
        const tab = searchParams.get('tab') as TabId;
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const [client, setClient] = useState<ClientFormData | null>(null);
    const [showPrintRecs, setShowPrintRecs] = useState(false);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                // If it's a new client creation flow (e.g. id='new'), handle separately (not focus now)
                if (id === 'new') {
                     // ... logic for new client from local storage or defaults
                     setClient({ ...initialClientState, firstName: 'Νέος', lastName: 'Πελάτης' });
                     return;
                }

                const res = await fetch(`/api/clients?id=${id}`);
                if (!res.ok) {
                    throw new Error('Client not found');
                }
                const data = await res.json();
                
                // Ensure foodPreferences is at least empty object if missing
                setClient({ ...data, foodPreferences: data.foodPreferences || {} });
            } catch (error) {
                console.error("Failed to fetch client:", error);
                
                // Fallback for specific demo ID or just Error
                if (id === '12') {
                     // keeping demo for safety if API fails?
                     // actually explicit demo ID should probably still work via API if we seeded it, 
                     // but let's assume we want to use the API primarily now.
                }
            }
        };

        if (id) {
            fetchClient();
        }
    }, [id]);

    if (!client) return <div>Loading...</div>;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile': return <TabProfile client={client} />;
            case 'medical': return <TabMedical client={client} />;
            case 'habits': return <TabHabits client={client} />;
            case 'preferences': return <TabPreferences client={client} />;
            case 'goals': return <TabGoals client={client} />;
            case 'financials': return <TabFinancials client={client} />;
            case 'mealplans': return <TabMealPlans client={client} />;
            case 'feedback': return <TabFeedback client={client} />;
            case 'notes': return <TabNotes client={client} />;
            default: return null;
        }
    };

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ProfileHeader client={client} />

                {/* Client Header / Summary */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {client.firstName} {client.lastName}
                            </h1>
                            <span className={client.collaborationType ? "px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200" : "px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-600 border-gray-200"}>
                                {client.collaborationType || 'Χωρίς Πακέτο'}
                            </span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-4">
                            <span>{client.phone}</span>
                            <span>•</span>
                            <span>{client.email}</span>
                            <span>•</span>
                            <span className="text-blue-600 font-medium">{client.goals.join(', ') || 'Χωρίς στόχο'}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="text-sm text-gray-500">
                            <span className="font-medium text-gray-900">Επόμενο Ραντεβού:</span> -
                        </div>
                        <button
                            onClick={() => {
                                setShowPrintRecs(true);
                                setTimeout(() => window.print(), 100);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                            <Printer className="h-4 w-4 mr-1.5 text-gray-500" />
                            Εκτύπωση Συστάσεων
                        </button>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

                <div className="min-h-[400px]">
                    {renderTabContent()}
                </div>
            </div>

            {/* Print Area - Hidden normally, visible on print if showPrintRecs is true */}
            {showPrintRecs && client && (
                <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-8">
                    <RecommendationsPrint 
                        clientName={`${client.firstName} ${client.lastName}`}
                        recommendations={client.conditions
                            .map(c => RECOMMENDATIONS_DB[c] || null) // Map condition names to DB
                            .filter(Boolean) as RecommendationData[]
                        } 
                    />
                </div>
            )}
        </AppLayout>
    );
}
