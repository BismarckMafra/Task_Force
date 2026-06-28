import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type FirestoreError,
  type QueryDocumentSnapshot,
  type Timestamp,
  type Firestore,
} from "firebase/firestore";

import { getFirestoreDb } from "@/lib/firebase";
import type { Task, TaskInput, TaskStatus } from "@/types/task";

type TaskDocument = {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: Task["priority"];
  status?: TaskStatus;
  subtasks?: { id: string; title: string; done: boolean }[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

function tasksCollection(userId: string) {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error(
      "Firestore não está inicializado. Verifique as variáveis de ambiente NEXT_PUBLIC_FIREBASE_*.",
    );
  }

  return collection(db as Firestore, "users", userId, "tasks");
}

export function subscribeToTasks(
  userId: string,
  onChange: (tasks: Task[]) => void,
  onError: (error: FirestoreError) => void,
) {
  const tasksQuery = query(tasksCollection(userId), orderBy("createdAt", "desc"));

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      onChange(snapshot.docs.map(mapTaskDocument));
    },
    onError,
  );
}

export async function createTask(userId: string, input: TaskInput) {
  await addDoc(tasksCollection(userId), {
    ...input,
    status: input.status || "pendente",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTask(userId: string, taskId: string, input: TaskInput) {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error(
      "Firestore não está inicializado. Verifique as variáveis de ambiente NEXT_PUBLIC_FIREBASE_*.",
    );
  }

  await updateDoc(doc(db as Firestore, "users", userId, "tasks", taskId), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function updateTaskStatus(userId: string, taskId: string, status: TaskStatus) {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error(
      "Firestore não está inicializado. Verifique as variáveis de ambiente NEXT_PUBLIC_FIREBASE_*.",
    );
  }

  await updateDoc(doc(db as Firestore, "users", userId, "tasks", taskId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(userId: string, taskId: string) {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error(
      "Firestore não está inicializado. Verifique as variáveis de ambiente NEXT_PUBLIC_FIREBASE_*.",
    );
  }

  await deleteDoc(doc(db as Firestore, "users", userId, "tasks", taskId));
}

export async function getTask(userId: string, taskId: string) {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error(
      "Firestore não está inicializado. Verifique as variáveis de ambiente NEXT_PUBLIC_FIREBASE_*.",
    );
  }

  const d = await getDoc(doc(db as Firestore, "users", userId, "tasks", taskId));
  if (!d.exists()) return null;
  return mapTaskDocument(d as any);
}

// dentro do mapTaskDocument (substitua/adicione subtasks)
function mapTaskDocument(document: QueryDocumentSnapshot): Task {
  const data = document.data() as TaskDocument & { subtasks?: any[] };

  return {
    id: document.id,
    title: data.title || "",
    description: data.description || "",
    dueDate: data.dueDate || "",
    priority: data.priority || "media",
    status: (data.status as TaskStatus) || "pendente",
    createdAt: data.createdAt?.toDate() || null,
    updatedAt: data.updatedAt?.toDate() || null,
    subtasks: data.subtasks || [],
  };
}


