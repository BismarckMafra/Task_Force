"use client";

import { onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getFirebaseAuth } from "@/lib/firebase";
import {
  loginWithEmail as loginWithEmailService,
  loginWithGoogle as loginWithGoogleService,
  logout as logoutService,
  mapFirebaseUser,
  registerWithEmail as registerWithEmailService,
} from "@/services/auth.service";
import type { AppUser, LoginInput, RegisterInput } from "@/types/user";

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  registerWithEmail: (input: RegisterInput) => Promise<AppUser>;
  loginWithEmail: (input: LoginInput) => Promise<AppUser>;
  loginWithGoogle: () => Promise<AppUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const authClient = getFirebaseAuth();
      if (!authClient) {
        setLoading(false);
        setIsInitialized(true);
        return;
      }

      const unsubscribe = onAuthStateChanged(authClient, (firebaseUser) => {
        setUser(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
        if (!isInitialized) {
          setLoading(false);
          setIsInitialized(true);
        }
      });

      return unsubscribe;
    };

    initializeAuth();
  }, [isInitialized]);

  const registerWithEmail = useCallback(async (input: RegisterInput) => {
    const appUser = await registerWithEmailService(input);
    setUser(appUser);
    return appUser;
  }, []);

  const loginWithEmail = useCallback(async (input: LoginInput) => {
    const appUser = await loginWithEmailService(input);
    setUser(appUser);
    return appUser;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const appUser = await loginWithGoogleService();
    setUser(appUser);
    return appUser;
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      registerWithEmail,
      loginWithEmail,
      loginWithGoogle,
      logout,
    }),
    [loading, loginWithEmail, loginWithGoogle, logout, registerWithEmail, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
