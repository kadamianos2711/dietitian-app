import { ClientFormData } from '@/types/client';
import { User, Phone, Calendar, Mail, Briefcase } from 'lucide-react';
import { differenceInYears, parseISO } from 'date-fns';

interface Props {
    client: ClientFormData;
}

export default function ProfileHeader({ client }: Props) {
    const getAge = (birthDate: string) => {
        if (!birthDate) return '-';
        return differenceInYears(new Date(), parseISO(birthDate));
    };

    const age = getAge(client.birthDate);

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl border border-green-200">
                    {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {client.firstName} {client.lastName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                        {client.gender && (
                            <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {client.gender === 'male' ? 'Άνδρας' : client.gender === 'female' ? 'Γυναίκα' : 'Άλλο'}
                            </span>
                        )}
                        <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {age !== '-' ? `${age} ετών` : '-'}
                        </span>
                        <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {client.phone}
                        </span>
                        {client.email && (
                            <span className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {client.email}
                            </span>
                        )}
                        {client.occupation && (
                            <span className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-1" />
                                {client.occupation}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Badge (Mock) */}
            <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Ενεργός
            </span>
        </div>
    );
}
