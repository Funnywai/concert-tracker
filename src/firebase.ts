import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, remove, get } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://concert-database-251d9-default-rtdb.firebaseio.com/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

type UserRecord = {
  username: string;
  password: string;
  createdAt: string;
};

export type SessionUser = {
  userId: string;
  username: string;
};

const normalizeUserId = (username: string) => {
  return username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
};

export const signUpWithUsername = async (username: string, password: string): Promise<SessionUser> => {
  const normalizedUsername = username.trim();
  const userId = normalizeUserId(normalizedUsername);
  const userRef = ref(database, `users/${userId}/credentials`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    throw new Error('Username already exists');
  }

  const payload: UserRecord = {
    username: normalizedUsername,
    password,
    createdAt: new Date().toISOString(),
  };

  await set(userRef, payload);
  return { userId, username: normalizedUsername };
};

export const signInWithUsername = async (username: string, password: string): Promise<SessionUser> => {
  const normalizedUsername = username.trim();
  const userId = normalizeUserId(normalizedUsername);
  const userRef = ref(database, `users/${userId}/credentials`);
  const snapshot = await get(userRef);
  const userData = snapshot.val() as UserRecord | null;

  if (!userData || userData.password !== password) {
    throw new Error('Invalid username or password');
  }

  return { userId, username: userData.username || normalizedUsername };
};

// Firebase functions for user-scoped concert data
export const saveConcert = async (userId: string, concertId: string, concertData: any) => {
  const concertsRef = ref(database, `concerts/${userId}/${concertId}`);
  await set(concertsRef, concertData);
};

export const deleteConcert = async (userId: string, concertId: string) => {
  const concertRef = ref(database, `concerts/${userId}/${concertId}`);
  await remove(concertRef);
};

export const subscribeToConcerts = (userId: string, callback: (data: any[]) => void) => {
  const concertsRef = ref(database, `concerts/${userId}`);

  return onValue(
    concertsRef,
    (snapshot) => {
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
    },
    (error) => {
      console.error('Error subscribing to concerts:', error);
      callback([]);
    }
  );
};

export { database };
