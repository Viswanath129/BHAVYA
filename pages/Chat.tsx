import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../components/Icon';
import { api } from '../api';

const Message = ({ text, time, sender }: { text: string, time: string, sender: 'user' | 'ai' }) => (
    <div className={`flex items-end gap-3 ${sender === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
        <div className={`size-8 rounded-full shrink-0 flex items-center justify-center border shadow-sm overflow-hidden ${sender === 'ai' ? 'bg-primary/10 border-primary/20' : 'bg-slate-200 border-slate-300'}`}>
            {sender === 'ai' ? <Icon name="auto_awesome" className="text-primary text-sm" /> : <img src="https://picsum.photos/id/64/100/100" className="w-full h-full object-cover" alt="User" />}
        </div>
        <div className={`flex flex-col gap-1 max-w-[85%] lg:max-w-[75%] ${sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`p-4 md:p-5 rounded-3xl border shadow-sm text-[15px] md:text-base leading-relaxed relative group transition-all hover:shadow-md ${sender === 'ai'
                ? 'bg-white dark:bg-card-dark border-slate-100 dark:border-slate-800 rounded-bl-none text-slate-800 dark:text-slate-200'
                : 'bg-primary text-slate-900 border-primary/20 rounded-br-none font-medium'
                }`}>
                <p>{text}</p>
            </div>
            <span className="text-[10px] text-slate-400 font-bold px-1 opacity-0 group-hover:opacity-100 transition-opacity">{time}</span>
        </div>
    </div>
);

interface ChatMessage {
    text: string;
    sender: 'user' | 'ai';
    time: string;
}

export const Chat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { text: "Hello, I'm BHAVYA. How are you feeling right now?", sender: 'ai', time: 'Just now' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() || loading) return;

        const userMsg: ChatMessage = {
            text: inputValue,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setLoading(true);

        try {
            const res = await api.sendChatMessage(userMsg.text);
            const aiMsg: ChatMessage = {
                text: res.response,
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error("Chat Error", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-1 h-[calc(100vh-theme(spacing.20))] lg:h-screen flex-col bg-background-light dark:bg-background-dark relative">
            {/* Chat Header */}
            <header className="h-20 shrink-0 flex items-center justify-between px-6 lg:px-10 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-card-dark/80 backdrop-blur-xl z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center size-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Icon name="spa" className="text-primary" />
                        <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-800"></div>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">BHAVYA Wellness AI</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Online</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-4">
                    <div className="flex justify-center my-4">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">Today</span>
                    </div>

                    {messages.map((m, i) => (
                        <Message key={i} {...m} />
                    ))}

                    {loading && (
                        <div className="flex items-center gap-2 text-slate-400 text-sm ml-12">
                            <span className="animate-bounce">●</span>
                            <span className="animate-bounce delay-100">●</span>
                            <span className="animate-bounce delay-200">●</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 lg:p-8 pt-2 shrink-0 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark">
                <div className="max-w-3xl mx-auto relative">
                    <div className="flex items-end gap-2 bg-white dark:bg-card-dark rounded-[28px] border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-black/20 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all p-2 pl-4">

                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            rows={1}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-base py-3.5 px-2 resize-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 min-h-[52px] max-h-32"
                            placeholder="Type how you're feeling..."
                            style={{ scrollbarWidth: 'none' }}
                        />

                        {/* Right Actions */}
                        <div className="flex items-center gap-1 pb-1 pr-1">
                            <button className="size-10 rounded-full text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center">
                                <Icon name="mic" className="text-xl" />
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={loading || !inputValue.trim()}
                                className="size-10 bg-primary text-slate-900 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                <Icon name="arrow_upward" filled className="font-bold text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};