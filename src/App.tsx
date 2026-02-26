import { useState, useEffect, useMemo } from 'react';
import { Concert } from './types';
import { ConcertCard } from './components/ConcertCard';
import { ConcertForm } from './components/ConcertForm';
import { TabNavigation } from './components/TabNavigation';
import { Music, Plus, Search } from 'lucide-react';

const STORAGE_KEY = 'concert-tracker-data';

export function App() {
  const [concerts, setConcerts] = useState<Concert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(concerts));
  }, [concerts]);

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
      
      const matchesSearch = concert.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            concert.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return isCorrectTab && matchesSearch;
    });
  }, [sortedConcerts, activeTab, searchQuery]);

  const handleAddConcert = (data: Omit<Concert, 'id'>) => {
    const newConcert: Concert = {
      ...data,
      id: crypto.randomUUID()
    };
    setConcerts(prev => [...prev, newConcert]);
    setIsFormOpen(false);
  };

  const handleUpdateConcert = (data: Omit<Concert, 'id'>) => {
    if (!editingConcert) return;
    setConcerts(prev => prev.map(c => 
      c.id === editingConcert.id ? { ...data, id: c.id } : c
    ));
    setEditingConcert(null);
  };

  const handleDeleteConcert = (id: string) => {
    if (confirm('Are you sure you want to remove this concert from your list?')) {
      setConcerts(prev => prev.filter(c => c.id !== id));
      setEditingConcert(null);
    }
  };

  const handleEditClick = (concert: Concert) => {
    setEditingConcert(concert);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-xl pt-12 px-6 pb-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black tracking-tight">
            {activeTab === 'upcoming' ? 'Concerts' : 'Memories'}
          </h1>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center transition-colors hover:bg-indigo-200"
          >
            <Plus size={24} />
          </button>
        </div>

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
        {filteredConcerts.length > 0 ? (
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
            <p className="text-sm">Time to book some tickets!</p>
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
