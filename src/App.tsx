import { useState, useEffect, useMemo } from 'react';
import { Concert } from './types';
import { ConcertCard } from './components/ConcertCard';
import { ConcertForm } from './components/ConcertForm';
import { TabNavigation } from './components/TabNavigation';
import { Music, Plus, Search, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { saveConcert, deleteConcert, subscribeToConcerts } from './firebase';

export function App() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [syncStatus, setSyncStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  // Subscribe to Firebase real-time updates
  useEffect(() => {
    setSyncStatus('loading');
    const unsubscribe = subscribeToConcerts((data) => {
      setConcerts(data);
      setSyncStatus('connected');
    });

    return () => unsubscribe();
  }, []);

  const sortedConcerts = useMemo(() => {
    return [...concerts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [concerts]);

  const filteredConcerts = useMemo(() => {
    const now = new Date();
    return sortedConcerts.filter(concert => {
      const concertDate = new Date(concert.date);
      const isCorrectTab = activeTab === 'upcoming' 
        ? concertDate >= now 
        : concertDate < now;
      
      const q = searchQuery.toLowerCase();
      const matchesSearch = concert.artist.toLowerCase().includes(q) ||
                            concert.location.toLowerCase().includes(q) ||
                            (concert.title && concert.title.toLowerCase().includes(q));
      
      return isCorrectTab && matchesSearch;
    });
  }, [sortedConcerts, activeTab, searchQuery]);

  const handleAddConcert = async (data: Omit<Concert, 'id'>) => {
    const newConcert: Concert = {
      ...data,
      id: crypto.randomUUID()
    };
    try {
      await saveConcert(newConcert);
      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to save concert:', err);
      setSyncStatus('error');
    }
  };

  const handleUpdateConcert = async (data: Omit<Concert, 'id'>) => {
    if (!editingConcert) return;
    const updated: Concert = { ...data, id: editingConcert.id };
    try {
      await saveConcert(updated);
      setEditingConcert(null);
    } catch (err) {
      console.error('Failed to update concert:', err);
      setSyncStatus('error');
    }
  };

  const handleDeleteConcert = async (id: string) => {
    if (confirm('Are you sure you want to remove this concert from your list?')) {
      try {
        await deleteConcert(id);
        setEditingConcert(null);
      } catch (err) {
        console.error('Failed to delete concert:', err);
        setSyncStatus('error');
      }
    }
  };

  const handleEditClick = (concert: Concert) => {
    setEditingConcert(concert);
  };

  const upcomingCount = useMemo(() => {
    const now = new Date();
    return concerts.filter(c => new Date(c.date) >= now).length;
  }, [concerts]);

  const pastCount = useMemo(() => {
    const now = new Date();
    return concerts.filter(c => new Date(c.date) < now).length;
  }, [concerts]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-xl pt-12 px-6 pb-4">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-3xl font-black tracking-tight">
            {activeTab === 'upcoming' ? 'Concerts' : 'Memories'}
          </h1>
          <div className="flex items-center gap-3">
            {/* Sync Status Indicator */}
            <div className="flex items-center gap-1.5 text-xs">
              {syncStatus === 'loading' && (
                <span className="flex items-center gap-1 text-amber-500">
                  <Loader2 size={14} className="animate-spin" />
                  Syncing
                </span>
              )}
              {syncStatus === 'connected' && (
                <span className="flex items-center gap-1 text-green-500">
                  <Cloud size={14} />
                  Synced
                </span>
              )}
              {syncStatus === 'error' && (
                <span className="flex items-center gap-1 text-red-500">
                  <CloudOff size={14} />
                  Offline
                </span>
              )}
            </div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center transition-colors hover:bg-indigo-200"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <p className="text-sm text-zinc-400 mb-4">
          {activeTab === 'upcoming' 
            ? `${upcomingCount} upcoming concert${upcomingCount !== 1 ? 's' : ''}`
            : `${pastCount} concert memor${pastCount !== 1 ? 'ies' : 'y'}`
          }
        </p>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search artists or venues..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-200/50 dark:bg-zinc-900/50 border-none rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-400"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-4">
        {syncStatus === 'loading' ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400">
            <Loader2 size={40} className="animate-spin text-indigo-500 mb-4" />
            <p className="text-lg font-medium">Loading your concerts...</p>
            <p className="text-sm">Connecting to Firebase</p>
          </div>
        ) : filteredConcerts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredConcerts.map(concert => (
              <ConcertCard 
                key={concert.id} 
                concert={concert} 
                onClick={handleEditClick} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4">
              <Music size={32} />
            </div>
            <p className="text-lg font-medium">No concerts found</p>
            <p className="text-sm">
              {searchQuery ? 'Try a different search' : 'Tap + to add your first concert!'}
            </p>
          </div>
        )}
      </main>

      {/* Navigation */}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onAddClick={() => setIsFormOpen(true)}
      />

      {/* Modals */}
      {isFormOpen && (
        <ConcertForm 
          onSubmit={handleAddConcert} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
      
      {editingConcert && (
        <ConcertForm 
          initialData={editingConcert}
          onSubmit={handleUpdateConcert} 
          onCancel={() => setEditingConcert(null)}
          onDelete={handleDeleteConcert}
        />
      )}
    </div>
  );
}
