import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type Auth,
  type User,
} from "firebase/auth";

import { getFirebaseAuth, googleProvider } from "@/lib/firebase";
import type { AppUser, LoginInput, RegisterInput } from "@/types/user";

function getAuthClient(): Auth {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new Error(
      "Firebase não está inicializado. Verifique as variáveis de ambiente NEXT_PUBLIC_FIREBASE_*.",
    );
  }

  return auth;
}

export async function registerWithEmail(input: RegisterInput) {
  const authClient = getAuthClient();
  const credential = await createUserWithEmailAndPassword(authClient, input.email, input.password);

  await updateProfile(credential.user, {
    displayName: input.name,
  });
  await sendEmailVerification(credential.user);
  await credential.user.reload();

  return mapFirebaseUser(authClient.currentUser || credential.user);
}

export async function loginWithEmail(input: LoginInput) {
  const authClient = getAuthClient();
  const credential = await signInWithEmailAndPassword(authClient, input.email, input.password);

  return mapFirebaseUser(credential.user);
}

export async function loginWithGoogle() {
  const authClient = getAuthClient();
  const credential = await signInWithPopup(authClient, googleProvider);

  return mapFirebaseUser(credential.user);
}

export async function logout() {
  const authClient = getAuthClient();
  await signOut(authClient);
}

export function mapFirebaseUser(user: User): AppUser {
  return {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    provider: user.providerData[0]?.providerId || "password",
  };
}
