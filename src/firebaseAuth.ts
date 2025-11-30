import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, UserCredential, setPersistence, browserLocalPersistence, signOut, signInAnonymously as firebaseSignInAnonymously } from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";

export const signUp = async (email:string, password:string): Promise<UserCredential | undefined> => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created:", userCredential.user);
    return userCredential;
  } catch (error) {
    console.error("Error signing up:", (error as Error).message);
    throw error;
  }
};

export const login = async (email:string, password:string): Promise<UserCredential | undefined> => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    return userCredential;
  } catch (error) {
    console.error("Error logging in:", (error as Error).message);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<UserCredential | undefined> => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google user:", result.user);
    return result;
  } catch (error) {
    console.error("Google auth error:", (error as Error).message);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", (error as Error).message);
    throw error;
  }
};

export const signInAnonymously = async (): Promise<UserCredential | undefined> => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await firebaseSignInAnonymously(auth);
    console.log("User signed in anonymously:", userCredential.user);
    return userCredential;
  } catch (error) {
    console.error("Error signing in anonymously:", (error as Error).message);
    throw error;
  }
};
