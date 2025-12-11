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

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ClientFormData>(initialClientState);
    const [showErrors, setShowErrors] = useState(false);

    // Total steps: 8 for Dietitian, 7 for Client (Review is 7, Financial is 8)
    const totalSteps = isDietitian ? 8 : 7;

    // Load data from localStorage on mount (simulating persistence)
    useEffect(() => {
        // Basic persistence key naming - could be improved with IDs
        const savedData = localStorage.getItem('currentClientDraft');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Merge saved data with initial state to ensure new fields (like paymentPlan) exist
                setFormData({ ...initialClientState, ...parsed });
            } catch (e) {
                console.error('Failed to parse saved draft');
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('currentClientDraft', JSON.stringify(formData));
    }, [formData]);

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
            const { firstName, lastName, fathersName, birthDate, gender, phone, email } = formData;
            return firstName && lastName && fathersName && birthDate && gender && phone && email; // All required
        }
        return true; // Other steps valid for now or have their own logic
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = () => {
        // Simulate API call
        console.log('Submitting data:', formData);
        alert('Η φόρμα υποβλήθηκε επιτυχώς! (Simulation)');
        // Clear draft
        localStorage.removeItem('currentClientDraft');

        // Redirect logic
        if (isDietitian) {
            router.push('/clients');
        } else {
            // Show success message or redirect to home
            alert('Ευχαριστούμε! Τα στοιχεία στάλθηκαν στον διαιτολόγο.');
            // router.push('/'); // Or stay here showing a success state
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
                        {isDietitian ? 'Νέος Πελάτης' : 'Φόρμα Στοιχείων'}
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

                {currentStep === totalSteps ? (
                    <button
                        onClick={handleSubmit}
                        className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isDietitian ? 'Αποθήκευση Πελάτη' : 'Αποστολή στον Διαιτολόγο'}
                    </button>
                ) : (
                    <button
                        onClick={nextStep}
                        className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Επόμενο
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                )}
            </div>
        </div>
    );
}
