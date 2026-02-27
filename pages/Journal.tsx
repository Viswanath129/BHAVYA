import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Mood } from '../types';
import { api } from '../api';

const MoodButton: React.FC<{ mood: Mood, icon: string, label: string, selected: boolean, onClick: () => void }> = ({ mood, icon, label, selected, onClick }) => (
    <button
        onClick={onClick}
        className={`group flex flex-col items-center gap-2 transition-all duration-300 ${selected ? 'scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'}`}
    >
        <div className={`size-14 rounded-2xl shadow-sm border flex items-center justify-center transition-all ${selected ? 'bg-white dark:bg-card-dark border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-card-dark border-slate-200 dark:border-slate-700'}`}>
            <Icon name={icon} className={`text-3xl transition-colors ${selected ? 'text-primary' : 'text-slate-400'}`} filled={selected} />
        </div>
        <span className={`text-xs font-bold ${selected ? 'text-primary' : 'text-slate-400'}`}>{label}</span>
    </button>
);

const HistoryCard: React.FC<{ date: string, title: string, preview: string, moodIcon: string, moodColor: string }> = ({ date, title, preview, moodIcon, moodColor }) => (
    <div className="bg-white dark:bg-card-dark border border-slate-100 dark:border-slate-700 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{date}</span>
            <Icon name={moodIcon} className={`text-sm ${moodColor}`} filled />
        </div>
        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">{title}</p>
        <p className="text-xs text-slate-400 line-clamp-2">{preview}</p>
    </div>
);

export const Journal: React.FC = () => {
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [content, setContent] = useState("");
    const [entries, setEntries] = useState<any[]>([]);

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        try {
            const data = await api.getJournalEntries();
            setEntries(data);
        } catch (err) {
            console.error("Failed to load journal", err);
        }
    };

    const handleSave = async () => {
        if (!selectedMood && !content) return;
        try {
            await api.createJournalEntry({
                mood: selectedMood || "neutral",
                content: content,
                title: "Journal Entry"
            });
            setContent("");
            setSelectedMood(null);
            loadEntries();
            alert("Entry Saved!");
        } catch (err) {
            console.error("Failed to save", err);
            alert("Failed to save entry.");
        }
    };

    return (
        <div className="flex flex-1 h-[calc(100vh-theme(spacing.20))] lg:h-screen overflow-hidden">
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark relative">
                <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-8 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <Icon name="schedule" className="text-sm" />
                            <span className="hidden md:inline">{new Date().toLocaleDateString()}</span>
                            <span className="md:hidden">Today</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            className="bg-primary hover:bg-primary-hover text-background-dark font-bold px-6 py-2 rounded-lg transition-all shadow-lg shadow-primary/20 text-sm"
                        >
                            Finish Entry
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 lg:p-12 flex flex-col items-center">
                    <div className="w-full max-w-3xl">
                        <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h2 className="text-2xl lg:text-3xl font-light text-slate-900 dark:text-white mb-8">How are you feeling right now?</h2>
                            <div className="flex justify-center gap-3 sm:gap-6 lg:gap-8">
                                <MoodButton mood={Mood.JOYFUL} icon="sentiment_very_satisfied" label="Joyful" selected={selectedMood === Mood.JOYFUL} onClick={() => setSelectedMood(Mood.JOYFUL)} />
                                <MoodButton mood={Mood.CALM} icon="sentiment_satisfied" label="Calm" selected={selectedMood === Mood.CALM} onClick={() => setSelectedMood(Mood.CALM)} />
                                <MoodButton mood={Mood.NEUTRAL} icon="sentiment_neutral" label="Neutral" selected={selectedMood === Mood.NEUTRAL} onClick={() => setSelectedMood(Mood.NEUTRAL)} />
                                <MoodButton mood={Mood.LOW} icon="sentiment_dissatisfied" label="Low" selected={selectedMood === Mood.LOW} onClick={() => setSelectedMood(Mood.LOW)} />
                                <MoodButton mood={Mood.ANXIOUS} icon="sentiment_extremely_dissatisfied" label="Anxious" selected={selectedMood === Mood.ANXIOUS} onClick={() => setSelectedMood(Mood.ANXIOUS)} />
                            </div>
                        </div>

                        <div className="relative min-h-[400px]">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-full min-h-[400px] bg-transparent text-lg lg:text-xl leading-relaxed font-light text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 border-none resize-none focus:ring-0 p-0"
                                placeholder="Write what's on your mind..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar (History) */}
            <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-card-dark/50 backdrop-blur-md hidden xl:flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        Past Entries
                        <Icon name="filter_list" className="text-slate-400 cursor-pointer hover:text-primary transition-colors" />
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Render Real Entries */}
                    {entries.map((entry: any) => (
                        <HistoryCard
                            key={entry.id}
                            date={new Date(entry.timestamp).toLocaleDateString()}
                            title={entry.title || "Entry"}
                            preview={entry.content}
                            moodIcon="sentiment_satisfied"
                            moodColor="text-primary"
                        />
                    ))}

                    {entries.length === 0 && (
                        <div className="text-center text-slate-400 text-sm mt-10">No entries yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};