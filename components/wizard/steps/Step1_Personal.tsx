import { ClientFormData, Gender } from '@/types/client';
import { cn } from '@/lib/utils';

interface Props {
    data: ClientFormData;
    update: (data: Partial<ClientFormData>) => void;
    showErrors?: boolean;
}

export default function Step1_Personal({ data, update, showErrors }: Props) {
    const getInputClass = (value: any) => {
        return cn(
            "mt-1 block w-full rounded-md shadow-sm sm:text-sm px-4 py-2 border transition-colors",
            showErrors && !value
                ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
                : "border-gray-300 focus:border-green-500 focus:ring-green-500"
        );
    };

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
                        className={getInputClass(data.firstName)}
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
                        className={getInputClass(data.lastName)}
                        required
                    />
                </div>

                {/* Fathers Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Όνομα Πατρός *</label>
                    <input
                        type="text"
                        className={getInputClass(data.fathersName)}
                        value={data.fathersName || ''}
                        onChange={e => update({ fathersName: e.target.value })}
                        placeholder="π.χ. Δημήτριος"
                        required
                    />
                </div>

                {/* Birth Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ημερομηνία Γέννησης *</label>
                    <input
                        type="date"
                        value={data.birthDate}
                        onChange={(e) => update({ birthDate: e.target.value })}
                        className={getInputClass(data.birthDate)}
                        required
                    />
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Φύλο *</label>
                    <select
                        value={data.gender}
                        onChange={(e) => update({ gender: e.target.value as any })}
                        className={getInputClass(data.gender)}
                        required
                    >
                        <option value="">Επιλογή...</option>
                        <option value="male">Άνδρας</option>
                        <option value="female">Γυναίκα</option>
                        <option value="other">Άλλο</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Τηλέφωνο *</label>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => update({ phone: e.target.value })}
                        className={getInputClass(data.phone)}
                        required
                        placeholder="69XXXXXXXX"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => update({ email: e.target.value })}
                        className={getInputClass(data.email)}
                        placeholder="example@email.com"
                        required
                    />
                </div>
            </div>

            {/* Occupation */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Επάγγελμα</label>
                <input
                    type="text"
                    value={data.occupation}
                    onChange={(e) => update({ occupation: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-4 py-2 border"
                    placeholder="π.χ. Ιδιωτικός Υπάλληλος"
                />
            </div>

            <hr className="border-gray-100 my-4" />

            <h3 className="text-lg font-medium text-gray-900 mb-4">Διεύθυνση Κατοικίας</h3>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Οδός</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-4 py-2 border"
                            value={data.address?.street || ''}
                            onChange={e => update({ address: { ...data.address, street: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Αριθμός</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-4 py-2 border"
                            value={data.address?.number || ''}
                            onChange={e => update({ address: { ...data.address, number: e.target.value } })}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Περιοχή</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-4 py-2 border"
                            value={data.address?.area || ''}
                            onChange={e => update({ address: { ...data.address, area: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Πόλη</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-4 py-2 border"
                            value={data.address?.city || ''}
                            onChange={e => update({ address: { ...data.address, city: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Τ.Κ.</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-4 py-2 border"
                            value={data.address?.postalCode || ''}
                            onChange={e => update({ address: { ...data.address, postalCode: e.target.value } })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
