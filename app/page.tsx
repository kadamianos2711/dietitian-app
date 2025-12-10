import { AppLayout } from '@/components/layout/AppLayout';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ClientSummary } from '@/components/dashboard/ClientSummary';
import { RecentDiets } from '@/components/dashboard/RecentDiets';
import { DailyNotes } from '@/components/dashboard/DailyNotes';

export default function Home() {
    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Top Row: Quick Actions & Client Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <QuickActions />
                    </div>
                    <div className="lg:col-span-2">
                        <ClientSummary />
                    </div>
                </div>

                {/* Bottom Row: Recent Diets & Daily Notes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                    <div className="lg:col-span-2 h-full">
                        <RecentDiets />
                    </div>
                    <div className="lg:col-span-1 h-full">
                        <DailyNotes />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
