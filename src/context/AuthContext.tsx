"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  linkWithCredential,
  onIdTokenChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type OAuthCredential,
  type User as FirebaseUser,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { User, AuthContextType } from "@/types/auth";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function establishServerSession(firebaseUser: FirebaseUser, name?: string) {
  const idToken = await firebaseUser.getIdToken();
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, name }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Could not establish your Firebase session.");
  }
  return { idToken, user: result.user as User };
}

async function restoreServerSession() {
  const response = await fetch("/api/auth/session", { cache: "no-store" });
  if (!response.ok) return null;
  const result = await response.json();
  return result.user as User;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [googleCredentialToLink, setGoogleCredentialToLink] =
    useState<OAuthCredential | null>(null);
  const [isLoaded, setIsLoaded] = useState(!isFirebaseConfigured);
  const isAuthModalOpen = false;

  useEffect(() => {
    if (!firebaseAuth) {
      return;
    }

    let active = true;
    const unsubscribe = onIdTokenChanged(firebaseAuth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const session = await establishServerSession(firebaseUser);
          if (active) {
            setUser(session.user);
            setToken(session.idToken);
          }
        } else {
          const restoredUser = await restoreServerSession();
          if (active) {
            setUser(restoredUser);
            setToken(null);
          }
        }
      } catch (error) {
        if (active) {
          console.error("Could not restore Firebase auth session:", error);
          setUser(null);
          setToken(null);
        }
      } finally {
        if (active) setIsLoaded(true);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const openAuthModal = () => {
    if (typeof window !== "undefined") window.location.href = "/login";
  };

  const closeAuthModal = () => {};

  const completeSignIn = async (
    firebaseUser: FirebaseUser,
    expectedRole: "ADMIN" | "CUSTOMER" | "AUTO"
  ) => {
    const session = await establishServerSession(firebaseUser);
    const role = session.user.role.toUpperCase();
    if (expectedRole !== "AUTO" && role !== expectedRole) {
      if (firebaseAuth) await signOut(firebaseAuth);
      await fetch("/api/auth/session", { method: "DELETE" });
      setUser(null);
      setToken(null);
      toast.error(
        expectedRole === "ADMIN"
          ? "This account does not have admin access."
          : "This account does not have customer access."
      );
      return false;
    }

    setUser(session.user);
    setToken(session.idToken);
    toast.success(`Welcome back, ${session.user.name || "there"}!`);
    router.push(role === "ADMIN" ? "/admin/dashboard" : "/");
    return true;
  };

  const login = async (
    identifier: string,
    password: string,
    expectedRole: "ADMIN" | "CUSTOMER" | "AUTO"
  ): Promise<boolean> => {
    if (!firebaseAuth || !isFirebaseConfigured) {
      toast.error("Firebase Authentication is not configured for this deployment.");
      return false;
    }

    try {
      const credential = await signInWithEmailAndPassword(
        firebaseAuth,
        identifier.trim().toLowerCase(),
        password
      );
      return await completeSignIn(credential.user, expectedRole);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in.");
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    if (!firebaseAuth || !isFirebaseConfigured) {
      toast.error("Firebase Authentication is not configured for this deployment.");
      return false;
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const credential = await signInWithPopup(firebaseAuth, provider);
      return await completeSignIn(credential.user, "AUTO");
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === "auth/account-exists-with-different-credential"
      ) {
        const credential = GoogleAuthProvider.credentialFromError(error);
        if (credential) {
          setGoogleCredentialToLink(credential);
          toast.error(
            "This Google email already has a password account. Enter that account’s email and password once to link Google."
          );
          return false;
        }
      }

      const code =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof error.code === "string"
          ? error.code
          : "";
      const message =
        code === "auth/operation-not-allowed"
          ? "Enable Google sign-in in Firebase Authentication."
          : code === "auth/unauthorized-domain"
            ? "Add this website's domain to Firebase Authentication's authorized domains."
            : code === "auth/account-exists-with-different-credential"
              ? "This email already uses another sign-in method. Sign in with that method for this account."
              : code === "auth/popup-closed-by-user"
                ? "Google sign-in was cancelled."
                : error instanceof Error
                  ? error.message
                  : "Could not sign in with Google.";
      toast.error(message);
      return false;
    }
  };

  const completeGoogleLink = async (email: string, password: string) => {
    if (!firebaseAuth || !googleCredentialToLink) {
      toast.error("Start Google sign-in again to link your account.");
      return false;
    }

    try {
      const credential = await signInWithEmailAndPassword(
        firebaseAuth,
        email.trim().toLowerCase(),
        password
      );
      const linked = await linkWithCredential(
        credential.user,
        googleCredentialToLink
      );
      setGoogleCredentialToLink(null);
      return await completeSignIn(linked.user, "AUTO");
    } catch (error) {
      if (firebaseAuth.currentUser) await signOut(firebaseAuth);
      await fetch("/api/auth/session", { method: "DELETE" });
      toast.error(error instanceof Error ? error.message : "Could not link Google to this account.");
      return false;
    }
  };

  const cancelGoogleLink = () => setGoogleCredentialToLink(null);

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (!firebaseAuth || !isFirebaseConfigured) {
      toast.error("Firebase Authentication is not configured for this deployment.");
      return false;
    }
    const cleanEmail = email.trim().toLowerCase();
    const configuredAdminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();
    if (configuredAdminEmail && cleanEmail === configuredAdminEmail) {
      toast.error("The admin account must be created by an administrator.");
      return false;
    }

    try {
      const credential = await createUserWithEmailAndPassword(
        firebaseAuth,
        cleanEmail,
        password
      );
      await updateProfile(credential.user, { displayName: name.trim() });
      const session = await establishServerSession(credential.user, name.trim());
      setUser(session.user);
      setToken(session.idToken);
      toast.success(`Account created! Welcome, ${session.user.name || name}!`);
      router.push("/");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed.");
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    if (!firebaseAuth || !isFirebaseConfigured) {
      toast.error("Firebase Authentication is not configured for this deployment.");
      return false;
    }
    try {
      await sendPasswordResetEmail(firebaseAuth, email.trim().toLowerCase());
      toast.success("Password reset email sent.");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send password reset email.");
      return false;
    }
  };

  const logout = async (redirectTo?: string) => {
    try {
      if (firebaseAuth) await signOut(firebaseAuth);
    } catch (error) {
      console.error("Firebase sign-out failed:", error);
    } finally {
      try {
        await fetch("/api/auth/session", { method: "DELETE" });
      } catch (error) {
        console.error("Could not clear Firebase server session:", error);
      }
      setUser(null);
      setToken(null);
      toast.success("Signed out successfully");
      if (typeof window !== "undefined") {
        window.location.href = redirectTo || "/login";
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        isAuthenticated: !!user,
        isLoaded,
        isAuthModalOpen,
        googleLinkPending: googleCredentialToLink !== null,
        openAuthModal,
        closeAuthModal,
        login,
        loginWithGoogle,
        completeGoogleLink,
        cancelGoogleLink,
        register,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
