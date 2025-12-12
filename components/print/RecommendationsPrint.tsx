import React from 'react';
import { RecommendationData } from '@/data/recommendations';

interface Props {
    clientName: string;
    recommendations: RecommendationData[];
}

export default function RecommendationsPrint({ clientName, recommendations }: Props) {
    return (
        <div className="hidden print:block font-sans text-black">
            <div className="mb-8 border-b border-black pb-4">
                <h1 className="text-2xl font-bold uppercase">Διατροφικες Συστασεις</h1>
                <p className="mt-2 text-sm">Πελάτης: <strong>{clientName}</strong></p>
                <p className="text-sm">Ημερομηνία: {new Date().toLocaleDateString('el-GR')}</p>
            </div>

            <div className="space-y-8">
                {recommendations.map((rec, index) => (
                    <section key={index} className="break-inside-avoid">
                        <h2 className="text-xl font-bold border-b border-gray-400 pb-1 mb-3">{rec.title}</h2>
                        <p className="mb-4 text-sm italic">{rec.description}</p>

                        <div className="mb-4">
                            <h3 className="font-bold text-sm mb-1 uppercase">Γενικες Οδηγιες:</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                {rec.general.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold text-sm mb-1 uppercase border-b border-black inline-block">Τι να προτιματε:</h3>
                                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                                    {rec.allowed.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm mb-1 uppercase border-b border-black inline-block">Τι να αποφευγετε:</h3>
                                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                                    {rec.avoid.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            <div className="mt-12 pt-4 border-t border-black text-center text-xs">
                <p className="font-bold">Δαμιανός Καλτσίδης - Διαιτολόγος / Διατροφολόγος</p>
                <p>Τσιμισκή 123, Θεσσαλονίκη | Τηλ: 2310 123456</p>
            </div>
        </div>
    );
}
