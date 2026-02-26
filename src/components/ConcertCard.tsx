import React from 'react';
import { Concert, CURRENCIES } from '../types';
import { MapPin, Ticket, Armchair, ChevronRight, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface ConcertCardProps {
  concert: Concert;
  onClick: (concert: Concert) => void;
}

const getCurrencySymbol = (currencyCode: string) => {
  const found = CURRENCIES.find(c => c.value === currencyCode);
  return found ? found.symbol : '$';
};

const getTicketTypeColor = (type: string) => {
  switch (type) {
    case 'VIP Standing':
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
    case 'VIP Seating':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
    case 'General Standing':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'General Seating':
      return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400';
    default:
      return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';
  }
};

export const ConcertCard: React.FC<ConcertCardProps> = ({ concert, onClick }) => {
  const date = new Date(concert.date);
  const symbol = getCurrencySymbol(concert.currency);
  const ticketColor = getTicketTypeColor(concert.ticketType);

  const formattedPrice = concert.currency === 'KRW' || concert.currency === 'JPY'
    ? concert.price.toLocaleString()
    : concert.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  return (
    <div 
      onClick={() => onClick(concert)}
      className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 active:scale-[0.97] transition-transform cursor-pointer"
    >
      {/* Date Block */}
      <div className="flex-shrink-0 w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400">
        <span className="text-xs font-bold uppercase">{format(date, 'MMM')}</span>
        <span className="text-xl font-black">{format(date, 'dd')}</span>
      </div>
      
      {/* Info */}
      <div className="flex-grow min-w-0">
        {/* Show Title */}
        {concert.title && (
          <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide truncate">
            {concert.title}
          </p>
        )}
        {/* Artist */}
        <h3 className="font-bold text-lg truncate text-zinc-900 dark:text-white leading-tight">
          {concert.artist}
        </h3>

        <div className="flex flex-col gap-1 mt-1">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-sm">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="truncate">{concert.location}</span>
          </div>
          {/* Price, Ticket Type, Seat */}
          <div className="flex items-center gap-2 flex-wrap">
            {concert.price > 0 && (
              <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs">
                <Ticket size={13} className="flex-shrink-0" />
                <span>{symbol}{formattedPrice}</span>
              </div>
            )}
            {concert.ticketType && (
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${ticketColor}`}>
                <Tag size={10} />
                {concert.ticketType}
              </span>
            )}
            {concert.seat && (
              <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs">
                <Armchair size={13} className="flex-shrink-0" />
                <span>{concert.seat}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ChevronRight size={20} className="text-zinc-300 flex-shrink-0" />
    </div>
  );
};
