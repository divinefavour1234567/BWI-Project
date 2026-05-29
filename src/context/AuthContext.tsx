import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  getDocFromServer 
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";

export type UserRole =
  | "Admin"
  | "Government Analyst"
  | "Security Analyst"
  | "Healthcare Analyst"
  | "Agricultural Analyst"
  | "General User";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  createdAt: any;
  updatedAt: any;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  connectionHealthy: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string, requestedRole: UserRole) => Promise<void>;
  loginWithGoogle: (requestedRoleIfNew?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileDetails: (displayName: string, photoURL: string) => Promise<void>;
  updateUserRoleByAdmin: (targetUid: string, newRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionHealthy, setConnectionHealthy] = useState(true);

  // Test connection to Firestore on initialization
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, "test", "connection"));
        setConnectionHealthy(true);
      } catch (error: any) {
        console.error("Firebase connection test output/fallback:", error);
        if (error?.message?.includes("the client is offline")) {
          setConnectionHealthy(false);
        }
      }
    }
    testConnection();
  }, []);

  // Set up Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchOrCreateUserProfile(user);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Load user profile or create if it doesn't exist (e.g. Google Sign-In helper)
  const fetchOrCreateUserProfile = async (user: User, customRole?: UserRole) => {
    const userDocRef = doc(db, "users", user.uid);
    try {
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
      } else {
        // Automatically assign admin role if email matches the bootstrapped admin
        let assignedRole: UserRole = "General User";
        if (user.email === "chukwuemekadivine524@gmail.com") {
          assignedRole = "Admin";
        } else if (customRole) {
          assignedRole = customRole;
        }

        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "Operator",
          photoURL: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256",
          role: assignedRole,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.error("Failed to load or construct user profile in Firestore:", err);
      // Fallback local profile for sandbox resilience
      setUserProfile({
        uid: user.uid,
        email: user.email || "local@example.com",
        displayName: user.displayName || "Operator",
        photoURL: user.photoURL || "",
        role: user.email === "chukwuemekadivine524@gmail.com" ? "Admin" : (customRole || "General User"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string, requestedRole: UserRole) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update Firebase Auth profile
      await updateProfile(user, { displayName });

      // Create profile record in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const newProfile: UserProfile = {
        uid: user.uid,
        email,
        displayName,
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256",
        role: email === "chukwuemekadivine524@gmail.com" ? "Admin" : requestedRole,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      try {
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      } catch (fErr) {
        handleFirestoreError(fErr, OperationType.WRITE, `users/${user.uid}`);
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const loginWithGoogle = async (requestedRoleIfNew: UserRole = "General User") => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await fetchOrCreateUserProfile(userCredential.user, requestedRoleIfNew);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfileDetails = async (displayName: string, photoURL: string) => {
    if (!currentUser) throw new Error("No authenticated user session");
    
    // Update auth metadata
    await updateProfile(currentUser, { displayName, photoURL });
    
    // Update firestore document
    const userDocRef = doc(db, "users", currentUser.uid);
    try {
      await updateDoc(userDocRef, {
        displayName,
        photoURL,
        updatedAt: serverTimestamp(),
      });
      setUserProfile(prev => prev ? { ...prev, displayName, photoURL } : null);
    } catch (fErr) {
      handleFirestoreError(fErr, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const updateUserRoleByAdmin = async (targetUid: string, newRole: UserRole) => {
    if (!currentUser || userProfile?.role !== "Admin") {
      throw new Error("Unauthorized: Only Administrators can modify security clearance roles");
    }
    const targetDocRef = doc(db, "users", targetUid);
    try {
      await updateDoc(targetDocRef, {
        role: newRole,
        updatedAt: serverTimestamp(),
      });
    } catch (fErr) {
      handleFirestoreError(fErr, OperationType.UPDATE, `users/${targetUid}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        connectionHealthy,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        updateProfileDetails,
        updateUserRoleByAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
