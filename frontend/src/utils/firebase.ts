import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User as FirebaseUser, GoogleAuthProvider, signInWithPopup, OAuthProvider } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, getDocs, updateDoc, query, where, serverTimestamp, or, onSnapshot, orderBy, deleteDoc } from 'firebase/firestore';
import { firebaseApp, firebaseAuth } from 'app';

// Your web app's Firebase configuration is now handled by the Firebase Auth extension
// Use the provided instances instead

// Get Firestore from the Firebase app instance
const db = getFirestore(firebaseApp);

// Re-export the Firebase Auth extension's auth instance
const auth = firebaseAuth;

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, collection, addDoc, setDoc, doc, getDoc, getDocs, updateDoc, query, where, serverTimestamp, or, GoogleAuthProvider, signInWithPopup, OAuthProvider, deleteDoc, onSnapshot, orderBy };
export type { FirebaseUser };
