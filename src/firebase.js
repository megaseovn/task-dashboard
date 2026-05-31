import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, remove, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC4LFkBBoxfBV8171j42ltGRTUlBV1rqcM",
  authDomain: "megaseo-dashboard.firebaseapp.com",
  databaseURL: "https://megaseo-dashboard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "megaseo-dashboard",
  storageBucket: "megaseo-dashboard.firebasestorage.app",
  messagingSenderId: "429118280032",
  appId: "1:429118280032:web:75e577b9e7700e1b2c8e05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get reference to the database service
export const db = getDatabase(app);

// Helper functions for database operations
export const dbRef = ref;
export const dbSet = set;
export const dbGet = get;
export const dbUpdate = update;
export const dbRemove = remove;
export const dbOnValue = onValue;

export default app;
