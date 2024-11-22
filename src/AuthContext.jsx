import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebaseConfig"; // Firebase auth instance
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Step 1: Create the context
const AuthContext = createContext();

// Step 2: Create the provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds the authenticated user
  const [loading, setLoading] = useState(true); // Tracks if auth state is loading
  const [error, setError] = useState(null); // Tracks any auth-related errors

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Auth state loaded
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  const signup = async (email, password) => {
      setError(null); // Clear previous errors
      await createUserWithEmailAndPassword(auth, email, password);
  };
  
  // Login function
  const login = async (email, password) => {
      setError(null); // Clear previous errors
      await signInWithEmailAndPassword(auth, email, password);
  };

  // Logout function
  const logout = async () => {
      setError(null);
      await signOut(auth);
  };

  // Values provided to the application
  const value = { user, signup, login, logout, loading, error };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Step 3: Create a hook for consuming the context
export const useAuth = () => useContext(AuthContext);
