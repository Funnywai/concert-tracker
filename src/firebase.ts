import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, remove } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://concert-database-251d9-default-rtdb.firebaseio.com/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Firebase functions for concert data
export const saveConcert = async (concertId: string, concertData: any) => {
  try {
    const concertsRef = ref(database, `concerts/${concertId}`);
    await set(concertsRef, concertData);
    console.log('Concert saved successfully');
  } catch (error) {
    console.error('Error saving concert:', error);
  }
};

export const deleteConcert = async (concertId: string) => {
  try {
    const concertRef = ref(database, `concerts/${concertId}`);
    await remove(concertRef);
    console.log('Concert deleted successfully');
  } catch (error) {
    console.error('Error deleting concert:', error);
  }
};

export const subscribeToConcerts = (callback: (data: any[]) => void) => {
  const concertsRef = ref(database, 'concerts');
  
  onValue(concertsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const concertsArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      callback(concertsArray);
    } else {
      callback([]);
    }
  });
};

export { database };
