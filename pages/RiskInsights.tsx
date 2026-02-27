import React, { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { motion } from 'framer-motion';
import { api } from '../api';

const RiskFactor: React.FC<{ name: string, value: number, percentage: number, type?: 'positive' | 'negative' }> = ({ name, value, percentage, type = 'positive' }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-sm">
            <span className="font-medium dark:text-slate-200">{name}</span>
            <span className={type === 'positive' ? "text-slate-400" : "text-rose-500"}>
                {type === 'positive' ? '+' : '-'}{percentage}% Stability
            </span>
        </div>
        <div className={`w-full h-2.5 rounded-full overflow-hidden ${type === 'positive' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800 flex justify-end'}`}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${type === 'positive' ? 'bg-primary' : 'bg-rose-400'}`}
            />
        </div>
    </div>
);

export const RiskInsights: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.getRiskInsights();
                setData(res);
            } catch (err) {
                console.error("Failed to fetch risk", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center">Analysing patterns...</div>;

    return (
        <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Behavioral Balance</h1>
                    <p className="text-slate-500 text-sm mt-1">Risk analysis and stability scores</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Icon name="calendar_today" className="text-slate-400 text-sm" />
                        <span className="text-xs font-medium dark:text-slate-300">Oct 12 - Oct 19, 2023</span>
                    </div>
                </div>
            </header>

            {/* Top Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Circular Score */}
                <div className="lg:col-span-1 bg-white dark:bg-card-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Balance Score</h3>

                    <div className="relative size-56 flex items-center justify-center">
                        {/* CSS Conic Gradient for the circle */}
                        <div className="absolute inset-0 rounded-full"
                            style={{
                                background: `conic-gradient(#13ecda ${data?.score || 0}%, #e2e8f0 0)`
                            }}
                        ></div>
                        <div className="absolute inset-2 bg-white dark:bg-card-dark rounded-full flex flex-col items-center justify-center">
                            <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{data?.score}</span>
                            <span className="text-slate-400 text-sm font-medium">/ 100</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-tight">
                            {data?.label}
                        </span>
                        <p className="mt-4 text-sm text-slate-500 leading-relaxed px-4">
                            Your behavioral patterns are remarkably stable this week.
                        </p>
                    </div>
                </div>

                {/* Impact Factors */}
                <div className="lg:col-span-2 bg-white dark:bg-card-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold dark:text-white">Risk Impact Factors</h3>
                        <Icon name="info" className="text-slate-400 text-sm cursor-help hover:text-primary transition-colors" />
                    </div>
                    <div className="space-y-8">
                        {data?.factors.map((f: any) => (
                            <RiskFactor key={f.name} name={f.name} value={f.value} percentage={f.percentage} type={f.type} />
                        ))}
                    </div>
                    <p className="mt-8 text-xs text-slate-400 italic">
                        Analysis based on aggregated biometric and behavioral data points over the last 7 days.
                    </p>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                    <div className="size-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center mb-4">
                        <Icon name="insights" />
                    </div>
                    <h4 className="font-bold mb-4 text-slate-900 dark:text-white">Key Changes</h4>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <Icon name="check_circle" className="text-primary text-base mt-0.5" />
                            Earlier wake times (4 days).
                        </li>
                        <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <Icon name="check_circle" className="text-primary text-base mt-0.5" />
                            Reduced evening screen time.
                        </li>
                        <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <Icon name="info" className="text-rose-400 text-base mt-0.5" />
                            Fewer outgoing calls.
                        </li>
                    </ul>
                </div>

                {/* Card 2 */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                    <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <Icon name="psychology" />
                    </div>
                    <h4 className="font-bold mb-4 text-slate-900 dark:text-white">Why This Matters</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Consistent sleep and activity rhythms are strong indicators of psychological resilience. The drop in social outreach may signal a need for mindful connection.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                    <div className="size-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center mb-4">
                        <Icon name="auto_fix_high" />
                    </div>
                    <h4 className="font-bold mb-4 text-slate-900 dark:text-white">Suggestions</h4>
                    <div className="space-y-3">
                        <div className="bg-background-light dark:bg-slate-800 p-3 rounded-lg">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-primary mb-1">Nudge</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Reach out to one friend today.</p>
                        </div>
                        <div className="bg-background-light dark:bg-slate-800 p-3 rounded-lg">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-primary mb-1">Maintain</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Keep the 10:30 PM wind-down.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};