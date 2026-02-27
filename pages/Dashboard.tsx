import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts';
import { Icon } from '../components/Icon';
import { motion } from 'framer-motion';
import { api } from '../api';
import { CheckInModal } from '../components/CheckInModal';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [showCheckIn, setShowCheckIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Auto-login for demo purposes if no token
        if (!localStorage.getItem('token')) {
          await api.login('testuser', 'password123');
        }

        const dashboardData = await api.get('/insights/dashboard');
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading BHAVYA insights...</div>;
  }

  // Use fetched data or fallback to empty arrays to prevent crashes
  const sleepData = data?.sleep_data || [];
  const activityData = data?.activity_data || [];
  const interactionData = data?.interaction_data || [];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Behavioral Patterns</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your wellness summary for the last {timeRange === 'Day' ? '24 hours' : timeRange === 'Week' ? '7 days' : '30 days'}.</p>
        </div>
        <div className="flex items-center bg-white dark:bg-card-dark p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
          {['Day', 'Week', 'Month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-6 py-2 rounded-full text-xs font-medium transition-all duration-300 ${timeRange === range ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {range}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCheckIn(true)}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-emerald-400 text-slate-900 font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Icon name="medical_services" /> Clinical Check-in
        </button>
      </header>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-card-dark border border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Icon name="auto_awesome" className="text-8xl text-primary" />
        </div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="mt-1 size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Icon name="psychology" className="text-primary text-xl" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">AI Insight</h3>
            <p className="text-base md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
              Your sleep consistency has improved by <span className="text-primary font-bold">12%</span>, likely due to the consistent 10 PM wind-down routine detected this week. You reported 15% lower stress on active days.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Sleep Rhythm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-card-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Sleep Rhythm</h4>
              <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Consistency Over Time</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-xs text-slate-500 font-medium">Restfulness</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span className="text-xs text-slate-500 font-medium">Time Asleep</span>
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-10" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Line type="monotone" dataKey="sleep" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="score" stroke="#13ecda" strokeWidth={3} dot={{ r: 4, fill: '#13ecda', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Small Charts Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">

          {/* Activity Variance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Activity Variance</h4>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Daily Movement Steps</p>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <Bar dataKey="value" fill="#13ecda" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Interaction Trend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Interaction Trend</h4>
              <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Social Engagement</p>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={interactionData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#13ecda" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#13ecda" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#13ecda" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">What Changed?</h3>
        </div>
        {/* Insight Card 1 */}
        <motion.div
          whileHover={{ y: -4 }}
          className="group bg-white dark:bg-card-dark p-5 rounded-2xl border-l-4 border-primary shadow-sm hover:shadow-md transition-all cursor-default"
        >
          <div className="flex items-center gap-3 mb-2">
            <Icon name="schedule" className="text-primary text-xl" />
            <h5 className="text-sm font-bold text-slate-900 dark:text-white">Screen Time Spike</h5>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Late-night screen time increased by 45 mins on Tuesday and Wednesday. This matches your reported restless sleep.
          </p>
        </motion.div>

        {/* Insight Card 2 */}
        <motion.div
          whileHover={{ y: -4 }}
          className="group bg-white dark:bg-card-dark p-5 rounded-2xl border-l-4 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-default"
        >
          <div className="flex items-center gap-3 mb-2">
            <Icon name="directions_walk" className="text-slate-400 group-hover:text-primary transition-colors text-xl" />
            <h5 className="text-sm font-bold text-slate-900 dark:text-white">Positive Correlation</h5>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Higher activity on Tuesday coincided with lower reported anxiety. Morning walks seem to be your best anchor.
          </p>
        </motion.div>

        {/* Action Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-primary/10 dark:bg-primary/5 p-6 rounded-2xl border border-primary/20 text-center flex flex-col justify-center items-center"
        >
          <div className="size-10 bg-primary rounded-full flex items-center justify-center mb-3 shadow-lg shadow-primary/20">
            <Icon name="lightbulb" className="text-white text-xl" />
          </div>
          <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-2">New Recommendation</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 px-2">
            Try shifting your intense exercise to before 6 PM for better sleep quality.
          </p>
          <button
            onClick={() => alert("We've updated your schedule preferences.")}
            className="px-6 py-2 bg-primary text-slate-900 text-xs font-bold rounded-lg hover:brightness-110 transition-all shadow-sm active:scale-95 duration-200"
          >
            Adjust Routine
          </button>
        </motion.div>
      </div>

      {/* Environmental Context Map Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 p-8 overflow-hidden relative group">
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4 dark:text-white">Environmental Context</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">Your wellness is tied to your surroundings. We noticed your mood dips during high-pollution or noisy days in your current location.</p>
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current City</span>
                  <span className="text-lg font-medium text-slate-900 dark:text-white">Copenhagen</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Air Quality</span>
                  <span className="text-lg font-medium text-primary">Good (12)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Future Risk Prediction */}
        {data?.future_risk && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Icon name="psychology_alt" className="text-9xl text-white" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full bg-primary text-slate-900 text-[10px] font-black uppercase tracking-widest">
                    AI Prediction
                  </span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    +3 Days Horizon
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {data.future_risk.score}% Risk Probability
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg">
                  {data.future_risk.prediction}
                </p>
              </div>
              <div className="mt-8">
                <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full" style={{ width: `${data.future_risk.score}%` }}></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Stability</span>
                  <span>High Risk</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <CheckInModal
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        onComplete={() => {
          alert("Check-in complete! Your risk prediction model has been updated.");
          window.location.reload();
        }}
      />
    </div>
  );
};