import React from 'react';
import { Calendar, History, Plus } from 'lucide-react';
import { cn } from '../utils/cn';

interface TabNavigationProps {
  activeTab: 'upcoming' | 'past';
  onTabChange: (tab: 'upcoming' | 'past') => void;
  onAddClick: () => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  onAddClick 
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 pb-safe-area pt-2 px-6 flex justify-around items-center z-40">
      <button 
        onClick={() => onTabChange('upcoming')}
        className={cn(
          "flex flex-col items-center gap-1 py-1 transition-colors",
          activeTab === 'upcoming' ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"
        )}
      >
        <Calendar size={24} />
        <span className="text-[10px] font-medium">Upcoming</span>
      </button>

      <div className="relative -top-6">
        <button 
          onClick={onAddClick}
          className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 active:scale-90 transition-transform"
        >
          <Plus size={32} />
        </button>
      </div>

      <button 
        onClick={() => onTabChange('past')}
        className={cn(
          "flex flex-col items-center gap-1 py-1 transition-colors",
          activeTab === 'past' ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"
        )}
      >
        <History size={24} />
        <span className="text-[10px] font-medium">Memories</span>
      </button>
    </div>
  );
};
