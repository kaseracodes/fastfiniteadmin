import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig"; // Firebase auth instance
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Step 1: Create the context
const AuthContext = createContext();

// Step 2: Create the provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds the authenticated user
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true); // Tracks if auth state is loading
  const [error, setError] = useState(null); // Tracks any auth-related errors

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch permissions from Firestore
        const adminDocRef = doc(db, "admins", currentUser.uid);
        const adminDocSnap = await getDoc(adminDocRef);
        if (adminDocSnap.exists()) {
          setPermissions(adminDocSnap.data().permissions || []);
        } else {
          console.error("Admin document not found!");
        }
      }

      setLoading(false); // Auth state loaded
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  const signup = async (email, password) => {
      setError(null); // Clear previous errors
      const adminCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const admin = adminCredentials.user;

      // Check if the admin already exists in Firestore
      const adminDocRef = doc(db, "admins", admin.uid);
      const adminDocSnap = await getDoc(adminDocRef);

      if (adminDocSnap.exists()) {
        console.error("Admin already exists in Firestore!");
        throw new Error("Admin already exists!");
      }

      // If admin does not exist, add them to Firestore
      await setDoc(adminDocRef, {
        email: admin.email,
        // name: admin.displayName || "Admin", // Default to "Admin" if no name is provided
        permissions: [],
      });

      console.log("Admin added successfully!");
  };
  
  // Login function
  const login = async (email, password) => {
      setError(null); // Clear previous errors
      const adminCredentials = await signInWithEmailAndPassword(auth, email, password);
      return adminCredentials;
  };

  // Logout function
  const logout = async () => {
      setError(null);
      await signOut(auth);
  };

  // Values provided to the application
  const value = { user, permissions, signup, login, logout, loading, error };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Step 3: Create a hook for consuming the context
export const useAuth = () => useContext(AuthContext);
