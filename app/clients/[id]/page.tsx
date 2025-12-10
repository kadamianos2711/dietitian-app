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

export default function ClientProfilePage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState<TabId>('profile');
    const [client, setClient] = useState<ClientFormData | null>(null);

    useEffect(() => {
        // In a real app, fetch by params.id
        // For now, try to load the draft from localStorage or use a mock
        // For now, try to load the draft from localStorage or use a mock
        const saved = localStorage.getItem('currentClientDraft');
        let parsedClient = null;

        if (saved) {
            try {
                parsedClient = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse client draft', e);
            }
        }

        if (parsedClient) {
            setClient(parsedClient);
        } else {
            // Fallback mock if nothing in local storage (for dev)
            setClient({
                ...initialClientState,
                firstName: 'Γιώργος',
                lastName: 'Παπαδόπουλος',
                phone: '6971234567',
                gender: 'male',
                birthDate: '1985-05-15',
                conditions: ['Υπέρταση', 'Υψηλή χοληστερίνη'],
                medications: ['Salospir'],
                installments: '3',
                collaborationType: '3 μήνες',
                packagePrice: '150',
                hasVat: true,
                finalPrice: '186.00'
            });
        }
    }, []);

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
            case 'notes': return <TabNotes client={client} />;
            default: return null;
        }
    };

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ProfileHeader client={client} />
                <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

                <div className="min-h-[400px]">
                    {renderTabContent()}
                </div>
            </div>
        </AppLayout>
    );
}
