'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ClientFormData, initialClientState } from '@/types/client';
import { ChevronRight, ChevronLeft, Save, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

// We will import steps here as we build them
import Step1_Personal from './steps/Step1_Personal';
import Step2_Health from './steps/Step2_Health';
import Step3_Habits from './steps/Step3_Habits';
import Step4_Diet from './steps/Step4_Diet';
import Step5_Activity from './steps/Step5_Activity';
import Step6_Goals from './steps/Step6_Goals';
import Step7_Review from './steps/Step7_Review';
import Step8_Financial from './steps/Step8_Financial';

export default function ClientWizard() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const mode = searchParams.get('mode') === 'client' ? 'client' : 'dietitian';
    const isDietitian = mode === 'dietitian';

    const stepParam = searchParams.get('step');
    const [currentStep, setCurrentStep] = useState(stepParam ? parseInt(stepParam) : 1);
    const [formData, setFormData] = useState<ClientFormData>(initialClientState);
    const [showErrors, setShowErrors] = useState(false);

    // Total steps: 8 for Dietitian, 7 for Client (Review is 7, Financial is 8)
    const totalSteps = isDietitian ? 8 : 7;

    const editId = searchParams.get('editId');

    // ... (useEffect for data loading remains same) ...

    // Save to localStorage on change
    useEffect(() => {
        // Only save draft if NOT editing an existing client (editId is null)
        if (!editId) {
            localStorage.setItem('currentClientDraft', JSON.stringify(formData));
        }
    }, [formData, editId]);

    const updateFormData = (updates: Partial<ClientFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        if (isStepValid()) {
            setShowErrors(false);
            if (currentStep < totalSteps) {
                setCurrentStep(prev => prev + 1);
                window.scrollTo(0, 0);
            }
        } else {
            setShowErrors(true);
            // Optionally scroll to top to show errors if needed
            window.scrollTo(0, 0);
        }
    };

    const isStepValid = () => {
        if (currentStep === 1) {
            // Require basic info for step 1
            const { firstName, lastName, fathersName, birthDate, gender, phone, email } = formData;
            // Simple truthy check for strings
            return !!(firstName && lastName && fathersName && birthDate && gender && phone && email);
        }
        return true; 
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const method = editId ? 'PUT' : 'POST';
            const payload = editId ? { ...formData, id: editId } : formData;

            const res = await fetch('/api/clients', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json();
                console.error('Server Error:', errData);
                throw new Error(errData.error || 'Failed to save');
            }

            const savedClient = await res.json();
            
            // Clear draft
            if (!editId) localStorage.removeItem('currentClientDraft');

            // Redirect logic
            if (isDietitian) {
                if (editId) {
                    window.location.href = `/clients/${editId}`;
                } else {
                    router.push('/clients');
                }
            } else {
                alert('Ευχαριστούμε! Τα στοιχεία στάλθηκαν στον διαιτολόγο.');
            }
        } catch (error) {
            console.error(error);
            alert('Σφάλμα κατά την αποθήκευση. Παρακαλώ δοκιμάστε ξανά.');
        } finally {
            setIsSaving(false);
        }
    };

    const copyLink = () => {
        const url = `${window.location.origin}/clients/new?mode=client`;
        navigator.clipboard.writeText(url);
        alert('Ο σύνδεσμος αντιγράφηκε! Στείλτε τον στον πελάτη.');
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1_Personal data={formData} update={updateFormData} showErrors={showErrors} />;
            case 2: return <Step2_Health data={formData} update={updateFormData} />;
            case 3: return <Step3_Habits data={formData} update={updateFormData} />;
            case 4: return <Step4_Diet data={formData} update={updateFormData} />;
            case 5: return <Step5_Activity data={formData} update={updateFormData} />;
            case 6: return <Step6_Goals data={formData} update={updateFormData} />;
            case 7: return <Step7_Review data={formData} />;
            case 8: return isDietitian ? <Step8_Financial data={formData} update={updateFormData} /> : null;
            default: return null;
        }
    };

    return (
        <div className={cn("max-w-4xl mx-auto py-8 px-4", !isDietitian && "mt-0")}>

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {editId ? 'Επεξεργασία Πελάτη' : (isDietitian ? 'Νέος Πελάτης' : 'Φόρμα Στοιχείων')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isDietitian
                            ? 'Συμπληρώστε τα στοιχεία ή στείλτε το link στον πελάτη.'
                            : 'Παρακαλώ συμπληρώστε τα στοιχεία σας για τη δημιουργία του προγράμματος.'}
                    </p>
                </div>

                {isDietitian && (
                    <button
                        onClick={copyLink}
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200"
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Αντιγραφή link πελάτη
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="mb-8 relative">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-300 ease-out"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                </div>
                <div className="mt-2 text-sm text-gray-500 text-right">
                    Βήμα {currentStep} από {totalSteps}
                </div>
            </div>

            {/* Step Content */}
            <div className="mb-8">
                {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={cn(
                        "inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed",
                        currentStep === 1 && "invisible"
                    )}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Προηγούμενο
                </button>

                <div className="flex gap-4">
                    {/* Show "Next" button if not last step */}
                    {currentStep < totalSteps && (
                        <button
                            onClick={nextStep}
                            className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Επόμενο
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    )}

                    {/* Show "Save" button if last step OR editing */}
                    {(currentStep === totalSteps || editId) && (
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className={cn(
                                "inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed",
                                editId && currentStep < totalSteps && "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" 
                            )}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Αποθήκευση...' : (editId ? 'Αποθήκευση Αλλαγών' : (isDietitian ? 'Αποθήκευση Πελάτη' : 'Αποστολή στον Διαιτολόγο'))}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
