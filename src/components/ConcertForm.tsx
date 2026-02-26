import React, { useState, useEffect } from 'react';
import { Concert, Currency, TicketType, CURRENCIES, TICKET_TYPES } from '../types';
import { X } from 'lucide-react';

interface ConcertFormProps {
  initialData?: Concert | null;
  onSubmit: (concert: Omit<Concert, 'id'>) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

export const ConcertForm: React.FC<ConcertFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    date: new Date().toISOString().slice(0, 16),
    location: '',
    price: '',
    currency: 'KRW' as Currency,
    ticketType: 'General Standing' as TicketType,
    seat: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        artist: initialData.artist,
        date: initialData.date.slice(0, 16),
        location: initialData.location,
        price: initialData.price.toString(),
        currency: initialData.currency || 'KRW',
        ticketType: initialData.ticketType || 'General Standing',
        seat: initialData.seat,
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price) || 0,
      date: new Date(formData.date).toISOString()
    });
  };

  const inputClass = "w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-white";
  const labelClass = "block text-sm font-medium text-zinc-500 mb-1";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-950 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">{initialData ? 'Edit Concert' : 'Add Concert'}</h2>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Show Title */}
          <div>
            <label className={labelClass}>Show Title</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className={inputClass}
              placeholder="e.g. WORLD TOUR 2025, THE ERAS TOUR"
            />
          </div>

          {/* Artist / Band */}
          <div>
            <label className={labelClass}>Artist / Band</label>
            <input
              required
              type="text"
              value={formData.artist}
              onChange={e => setFormData({ ...formData, artist: e.target.value })}
              className={inputClass}
              placeholder="Who are you seeing?"
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className={labelClass}>Date & Time</label>
            <input
              required
              type="datetime-local"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Location / Venue */}
          <div>
            <label className={labelClass}>Location / Venue</label>
            <input
              required
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className={inputClass}
              placeholder="Where is the magic happening?"
            />
          </div>

          {/* Ticket Type */}
          <div>
            <label className={labelClass}>Ticket Type</label>
            <div className="flex flex-wrap gap-2">
              {TICKET_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, ticketType: type })}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    formData.ticketType === type
                      ? 'bg-indigo-600 text-white shadow-md scale-105'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Currency */}
          <div>
            <label className={labelClass}>Price</label>
            <div className="flex gap-2">
              <select
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value as Currency })}
                className="w-32 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-white appearance-none"
              >
                {CURRENCIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className={`flex-1 ${inputClass}`}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Seat / Section */}
          <div>
            <label className={labelClass}>Seat / Section</label>
            <input
              type="text"
              value={formData.seat}
              onChange={e => setFormData({ ...formData, seat: e.target.value })}
              className={inputClass}
              placeholder="GA, Section 102, Row B..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className={`${inputClass} min-h-[100px]`}
              placeholder="Memories, setlists, parking info..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {initialData && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(initialData.id)}
                className="flex-1 py-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-2xl hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="flex-[2] py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors"
            >
              {initialData ? 'Update Concert' : 'Save Concert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
