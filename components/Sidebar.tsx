import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { api } from '../api';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [userName, setUserName] = useState("Alex Rivers");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        if (data.full_name) setUserName(data.full_name);
        else if (data.username) setUserName(data.username);
      } catch (e) {
        // silent fail, keep default
      }
    };
    fetchProfile();
  }, [location.pathname]); // Refresh on navigation (e.g. coming back from profile save)

  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/' },
    { label: 'Risk Insights', icon: 'shield_with_heart', path: '/risk' },
    { label: 'Journal', icon: 'edit_note', path: '/journal' },
    { label: 'Meditation', icon: 'self_improvement', path: '/meditation' },
    { label: 'Support', icon: 'support_agent', path: '/support' },
    { label: 'Chat', icon: 'chat_bubble', path: '/chat' },
    { label: 'Affective Engine', icon: 'psychology', path: '/affective' }, // New Module
  ];

  return (
    <aside className="w-20 lg:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-card-dark flex flex-col transition-all duration-300 shrink-0 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="size-8 lg:size-10 bg-primary rounded-xl flex items-center justify-center text-white shrink-0">
          <Icon name="spa" className="text-xl lg:text-2xl" />
        </div>
        <div className="hidden lg:block">
          <h1 className="font-bold text-lg tracking-tight dark:text-white">BHAVYA</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Wellness Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-primary/10 text-primary'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-400 hover:text-primary dark:hover:text-primary'
              }`
            }
          >
            <Icon
              name={item.icon}
              className="group-hover:scale-110 transition-transform duration-200"
              filled={location.pathname === item.path}
            />
            <span className="hidden lg:block font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <NavLink to="/profile" className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group">
          <div className="size-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all">
            <img
              alt="Profile"
              src="https://picsum.photos/id/64/100/100"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-xs font-bold truncate dark:text-slate-200 group-hover:text-primary transition-colors">{userName}</p>
            <p className="text-[10px] text-slate-400">Premium Member</p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};