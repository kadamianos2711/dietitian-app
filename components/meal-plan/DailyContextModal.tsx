import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Check } from 'lucide-react';
import { DailyContext, DailyConditionType, CONDITION_LABELS, EVENT_LABELS, DailyEventTypeType } from '@/types/context';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    dayNumber: number;
    initialContext?: DailyContext;
    onSave: (context: DailyContext) => void;
}

export default function DailyContextModal({ isOpen, onClose, dayNumber, initialContext, onSave }: Props) {
    const [conditions, setConditions] = useState<DailyConditionType[]>([]);
    const [eventType, setEventType] = useState<DailyEventTypeType | ''>('');
    const [eventNote, setEventNote] = useState('');

    useEffect(() => {
        if (isOpen && initialContext) {
            setConditions(initialContext.conditions || []);
            setEventType(initialContext.event?.type || '');
            setEventNote(initialContext.event?.note || '');
        } else if (isOpen) {
            setConditions([]);
            setEventType('');
            setEventNote('');
        }
    }, [isOpen, initialContext]);

    const toggleCondition = (key: DailyConditionType) => {
        setConditions(prev => 
            prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
        );
    };

    const handleSave = () => {
        onSave({
            dayIndex: dayNumber - 1,
            conditions,
            event: eventType ? { type: eventType, note: eventNote } : undefined
        });
        onClose();
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={onClose}
                                    >
                                        <X className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Ρυθμίσεις {dayNumber}ης Ημέρας
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Conditions */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-3">Symptom & Context Tags</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {(Object.keys(CONDITION_LABELS) as DailyConditionType[]).map((key) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => toggleCondition(key)}
                                                        className={`flex items-center justify-between px-3 py-2 text-sm rounded-md border text-left transition-colors
                                                            ${conditions.includes(key) 
                                                                ? 'bg-blue-50 border-blue-500 text-blue-700' 
                                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                                    >
                                                        <span>{CONDITION_LABELS[key]}</span>
                                                        {conditions.includes(key) && <Check className="w-4 h-4 text-blue-600" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Event */}
                                        <div className="border-t pt-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-3">Γεγονός Ημέρας (Προαιρετικό)</h4>
                                            <select
                                                value={eventType}
                                                onChange={(e) => setEventType(e.target.value as DailyEventTypeType)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            >
                                                <option value="">-- Κανένα γεγονός --</option>
                                                {(Object.keys(EVENT_LABELS) as DailyEventTypeType[]).map((key) => (
                                                    <option key={key} value={key}>{EVENT_LABELS[key]}</option>
                                                ))}
                                            </select>

                                            {eventType && (
                                                <input
                                                    type="text"
                                                    value={eventNote}
                                                    onChange={(e) => setEventNote(e.target.value)}
                                                    placeholder="Σημείωση (π.χ. Ταβέρνα το βράδυ)"
                                                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        onClick={onClose}
                                    >
                                        Ακύρωση
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                        onClick={handleSave}
                                    >
                                        Αποθήκευση
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
