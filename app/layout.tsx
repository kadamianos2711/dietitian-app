import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'greek'] });

export const metadata: Metadata = {
    title: 'Dietitian’s Corner App',
    description: 'Εφαρμογή διαχείρισης διαιτολογικού γραφείου',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="el">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
