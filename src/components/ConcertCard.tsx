import React from 'react';
import { Concert } from '../types';
import { MapPin, Ticket, Armchair, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface ConcertCardProps {
  concert: Concert;
  onClick: (concert: Concert) => void;
}

export const ConcertCard: React.FC<ConcertCardProps> = ({ concert, onClick }) => {
  const date = new Date(concert.date);
  
  return (
    <div 
      onClick={() => onClick(concert)}
      className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 active:scale-95 transition-transform cursor-pointer"
    >
      <div className="flex-shrink-0 w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400">
        <span className="text-xs font-bold uppercase">{format(date, 'MMM')}</span>
        <span className="text-xl font-black">{format(date, 'dd')}</span>
      </div>
      
      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-lg truncate text-zinc-900 dark:text-white">{concert.artist}</h3>
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-sm">
            <MapPin size={14} />
            <span className="truncate">{concert.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs">
              <Ticket size={14} />
              <span>${concert.price}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs">
              <Armchair size={14} />
              <span>{concert.seat}</span>
            </div>
          </div>
        </div>
      </div>
      
      <ChevronRight size={20} className="text-zinc-300 flex-shrink-0" />
    </div>
  );
};
