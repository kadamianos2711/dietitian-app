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

import { useParams } from 'next/navigation';

export default function ClientProfilePage() {
    const params = useParams();
    const id = params?.id as string; // Safely access id

    const [activeTab, setActiveTab] = useState<TabId>('profile');
    const [client, setClient] = useState<ClientFormData | null>(null);

    useEffect(() => {
        // FULL DEMO CLIENT CONSTANT
        const DEMO_CLIENT_ALEX: ClientFormData = {
            ...initialClientState,
            // 1. Personal
            firstName: 'Αλέξανδρος',
            lastName: 'Γεωργίου',
            fathersName: 'Δημήτριος',
            birthDate: '1988-03-12',
            gender: 'male',
            phone: '6945551234',
            email: 'alex.georgiou@example.com',
            occupation: 'Ιδιωτικός Υπάλληλος',
            address: {
                street: 'Τσιμισκή',
                number: '45',
                area: 'Κέντρο',
                city: 'Θεσσαλονίκη',
                postalCode: '54623'
            },

            // 2. Health
            conditions: ['Χοληστερίνη', 'Εποχιακές αλλεργίες'],
            medications: ['Xozal (κατά περιόδους)'],
            medicalNotes: 'Πρόσφατες εξετάσεις (Δεκ 2024) έδειξαν ελαφρώς αυξημένη LDL.',

            // 3. Habits
            wakeUpTime: '07:30',
            bedTime: '23:30',
            workSchedule: '9-5',
            workHoursFrom: '09:00',
            workHoursTo: '17:00',
            mealsPerDay: '4',
            coffee: true,
            coffeeCups: '2',
            coffeeSugar: 'metrios' as any, // Type cast for strict check if needed
            coffeeMilk: true,
            alcohol: true,
            alcoholFrequency: '1-2 φορές/εβδομάδα (Κρασί)',
            smoking: false,
            delivery: true,
            eatingOut: true,

            // 4. Preferences
            foodPreferences: {},
            lovedFoods: 'Μακαρόνια, Μοσχαράκι kokkinisto, Σοκολάτα',
            dislikedFoods: 'Μπάμιες, Συκώτι',

            // 5. Exercise
            exercises: true,
            exerciseType: 'Crossfit',
            exerciseFrequency: '3 φορές/βδομάδα',
            sleepHours: '7-8',

            // 6. Goals
            goals: ['weight_loss', 'energy'],
            goalNotes: 'Στόχος τα 85kg μέχρι το καλοκαίρι. Θέλει περισσότερη ενέργεια τα απογεύματα.',

            // 8. Financials - Active Package
            collaborationType: '3 μήνες',
            startDate: '2025-12-01',
            endDate: '2026-02-22',
            packagePrice: '150',
            hasVat: true,
            finalPrice: '186.00',
            installments: '3',
            initialPayment: {
                amount: '62',
                date: '2025-12-01',
                method: 'card'
            },
            paymentPlan: [
                { number: 1, amount: '62.00', date: '2025-12-01', reminderDate: '', isPaid: true },
                { number: 2, amount: '62.00', date: '2026-01-01', reminderDate: '2025-12-28', isPaid: false },
                { number: 3, amount: '62.00', date: '2026-02-01', reminderDate: '2026-01-28', isPaid: false },
            ],
            // Historical Packages
            packages: [
                {
                    id: 'old_pkg_1',
                    type: '1 μήνας',
                    startDate: '2025-10-01',
                    endDate: '2025-10-28',
                    sessions: 4,
                    price: '60',
                    status: 'completed'
                }
            ]
        };

        // Routing Logic
        if (id === '12') {
            setClient(DEMO_CLIENT_ALEX);
            return;
        }

        // For other IDs or generic view, IF we have specific logic we add it here.
        // Otherwise try localStorage (Draft) or Fallback

        const saved = localStorage.getItem('currentClientDraft');
        if (saved) {
            try {
                setClient(JSON.parse(saved));
            } catch (e) {
                console.error(e);
            }
        } else {
            // Default blank fallback
            setClient({
                ...initialClientState,
                firstName: 'Νέος',
                lastName: 'Πελάτης'
            });
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
                            {/* Assuming 'cn' is a utility function for class names, if not defined, this will cause an error */}
                            {/* For this example, I'll assume it's available or replace with direct class names if not */}
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

                    <div className="text-right text-sm text-gray-500">
                        <div className="font-medium text-gray-900 mb-1">Επόμενο Ραντεβού</div>
                        {/* Mock data for now, real app would query appointments */}
                        <div>-</div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

                <div className="min-h-[400px]">
                    {renderTabContent()}
                </div>
            </div>
        </AppLayout>
    );
}
