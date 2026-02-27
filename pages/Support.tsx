import React from 'react';
import { Icon } from '../components/Icon';

const ContactCard = ({ name, role, img, isProfessional = false }: { name: string, role: string, img: string, isProfessional?: boolean }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
            <div className="size-12 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700">
                <img src={img} alt={name} className="w-full h-full object-cover" />
            </div>
            <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{name}</h4>
                <p className="text-xs text-slate-500">{role}</p>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Icon name="call" className="text-base" filled />
            </button>
            <button className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Icon name="chat_bubble" className="text-base" />
            </button>
        </div>
    </div>
);

const HelplineCard = ({ title, desc, phone, color }: { title: string, desc: string, phone: string, color: string }) => (
    <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
         <div className="flex justify-between items-start mb-4">
             <div className={`size-10 rounded-full flex items-center justify-center ${color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-emerald-100 text-emerald-600'}`}>
                 <Icon name={color === 'primary' ? 'crisis_alert' : 'support_agent'} />
             </div>
             <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded uppercase">24/7 Available</span>
         </div>
         <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{title}</h3>
         <p className="text-sm text-slate-500 mb-6 leading-relaxed">{desc}</p>
         <button className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 ${color === 'primary' ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'}`}>
             <Icon name={color === 'primary' ? 'chat' : 'call'} filled />
             {color === 'primary' ? 'Text Now' : phone}
         </button>
    </div>
);

export const Support: React.FC = () => {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
        <header className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">You are not alone.</h1>
            <p className="text-slate-500 dark:text-slate-400">Access immediate help or follow your personalized wellness plan. We're here to support you every step of the way.</p>
        </header>

        {/* Helplines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HelplineCard 
                title="Crisis Text Line" 
                desc="Text HOME to 741741 to connect with a volunteer Crisis Counselor. Free, 24/7 support at your fingertips."
                phone="Text Now"
                color="primary"
            />
            <HelplineCard 
                title="The Samaritans" 
                desc="Providing emotional support to anyone in emotional distress, struggling to cope, or at risk of suicide."
                phone="Call 116 123"
                color="primary" // Reusing primary for style consistency with image, typically emerald though
            />
            <HelplineCard 
                title="The Trevor Project" 
                desc="The leading national organization providing crisis intervention and suicide prevention services to LGBTQ young people."
                phone="Call 1-866-488-7386"
                color="primary"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Coping */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quick Coping Strategies</h3>
                    <button className="text-primary text-sm font-bold">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { title: 'Box Breathing', desc: '4 seconds in, hold, 4 out.', icon: 'air', color: 'bg-cyan-100 text-cyan-600' },
                        { title: '5-4-3-2-1 Grounding', desc: 'Focus on your surroundings.', icon: 'cloud', color: 'bg-blue-100 text-blue-600' },
                        { title: 'Gratitude Journaling', desc: 'List 3 things you\'re thankful for.', icon: 'edit', color: 'bg-purple-100 text-purple-600' },
                        { title: 'Lo-Fi Calm Playlist', desc: 'Soothing sounds for focus.', icon: 'headphones', color: 'bg-rose-100 text-rose-600' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white dark:bg-card-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:border-primary/50 cursor-pointer transition-all">
                             <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${s.color}`}>
                                 <Icon name={s.icon} />
                             </div>
                             <div className="flex-1">
                                 <h4 className="font-bold text-sm text-slate-900 dark:text-white">{s.title}</h4>
                                 <p className="text-xs text-slate-500">{s.desc}</p>
                             </div>
                             <Icon name="chevron_right" className="text-slate-300" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Trusted Contacts */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Trusted Contacts</h3>
                <div className="space-y-3">
                    <ContactCard name="David Miller" role="Close Friend" img="https://picsum.photos/id/1005/100/100" />
                    <ContactCard name="Sarah Chen" role="Sister" img="https://picsum.photos/id/1027/100/100" />
                    <ContactCard name="Dr. Julian Ross" role="Therapist" img="https://picsum.photos/id/1062/100/100" isProfessional />
                    <button className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 text-sm font-bold hover:border-primary hover:text-primary transition-all">
                        + Add New Contact
                    </button>
                </div>
            </div>
        </div>

        {/* Safety Plan */}
        <div className="bg-cyan-50/50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/30 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">My Safety Plan</h3>
                <button className="bg-primary text-slate-900 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm hover:brightness-105 transition-all">
                    <Icon name="edit" className="text-base" /> Edit Plan
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { step: 1, title: 'Warning Signs', items: ['Feeling isolated or withdrawn', 'Change in sleep patterns', 'Irritability and restlessness'] },
                    { step: 2, title: 'Internal Coping', items: ['10 minutes of box breathing', 'Playing with my pet', 'Listening to 90s rock music'] },
                    { step: 3, title: 'Safe Places', items: ['Local Public Library', 'The Coffee Bean on Main St.', 'Community Garden'] }
                ].map((plan, i) => (
                    <div key={i} className="bg-white dark:bg-card-dark p-6 rounded-xl border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-8 rounded-full bg-primary text-slate-900 font-bold flex items-center justify-center text-sm">{plan.step}</div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{plan.title}</h4>
                        </div>
                        <ul className="space-y-3">
                            {plan.items.map((item, idx) => (
                                <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                    <span className="text-primary mt-1.5 size-1.5 rounded-full bg-primary shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};