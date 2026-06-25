export type TaskPriority = "baixa" | "media" | "alta";

export type TaskStatus = "pendente" | "em_andamento" | "concluida";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
  subtasks?: { id: string; title: string; done: boolean }[];
};

export type TaskInput = {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status?: TaskStatus;
  subtasks?: { id: string; title: string; done: boolean }[];
};