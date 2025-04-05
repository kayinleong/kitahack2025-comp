"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { subscribeToAuthChanges } from "@/lib/firebase/client";
import { createSessionCookie, logoutSession } from "@/lib/actions/auth.action";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  setServerSession: (idToken: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);

      // If user signed in, create a session cookie
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        await setServerSession(idToken);
      }
    });

    return () => unsubscribe();
  }, []);

  async function setServerSession(idToken: string): Promise<boolean> {
    const result = await createSessionCookie(idToken);
    return result.success;
  }

  async function signOut() {
    try {
      // Clear the server-side session
      await logoutSession();
      // Sign out from Firebase client
      await import("@/lib/firebase/client").then((auth) => auth.logoutUser());
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signOut,
        setServerSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
