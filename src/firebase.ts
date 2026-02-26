import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, remove, onValue, DataSnapshot } from 'firebase/database';
import { Concert } from './types';

const firebaseConfig = {
  databaseURL: 'https://concert-database-251d9-default-rtdb.firebaseio.com/',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const concertsRef = ref(db, 'concerts');

// Add or update a concert
export function saveConcert(concert: Concert): Promise<void> {
  return set(ref(db, `concerts/${concert.id}`), concert);
}

// Delete a concert
export function deleteConcert(id: string): Promise<void> {
  return remove(ref(db, `concerts/${id}`));
}

// Listen for real-time changes
export function subscribeToConcerts(callback: (concerts: Concert[]) => void): () => void {
  const unsubscribe = onValue(concertsRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    if (data) {
      const concerts: Concert[] = Object.values(data);
      callback(concerts);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}
