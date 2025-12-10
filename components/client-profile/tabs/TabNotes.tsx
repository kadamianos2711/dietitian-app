import { useState, useEffect } from 'react';
import { ClientFormData } from '@/types/client';
import { Save, Plus, FileEdit } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
    client: ClientFormData;
}

interface Note {
    id: string;
    text: string;
    updatedAt: string;
}

export default function TabNotes({ client }: Props) {
    const [notes, setNotes] = useState<Note[]>([
        { id: '1', text: 'Ο πελάτης ανέφερε βελτίωση στα επίπεδα ενέργειας.', updatedAt: new Date().toISOString() }
    ]);
    const [currentNote, setCurrentNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Autosave simulation
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentNote.length > 5) {
                setIsSaving(true);
                setTimeout(() => setIsSaving(false), 800);
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [currentNote]);

    const addNote = () => {
        if (!currentNote.trim()) return;
        const newNote: Note = {
            id: Math.random().toString(36).substr(2, 9),
            text: currentNote,
            updatedAt: new Date().toISOString()
        };
        setNotes([newNote, ...notes]);
        setCurrentNote('');
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* New Note Area */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <FileEdit className="w-5 h-5 mr-2 text-blue-600" />
                    Νέα Σημείωση
                    {isSaving && <span className="ml-4 text-xs font-medium text-gray-400 animate-pulse">Αποθήκευση...</span>}
                </h3>

                <textarea
                    rows={5}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border placeholder-gray-400 resize-none"
                    placeholder="Γράψτε εδώ τις σημειώσεις σας..."
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                />

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={addNote}
                        disabled={!currentNote.trim()}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="-ml-1 mr-2 h-4 w-4" />
                        Προσθήκη Σημείωσης
                    </button>
                </div>
            </div>

            {/* History */}
            <div className="space-y-4">
                {notes.map(note => (
                    <div key={note.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium text-gray-500">
                                {format(new Date(note.updatedAt), 'dd/MM/yyyy HH:mm')}
                            </span>
                            <button className="text-gray-400 hover:text-gray-600">
                                <Save className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap text-sm">{note.text}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}
