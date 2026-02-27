import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import { api } from '../api';

interface CheckInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const questions = [
    { id: 'q_sleep_issue', text: 'I had trouble falling or staying asleep' },
    { id: 'q_energy', text: 'I felt low energy or tired without reason' },
    { id: 'q_interest', text: 'I lost interest in things I usually enjoy' },
    { id: 'q_focus', text: 'I found it hard to concentrate on tasks' },
    { id: 'q_anxiety', text: 'I felt nervous, anxious, or on edge' },
    { id: 'q_social', text: 'I avoided social interaction' },
    { id: 'q_routine', text: 'My daily routine felt disturbed' },
    { id: 'q_phone', text: 'I overused my phone to distract myself' },
    { id: 'q_motivation', text: 'I felt unmotivated to start simple tasks' },
    { id: 'q_overwhelm', text: 'I felt overwhelmed by small problems' },
];

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleAnswer = (score: number) => {
        const currentQ = questions[step];
        setAnswers(prev => ({ ...prev, [currentQ.id]: score }));

        if (step < questions.length - 1) {
            setStep(prev => prev + 1);
        } else {
            submitCheckIn({ ...answers, [currentQ.id]: score });
        }
    };

    const submitCheckIn = async (finalAnswers: Record<string, number>) => {
        setLoading(true);
        try {
            await api.submitCheckIn(finalAnswers);
            onComplete();
            onClose();
        } catch (error) {
            console.error("Failed to submit check-in", error);
            alert("Failed to submit check-in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const currentQuestion = questions[step];
    const progress = ((step + 1) / questions.length) * 100;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-card-dark w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800"
                >
                    {/* Header */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Clinical Check-in</h3>
                            <p className="text-xs text-slate-500">Step {step + 1} of {questions.length}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <Icon name="close" className="text-slate-500" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 bg-slate-100 dark:bg-slate-800">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    {/* Question Content */}
                    <div className="p-8 text-center">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 leading-relaxed">
                                    {currentQuestion.text}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: 'Never', score: 0, color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
                                        { label: 'Several Days', score: 1, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' },
                                        { label: 'More than half', score: 2, color: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200' },
                                        { label: 'Nearly every day', score: 3, color: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.score}
                                            disabled={loading}
                                            onClick={() => handleAnswer(opt.score)}
                                            className={`p-4 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${opt.color} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
