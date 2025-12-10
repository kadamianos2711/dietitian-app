import { ClientFormData, Gender } from '@/types/client';

interface Props {
    data: ClientFormData;
    update: (data: Partial<ClientFormData>) => void;
}

export default function Step1_Personal({ data, update }: Props) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Όνομα *</label>
                    <input
                        type="text"
                        value={data.firstName}
                        onChange={(e) => update({ firstName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                        required
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Επώνυμο *</label>
                    <input
                        type="text"
                        value={data.lastName}
                        onChange={(e) => update({ lastName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                        required
                    />
                </div>

                {/* Birth Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ημερομηνία Γέννησης</label>
                    <input
                        type="date"
                        value={data.birthDate}
                        onChange={(e) => update({ birthDate: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                    />
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Φύλο *</label>
                    <select
                        value={data.gender}
                        onChange={(e) => update({ gender: e.target.value as Gender })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                    >
                        <option value="">Επιλογή...</option>
                        <option value="male">Άνδρας</option>
                        <option value="female">Γυναίκα</option>
                        <option value="other">Άλλο</option>
                    </select>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Τηλέφωνο *</label>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => update({ phone: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => update({ email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                    />
                </div>

                {/* Occupation */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Επάγγελμα</label>
                    <input
                        type="text"
                        value={data.occupation}
                        onChange={(e) => update({ occupation: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                    />
                </div>
            </div>
        </div>
    );
}
