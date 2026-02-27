import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../components/Icon';
import { BreathingTechnique } from '../types';

const techniques: BreathingTechnique[] = [
    { id: 'box', name: 'Box Breathing', description: 'Equal inhale, hold, exhale, and hold phases (4s each).', inhale: 4, hold: 4, exhale: 4, holdOut: 4, color: '#13ecda' },
    { id: '478', name: '4-7-8 Relaxation', description: 'Inhale for 4s, hold for 7s, exhale for 8s.', inhale: 4, hold: 7, exhale: 8, holdOut: 0, color: '#8b5cf6' },
    { id: 'calm', name: 'Calm Breathing', description: 'A natural rhythm for focus and mental clarity.', inhale: 5, hold: 0, exhale: 5, holdOut: 0, color: '#10b981' },
];

export const Meditation: React.FC = () => {
    const [activeTechnique, setActiveTechnique] = useState<BreathingTechnique>(techniques[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold (Empty)'>('Inhale');
    const [timeLeft, setTimeLeft] = useState(4);

    // Animation & Timer Logic
    useEffect(() => {
        if (!isPlaying) {
            setPhase('Inhale');
            setTimeLeft(activeTechnique.inhale);
            return;
        }

        // Reset when starting
        setTimeLeft(activeTechnique.inhale);
        setPhase('Inhale');

        // Internal state trackers to avoid closure staleness without complex refs
        let currentPhase: 'Inhale' | 'Hold' | 'Exhale' | 'Hold (Empty)' = 'Inhale';
        let currentCount = activeTechnique.inhale;

        const timer = setInterval(() => {
            if (currentCount > 1) {
                currentCount--;
                setTimeLeft(currentCount);
            } else {
                // Phase switch logic
                const { inhale, hold = 0, exhale, holdOut = 0 } = activeTechnique;

                switch (currentPhase) {
                    case 'Inhale':
                        if (hold > 0) {
                            currentPhase = 'Hold';
                            currentCount = hold;
                        } else {
                            currentPhase = 'Exhale';
                            currentCount = exhale;
                        }
                        break;
                    case 'Hold':
                        currentPhase = 'Exhale';
                        currentCount = exhale;
                        break;
                    case 'Exhale':
                        if (holdOut > 0) {
                            currentPhase = 'Hold (Empty)';
                            currentCount = holdOut;
                        } else {
                            currentPhase = 'Inhale';
                            currentCount = inhale;
                        }
                        break;
                    case 'Hold (Empty)':
                        currentPhase = 'Inhale';
                        currentCount = inhale;
                        break;
                }
                setPhase(currentPhase);
                setTimeLeft(currentCount);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [isPlaying, activeTechnique]);


    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-theme(spacing.20))] lg:h-screen overflow-hidden">
            {/* Visualizer Area */}
            <div className="flex-1 bg-background-light dark:bg-background-dark flex flex-col items-center justify-center relative p-6">
                <header className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Mindful Breathing</h1>
                        <p className="text-slate-500 italic">"The breath is the bridge which connects life to consciousness."</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => alert("Session History feature coming soon!")}
                            className="px-4 py-2 rounded-lg bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors active:scale-95 duration-200"
                        >
                            <Icon name="history" /> History
                        </button>
                        <button
                            onClick={() => {
                                const elem = document.documentElement;
                                if (!document.fullscreenElement) {
                                    elem.requestFullscreen().catch(err => console.log(err));
                                } else {
                                    document.exitFullscreen();
                                }
                            }}
                            className="px-4 py-2 rounded-lg bg-primary text-slate-900 text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 duration-200"
                        >
                            <Icon name="center_focus_strong" /> Focus Mode
                        </button>
                    </div>
                </header>

                {/* Animation Container */}
                <div className="relative size-96 flex items-center justify-center">
                    {/* Outer Glow Ring */}
                    <motion.div
                        animate={isPlaying ? {
                            scale: [1, 1.5, 1.5, 1, 1], // Inhale, Hold, Exhale, Hold
                            opacity: [0.3, 0.6, 0.6, 0.3, 0.3]
                        } : { scale: 1, opacity: 0.1 }}
                        transition={isPlaying ? {
                            duration: activeTechnique.inhale + (activeTechnique.hold || 0) + activeTechnique.exhale + (activeTechnique.holdOut || 0),
                            times: [
                                0,
                                activeTechnique.inhale / (activeTechnique.inhale + (activeTechnique.hold || 0) + activeTechnique.exhale + (activeTechnique.holdOut || 0)),
                                (activeTechnique.inhale + (activeTechnique.hold || 0)) / (activeTechnique.inhale + (activeTechnique.hold || 0) + activeTechnique.exhale + (activeTechnique.holdOut || 0)),
                                (activeTechnique.inhale + (activeTechnique.hold || 0) + activeTechnique.exhale) / (activeTechnique.inhale + (activeTechnique.hold || 0) + activeTechnique.exhale + (activeTechnique.holdOut || 0)),
                                1
                            ],
                            repeat: Infinity,
                            ease: "easeInOut"
                        } : {}}
                        className="absolute inset-0 rounded-full border-2 border-primary border-dashed"
                    />

                    {/* Main Breathing Circle */}
                    <motion.div
                        animate={isPlaying ? {
                            scale: [1, 1.4, 1.4, 1, 1],
                        } : { scale: 1 }}
                        transition={isPlaying ? {
                            duration: activeTechnique.inhale + (activeTechnique.hold || 0) + activeTechnique.exhale + (activeTechnique.holdOut || 0),
                            times: [
                                0,
                                activeTechnique.inhale / (activeTechnique.inhale + (activeTechnique.hold || 0) + activeTechnique.exhale + (activeTechnique.holdOut || 0)),
                                (activeTechnique.inhale + (activeTechnique.hold || 0)) / (activeTechnique.inhale + (activeTechnique.hold || 0) + activeTechnique.exhale + (activeTechnique.holdOut || 0)),
                                (activeTechnique.inhale + (activeTechnique.hold || 0) + activeTechnique.exhale) / (activeTechnique.inhale + (activeTechnique.hold || 0) + activeTechnique.exhale + (activeTechnique.holdOut || 0)),
                                1
                            ],
                            repeat: Infinity,
                            ease: "easeInOut"
                        } : {}}
                        className="size-64 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(19,236,218,0.3)] backdrop-blur-sm z-10 transition-colors duration-1000"
                    >
                        <span className="text-slate-900 font-light text-xl lg:text-2xl tracking-widest uppercase mb-2">
                            {isPlaying ? phase : 'Ready'}
                        </span>
                        <span className="text-slate-900 font-black text-6xl lg:text-7xl tabular-nums">
                            {isPlaying ? timeLeft : activeTechnique.inhale + 's'}
                        </span>
                    </motion.div>
                </div>

                {/* Controls */}
                <div className="mt-16 flex items-center gap-8">
                    <button className="size-12 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors">
                        <Icon name="replay" className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="size-20 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/30 hover:scale-105 transition-all"
                    >
                        <Icon name={isPlaying ? "pause" : "play_arrow"} className="text-slate-900 text-4xl" filled />
                    </button>
                    <button
                        onClick={() => alert("Volume controls coming soon!")}
                        className="size-12 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors active:scale-95 duration-200"
                    >
                        <Icon name="volume_up" className="text-slate-600 dark:text-slate-300" />
                    </button>
                </div>

                <p className="mt-8 text-sm font-bold tracking-widest text-slate-400 uppercase">{activeTechnique.name}</p>
                <p className="text-slate-400 text-sm mt-2">Clear your mind and calm your nervous system</p>

                {/* Bottom Progress */}
                <div className="absolute bottom-10 w-full max-w-2xl px-6">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                        <span>Session Progress</span>
                        <span className="text-primary">00:00 / 05:00</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="w-[10%] h-full bg-primary rounded-full shadow-[0_0_10px_rgba(19,236,218,0.5)]"></div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-96 bg-white dark:bg-card-dark border-l border-slate-200 dark:border-slate-800 p-8 flex flex-col overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Techniques</h3>
                <div className="space-y-4">
                    {techniques.map(t => (
                        <div
                            key={t.id}
                            onClick={() => { setActiveTechnique(t); setIsPlaying(false); }}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${activeTechnique.id === t.id ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-lg flex items-center justify-center ${activeTechnique.id === t.id ? 'bg-primary text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                        <Icon name={t.id === 'box' ? 'grid_view' : t.id === '478' ? 'dark_mode' : 'spa'} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h4>
                                        {activeTechnique.id === t.id && <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded ml-2 hidden">Active</span>}
                                    </div>
                                </div>
                                {activeTechnique.id === t.id && <span className="text-[10px] font-bold text-primary bg-white dark:bg-slate-800 border border-primary px-2 py-0.5 rounded-full">ACTIVE</span>}
                            </div>
                            <p className="text-xs text-slate-500 mt-2 pl-[52px]">{t.description}</p>
                            <div className="flex gap-2 mt-3 pl-[52px]">
                                <span className="text-[10px] border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-400">5 Min</span>
                                <span className="text-[10px] border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-400">Relaxation</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-8">
                    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Icon name="bolt" className="text-primary" filled />
                            <h4 className="text-xs font-bold uppercase tracking-widest">Weekly Streak</h4>
                        </div>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-5xl font-black">12</span>
                            <span className="text-slate-400 font-medium">days in a row</span>
                        </div>
                        <div className="flex gap-1 h-8">
                            {[1, 2, 3, 4, 5, 6, 7].map(d => (
                                <div key={d} className={`flex-1 rounded-sm ${d <= 5 ? 'bg-primary' : 'bg-slate-700'} ${d === 5 ? 'opacity-100' : 'opacity-80'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};