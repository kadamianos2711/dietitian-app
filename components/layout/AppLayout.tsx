import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex flex-col h-screen bg-gray-50 print:bg-white print:h-auto">
            <div className="print:hidden">
                <Header />
            </div>
            <div className="flex flex-1 overflow-hidden print:overflow-visible">
                <div className="print:hidden">
                    <Sidebar />
                </div>
                <main className="flex-1 overflow-y-auto p-6 md:p-8 print:p-0 print:overflow-visible">
                    {children}
                </main>
            </div>
        </div>
    );
}
