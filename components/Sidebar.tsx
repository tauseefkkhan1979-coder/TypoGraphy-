
import React from 'react';
import { AppState } from '../types';

interface SidebarProps {
  current: AppState;
  onNavigate: (state: AppState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ current, onNavigate }) => {
  const items = [
    { state: AppState.HOME, label: 'Dashboard', icon: '🏠' },
    { state: AppState.LEARN, label: 'Learn', icon: '🎓' },
    { state: AppState.TEST, label: 'Typing Test', icon: '⏱️' },
    { state: AppState.AI_GEN, label: 'AI Script Lab', icon: '✨' },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center font-bold text-white text-xl">T</div>
        <h1 className="text-xl font-bold tracking-tight">TypoGraphy <span className="text-sky-400">AI</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        {items.map(item => (
          <button
            key={item.state}
            onClick={() => onNavigate(item.state)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              current === item.state 
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-500 mb-1">PRO TIP</p>
          <p className="text-sm text-slate-300 leading-snug">Don't look at the keyboard. Feel the keys.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
