import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";

import { auth, googleProvider } from "@/lib/firebase";
import type { AppUser, LoginInput, RegisterInput } from "@/types/user";

export async function registerWithEmail(input: RegisterInput) {
  const credential = await createUserWithEmailAndPassword(auth, input.email, input.password);

  await updateProfile(credential.user, {
    displayName: input.name,
  });
  await sendEmailVerification(credential.user);
  await credential.user.reload();

  return mapFirebaseUser(auth.currentUser || credential.user);
}

export async function loginWithEmail(input: LoginInput) {
  const credential = await signInWithEmailAndPassword(auth, input.email, input.password);

  return mapFirebaseUser(credential.user);
}

export async function loginWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);

  return mapFirebaseUser(credential.user);
}

export async function logout() {
  await signOut(auth);
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
