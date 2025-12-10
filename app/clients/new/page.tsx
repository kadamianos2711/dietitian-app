'use client';

import { Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import ClientWizard from '@/components/wizard/ClientWizard';
import { useSearchParams } from 'next/navigation';

function WizardWrapper() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const isClientMode = mode === 'client';

    // If in client mode, we render just the wizard without the AppLayout (sidebar/header)
    // This requires AppLayout check or rendering conditionally.
    // However, AppLayout usually includes Sidebar. We need a clean layout for clients.

    if (isClientMode) {
        return (
            <main className="min-h-screen bg-gray-50 font-sans">
                <ClientWizard />
            </main>
        );
    }

    // Dietitian mode gets the full dashboard layout
    return (
        <AppLayout>
            <ClientWizard />
        </AppLayout>
    );
}

export default function NewClientPage() {
    return (
        <Suspense fallback={<div>Loading wizard...</div>}>
            <WizardWrapper />
        </Suspense>
    );
}
