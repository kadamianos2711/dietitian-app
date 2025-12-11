'use client';

import Link from 'next/link';

import { AppLayout } from '@/components/layout/AppLayout';
import { Search, UserPlus, Filter, MoreHorizontal, FileText } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Mock data type
type FinancialStatus = 'paid' | 'installments' | 'partial' | 'debt';

interface Client {
    id: string;
    name: string;
    email: string;
    phone?: string; // New field
    status: 'active' | 'inactive' | 'break';
    nextAppointment?: string; // New field
    lastAppointment?: string; // New field
    tags?: string[]; // New field
    package?: string; // New field
    lastVisit: string;
    financialStatus: FinancialStatus;
}

// Mock data
const clients: Client[] = [
    {
        id: '12',
        name: 'Αλέξανδρος Γεωργίου',
        email: 'alex.georgiou@example.com',
        phone: '6945551234',
        status: 'active',
        nextAppointment: '2025-12-15',
        lastAppointment: '2025-12-01',
        tags: ['weight_loss', 'energy'],
        package: '3month',
        lastVisit: '01/12/2025', // Using lastAppointment as lastVisit, formatted for consistency
        financialStatus: 'installments'
    },
    { id: '1', name: 'Γιώργος Παπαδόπουλος', email: 'g.papadopoulos@example.com', status: 'active', lastVisit: '09/12/2025', financialStatus: 'paid' },
    { id: '2', name: 'Μαρία Οικονόμου', email: 'maria.oik@example.com', status: 'active', lastVisit: '08/12/2025', financialStatus: 'installments' },
    { id: '3', name: 'Κώστας Δημητρίου', email: 'k.dimitriou@example.com', status: 'break', lastVisit: '15/11/2025', financialStatus: 'partial' },
    { id: '4', name: 'Ελένη Γεωργίου', email: 'e.georgiou@example.com', status: 'inactive', lastVisit: '01/10/2025', financialStatus: 'debt' },
    { id: '5', name: 'Αλέξανδρος Νικολάου', email: 'alex.nik@example.com', status: 'active', lastVisit: '03/12/2025', financialStatus: 'paid' },
    { id: '6', name: 'Σοφία Ιωάννου', email: 'sofia.ioan@example.com', status: 'active', lastVisit: '05/12/2025', financialStatus: 'installments' },
    { id: '7', name: 'Δημήτρης Κωνσταντίνου', email: 'd.konst@example.com', status: 'active', lastVisit: '07/12/2025', financialStatus: 'debt' },
    { id: '8', name: 'Άννα Βασιλείου', email: 'anna.vas@example.com', status: 'active', lastVisit: '10/12/2025', financialStatus: 'paid' },
    { id: '9', name: 'Νίκος Σαρρής', email: 'n.sarris@example.com', status: 'break', lastVisit: '20/11/2025', financialStatus: 'paid' },
    { id: '10', name: 'Γεωργία Αλεξίου', email: 'g.alexiou@example.com', status: 'active', lastVisit: '11/12/2025', financialStatus: 'partial' },
    { id: '11', name: 'Παύλος Μελάς', email: 'p.melas@example.com', status: 'inactive', lastVisit: '15/09/2025', financialStatus: 'debt' }
];

export default function ClientsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [financialFilter, setFinancialFilter] = useState<string>('all');

    // Filter Logic
    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase());

        // For demo purposes, matching the financial filter string exactly
        // Map UI values to internal values
        const matchesFinancial = financialFilter === 'all' ||
            (financialFilter === 'paid' && client.financialStatus === 'paid') ||
            (financialFilter === 'installments' && client.financialStatus === 'installments') ||
            (financialFilter === 'partial' && client.financialStatus === 'partial') ||
            (financialFilter === 'debt' && client.financialStatus === 'debt');

        return matchesSearch && matchesFinancial;
    });

    // Badge Helper
    const getFinancialBadge = (status: FinancialStatus) => {
        switch (status) {
            case 'paid':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">Εξοφλημένο</span>;
            case 'installments':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">Σε δόσεις (ενήμερος)</span>;
            case 'partial':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500 text-white">Μερικώς πληρωμένο</span>;
            case 'debt':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white">Οφειλή</span>;
            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Πελάτες</h1>
                        <p className="text-sm text-gray-500 mt-1">Διαχείριση πελατολογίου και διαιτολογίων</p>
                    </div>
                    <Link href="/clients/new" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <UserPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Νέος πελάτης
                    </Link>
                </div>

                {/* Filters and Actions Bar */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Αναζήτηση με όνομα ή email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Financial Status Filter */}
                        <div className="relative flex-1 md:flex-none">
                            <select
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                                value={financialFilter}
                                onChange={(e) => setFinancialFilter(e.target.value)}
                            >
                                <option value="all">Οικονομική κατάσταση: Όλες</option>
                                <option value="paid">Εξοφλημένο</option>
                                <option value="installments">Σε δόσεις (ενήμερος)</option>
                                <option value="partial">Μερικώς πληρωμένο</option>
                                <option value="debt">Οφειλή</option>
                            </select>
                        </div>

                        {/* General Status Filter (Placeholder) */}
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <Filter className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                            Κατάσταση
                        </button>
                    </div>
                </div>

                {/* Client Table */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ονοματεπώνυμο
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Κατάσταση
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Τελευταία Επίσκεψη
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Οικονομική κατάσταση
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Ενέργειες</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
                                                        {client.name.charAt(0)}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        <Link href={`/clients/${client.id}`} className="hover:text-green-600 hover:underline">
                                                            {client.name}
                                                        </Link>
                                                    </div>
                                                    <div className="text-sm text-gray-500">{client.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {client.status === 'active' && (
                                                <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                                                    Ενεργός
                                                </span>
                                            )}
                                            {client.status === 'inactive' && (
                                                <span className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-gray-100 rounded-full">
                                                    Ανενεργός
                                                </span>
                                            )}
                                            {client.status === 'break' && (
                                                <span className="inline-flex px-2 text-xs font-semibold leading-5 text-orange-800 bg-orange-100 rounded-full">
                                                    Σε διάλειμμα
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {client.lastVisit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getFinancialBadge(client.financialStatus)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Placeholder */}
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Εμφάνιση <span className="font-medium">1</span> έως <span className="font-medium">{filteredClients.length}</span> από <span className="font-medium">{clients.length}</span> αποτελέσματα
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <span className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                                        Προηγούμενο
                                    </span>
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                                        1
                                    </span>
                                    <span className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                                        Επόμενο
                                    </span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
