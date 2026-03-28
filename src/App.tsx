import { useState, useEffect, useMemo } from 'react';
import { Concert } from './types';
import { ConcertCard } from './components/ConcertCard';
import { ConcertForm } from './components/ConcertForm';
import { TabNavigation } from './components/TabNavigation';
import { Music, Plus, Search } from 'lucide-react';
import {
  saveConcert,
  deleteConcert,
  subscribeToConcerts,
  signInWithUsername,
  signUpWithUsername,
  SessionUser,
} from './firebase';

const SESSION_STORAGE_KEY = 'concert-tracker-session';

export function App() {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [actionError, setActionError] = useState('');
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!rawSession) return;

    try {
      const parsedSession = JSON.parse(rawSession) as SessionUser;
      if (parsedSession?.userId && parsedSession?.username) {
        setSessionUser(parsedSession);
      }
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  // Subscribe to Firebase Realtime Database
  useEffect(() => {
    if (!sessionUser) {
      setConcerts([]);
      setIsLoaded(false);
      return;
    }

    setIsLoaded(false);
    const unsubscribe = subscribeToConcerts(sessionUser.userId, (data) => {
      setConcerts(data);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [sessionUser]);

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
                            concert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (concert.title && concert.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            concert.ticketType.toLowerCase().includes(searchQuery.toLowerCase());
      
      return isCorrectTab && matchesSearch;
    });
  }, [sortedConcerts, activeTab, searchQuery]);

  const handleAddConcert = async (data: Omit<Concert, 'id'>) => {
    if (!sessionUser) return;

    const newConcert: Concert = {
      ...data,
      id: crypto.randomUUID()
    };
    
    try {
      setActionError('');
      await saveConcert(sessionUser.userId, newConcert.id, newConcert);
      setIsFormOpen(false);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to save concert');
    }
  };

  const handleUpdateConcert = async (data: Omit<Concert, 'id'>) => {
    if (!editingConcert || !sessionUser) return;
    
    const updatedConcert = { ...data, id: editingConcert.id };
    
    try {
      setActionError('');
      await saveConcert(sessionUser.userId, updatedConcert.id, updatedConcert);
      setEditingConcert(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to update concert');
    }
  };

  const handleDeleteConcert = async (id: string) => {
    if (!sessionUser) return;

    if (confirm('Are you sure you want to remove this concert from your list?')) {
      try {
        setActionError('');
        await deleteConcert(sessionUser.userId, id);
        setEditingConcert(null);
      } catch (error) {
        setActionError(error instanceof Error ? error.message : 'Failed to delete concert');
      }
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setAuthError('Please enter username and password');
      return;
    }

    setAuthError('');
    setIsAuthenticating(true);

    try {
      const user = isRegisterMode
        ? await signUpWithUsername(username, password)
        : await signInWithUsername(username, password);

      setSessionUser(user);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      setPassword('');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = () => {
    setSessionUser(null);
    setConcerts([]);
    setIsFormOpen(false);
    setEditingConcert(null);
    setActionError('');
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const handleEditClick = (concert: Concert) => {
    setEditingConcert(concert);
  };

  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight">Concert Tracker</h1>
            <p className="text-zinc-500 mt-2">
              {isRegisterMode ? 'Create an account to save your concerts' : 'Sign in before loading your concerts'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-500 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-500 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter your password"
                autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
              />
            </div>

            {authError && (
              <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {isAuthenticating ? 'Please wait...' : isRegisterMode ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsRegisterMode((prev) => !prev);
              setAuthError('');
            }}
            className="w-full text-sm text-indigo-600 dark:text-indigo-400 font-medium"
          >
            {isRegisterMode ? 'Already have an account? Sign in' : 'No account yet? Create one'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-xl pt-12 px-6 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              {activeTab === 'upcoming' ? 'Concerts' : 'Memories'}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">{sessionUser.username}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSignOut}
              className="px-3 py-2 text-sm rounded-xl bg-zinc-200/70 dark:bg-zinc-900/70 hover:bg-zinc-300/70 transition-colors"
            >
              Sign Out
            </button>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center transition-colors hover:bg-indigo-200"
            >
              <Plus size={24} />
            </button>
          </div>
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
        {actionError && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            {actionError}
          </div>
        )}
        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Music size={32} />
            </div>
            <p className="text-lg font-medium">Loading concerts...</p>
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
