import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { api } from '../api';

const questions = [
    "I felt calm and peaceful.",
    "I felt nervous or anxious.",
    "I felt energetic and active.",
    "I felt down or depressed.",
    "I was easily annoyed or irritable.",
    "I felt happy and satisfied.",
    "I had trouble concentrating.",
    "I felt hopeful about the future.",
    "I felt lonely or isolated.",
    "I was able to enjoy things I usually enjoy."
];

export default function AffectiveAnalysis() {
    const [step, setStep] = useState(0); // 0: Input, 1: Analyzing, 2: Result
    const [answers, setAnswers] = useState<number[]>(new Array(10).fill(1)); // Default 1 (Sometimes)
    const [result, setResult] = useState<any>(null);

    const handleAnswer = (idx: number, val: number) => {
        const newAns = [...answers];
        newAns[idx] = val;
        setAnswers(newAns);
    };

    const runAnalysis = async () => {
        setStep(1);
        try {
            // Simulate NPU Delay
            await new Promise(r => setTimeout(r, 1500));
            const response = await api.analyzeAffective(answers);
            setResult(response);
            setStep(2);
        } catch (e) {
            console.error(e);
            alert("Analysis failed. Please try again.");
            setStep(0);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Affective Time-Series Engine
                </h1>
                <p className="text-gray-400 mt-2">
                    Powered by NPU Emotion Recognition & Temporal Dynamics Model (EEV)
                </p>
            </motion.div>

            {step === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 shadow-2xl">
                        <h2 className="text-xl font-semibold mb-6">Psychometric Input Interface</h2>
                        <div className="space-y-6">
                            {questions.map((q, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-700/50 pb-4 last:border-0">
                                    <span className="text-lg text-gray-200">{idx + 1}. {q}</span>
                                    <div className="flex gap-2">
                                        {['Never', 'Sometimes', 'Often', 'Always'].map((label, val) => (
                                            <button
                                                key={val}
                                                onClick={() => handleAnswer(idx, val)}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${answers[idx] === val
                                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                    }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={runAnalysis}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/20 active:scale-95 transition-all"
                            >
                                Run Affective Inference
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {step === 1 && (
                <div className="h-[60vh] flex flex-col items-center justify-center">
                    <div className="w-24 h-24 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-8" />
                    <h3 className="text-2xl font-light animate-pulse">Initializing NPU Context...</h3>
                    <p className="text-gray-500 mt-2 font-mono text-sm">Loading snpe_emotion_cnn.dlc</p>
                    <p className="text-gray-500 font-mono text-sm">Extracting 15-dim vectors...</p>
                </div>
            )}

            {step === 2 && result && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-6">
                            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Detected Pattern</h3>
                            <div className="mt-2 text-4xl font-bold text-white">{result.pattern}</div>
                            <div className="mt-1 text-sm text-gray-400">Temporal Dynamics Class</div>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-6">
                            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Risk Index</h3>
                            <div className={`mt-2 text-4xl font-bold ${result.risk_score > 0.6 ? 'text-red-400' : result.risk_score > 0.3 ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                {(result.risk_score * 100).toFixed(0)}%
                            </div>
                            <div className="mt-1 text-sm text-gray-400">Based on negative dominance</div>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-6 flex flex-col justify-center">
                            <button onClick={() => setStep(0)} className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors">
                                Reset Analysis
                            </button>
                        </div>
                    </div>

                    {/* Graph */}
                    {/* Graph */}
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 h-[500px] w-full">
                        <h3 className="text-xl font-semibold mb-6">Emotional Dynamics Timeline (30s Projection)</h3>
                        {result.emotion_timeline && result.emotion_timeline.length > 0 ? (
                            <div className="w-full h-full pb-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={result.emotion_timeline}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                        <XAxis
                                            dataKey="time"
                                            stroke="#9ca3af"
                                            tick={{ fill: '#9ca3af' }}
                                            tickLine={{ stroke: '#9ca3af' }}
                                        />
                                        <YAxis
                                            stroke="#9ca3af"
                                            tick={{ fill: '#9ca3af' }}
                                            tickLine={{ stroke: '#9ca3af' }}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                            itemStyle={{ color: '#e5e7eb' }}
                                        />
                                        <Area type="monotone" dataKey="positive" name="Positive Valence" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#colorPos)" />
                                        <Area type="monotone" dataKey="negative" name="Negative Valence" stroke="#f87171" strokeWidth={2} fillOpacity={1} fill="url(#colorNeg)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                No timeline data available
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
