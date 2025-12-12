import { ClientFormData } from '@/types/client';
import { User, Phone, Mail, Briefcase, Calendar, Edit } from 'lucide-react';
import { differenceInYears, parseISO, format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Props {
    client: ClientFormData;
}

export default function TabProfile({ client }: Props) {
    const router = useRouter();

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        try {
            return format(parseISO(dateStr), 'dd/MM/yyyy');
        } catch (e) {
            return dateStr;
        }
    };

    const getAge = (birthDate: string) => {
        if (!birthDate) return '-';
        return differenceInYears(new Date(), parseISO(birthDate));
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-600" />
                    Προσωπικά Στοιχεία
                </h2>
                <button
                    onClick={() => window.location.href = `/clients/new?editId=${client.id}&step=1`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                    <Edit className="w-4 h-4 mr-1" />
                    Επεξεργασία
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

                {/* Left Column */}
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-500 block mb-1">Ονοματεπώνυμο</label>
                        <div className="text-lg font-medium text-gray-900">{client.firstName} {client.lastName}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-500 block mb-1">Ημ. Γέννησης</label>
                            <div className="text-gray-900 flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                {formatDate(client.birthDate)}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 block mb-1">Ηλικία</label>
                            <div className="text-gray-900">{getAge(client.birthDate)} ετών</div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500 block mb-1">Φύλο</label>
                        <div className="text-gray-900">
                            {client.gender === 'male' ? 'Άνδρας' : client.gender === 'female' ? 'Γυναίκα' : 'Άλλο'}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-500 block mb-1">Τηλέφωνο</label>
                        <div className="text-gray-900 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {client.phone}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500 block mb-1">Email</label>
                        <div className="text-gray-900 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {client.email || '-'}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500 block mb-1">Επάγγελμα</label>
                        <div className="text-gray-900 flex items-center">
                            <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                            {client.occupation || '-'}
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Ημερομηνία Πρώτης Επίσκεψης</label>
                    <div className="text-gray-900">
                        {format(new Date(), 'dd/MM/yyyy')} {/* Mock date */}
                    </div>
                </div>
            </div>
        </div>
    );
}
