"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Edit3,
  ListTodo,
  LogOut,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  createTask,
  deleteTask,
  subscribeToTasks,
  updateTask,
  updateTaskStatus,
} from "@/services/task.service";
import type { Task, TaskPriority } from "@/types/task";

const taskSchema = z.object({
  title: z.string().min(3, "Informe um titulo com pelo menos 3 caracteres."),
  description: z.string().max(240, "Use no maximo 240 caracteres.").optional(),
  dueDate: z.string().min(1, "Informe a data de vencimento."),
  priority: z.enum(["baixa", "media", "alta"]),
});

type TaskFormData = z.infer<typeof taskSchema>;

const defaultValues: TaskFormData = {
  title: "",
  description: "",
  dueDate: "",
  priority: "media",
};

const priorityClasses: Record<TaskPriority, string> = {
  baixa: "bg-slate-100 text-slate-700",
  media: "bg-amber-100 text-amber-800",
  alta: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setLoadingTasks(true);
    const unsubscribe = subscribeToTasks(
      user.uid,
      (nextTasks) => {
        setTasks(nextTasks);
        setLoadingTasks(false);
      },
      () => {
        setError("Nao foi possivel carregar suas tarefas agora.");
        setLoadingTasks(false);
      },
    );

    return unsubscribe;
  }, [user]);

  const summary = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "concluida").length;
    const pending = tasks.length - completed;
    const overdue = tasks.filter(
      (task) => task.status === "pendente" && task.dueDate && task.dueDate < today(),
    ).length;

    return { completed, pending, overdue };
  }, [tasks]);

  async function onSubmit(data: TaskFormData) {
    if (!user) {
      return;
    }

    setError("");

    try {
      if (editingTask) {
        await updateTask(user.uid, editingTask.id, {
          ...data,
          description: data.description || "",
          status: editingTask.status,
        });
      } else {
        await createTask(user.uid, {
          ...data,
          description: data.description || "",
        });
      }

      reset(defaultValues);
      setEditingTask(null);
    } catch {
      setError("Nao foi possivel salvar a tarefa. Tente novamente.");
    }
  }

  function startEditing(task: Task) {
    setEditingTask(task);
    reset({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
    });
  }

  function cancelEditing() {
    setEditingTask(null);
    reset(defaultValues);
  }

  async function toggleTask(task: Task) {
    if (!user) {
      return;
    }

    setError("");

    try {
      await updateTaskStatus(
        user.uid,
        task.id,
        task.status === "concluida" ? "pendente" : "concluida",
      );
    } catch {
      setError("Nao foi possivel atualizar o status da tarefa.");
    }
  }

  async function removeTask(taskId: string) {
    if (!user || !window.confirm("Deseja excluir esta tarefa?")) {
      return;
    }

    setError("");

    try {
      await deleteTask(user.uid, taskId);
      if (editingTask?.id === taskId) {
        cancelEditing();
      }
    } catch {
      setError("Nao foi possivel excluir a tarefa.");
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-bold text-slate-950">
              TaskFlow
            </Link>
            <Button type="button" variant="secondary" className="w-auto px-4" onClick={logout}>
              <LogOut size={18} aria-hidden="true" />
              Sair
            </Button>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Area autenticada
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">
              Bem-vindo{user?.name ? `, ${user.name}` : ""}.
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Cadastre, acompanhe, edite e exclua suas tarefas em um unico painel.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard icon={ListTodo} title="Pendentes" value={summary.pending} />
            <SummaryCard icon={CheckCircle2} title="Concluidas" value={summary.completed} />
            <SummaryCard icon={CalendarClock} title="Vencidas" value={summary.overdue} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/calendar" className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Ver calendário
            </Link>
            <Link href="/kanban" className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Abrir Kanban
            </Link>
          </div>

          {error && (
            <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    {editingTask ? "Editar tarefa" : "Nova tarefa"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {editingTask
                      ? "Atualize os dados e salve para refletir na lista."
                      : "Preencha os campos para cadastrar uma tarefa."}
                  </p>
                </div>
                {editingTask && (
                  <button
                    type="button"
                    aria-label="Cancelar edicao"
                    className="inline-flex size-10 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition hover:bg-slate-50"
                    onClick={cancelEditing}
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                )}
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <FormField
                  label="Titulo"
                  placeholder="Ex.: Entregar trabalho"
                  error={errors.title?.message}
                  {...register("title")}
                />

                <div>
                  <label className="text-sm font-medium text-slate-800" htmlFor="description">
                    Descricao
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="mt-2 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                    placeholder="Detalhes importantes da tarefa"
                    aria-invalid={Boolean(errors.description)}
                    {...register("description")}
                  />
                  {errors.description?.message && (
                    <p className="mt-2 text-sm text-red-700">{errors.description.message}</p>
                  )}
                </div>

                <FormField
                  label="Vencimento"
                  type="date"
                  error={errors.dueDate?.message}
                  {...register("dueDate")}
                />

                <div>
                  <label className="text-sm font-medium text-slate-800" htmlFor="priority">
                    Prioridade
                  </label>
                  <select
                    id="priority"
                    className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                    {...register("priority")}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {editingTask ? <Save size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
                  {editingTask ? "Salvar alteracoes" : "Cadastrar tarefa"}
                </Button>
              </form>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Lista de tarefas</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {tasks.length} tarefa{tasks.length === 1 ? "" : "s"} cadastrada
                    {tasks.length === 1 ? "" : "s"}.
                  </p>
                </div>
                <Clock3 className="text-emerald-700" size={24} aria-hidden="true" />
              </div>

              <div className="mt-6 space-y-3">
                {loadingTasks ? (
                  <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">
                    Carregando tarefas...
                  </p>
                ) : tasks.length === 0 ? (
                  <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">
                    Nenhuma tarefa cadastrada ainda.
                  </p>
                ) : (
                  tasks.map((task) => (
                    <article
                      key={task.id}
                      className="rounded-lg border border-slate-200 p-4 transition hover:border-slate-300"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={`break-words text-base font-semibold ${
                                task.status === "concluida"
                                  ? "text-slate-500 line-through"
                                  : "text-slate-950"
                              }`}
                            >
                              {task.title}
                            </h3>
                            <span
                              className={`rounded-md px-2 py-1 text-xs font-semibold ${priorityClasses[task.priority]}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          {task.description && (
                            <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                              {task.description}
                            </p>
                          )}
                          <p className="mt-2 text-xs font-medium text-slate-500">
                            Vence em {formatDate(task.dueDate)}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            aria-label={
                              task.status === "concluida"
                                ? "Marcar como pendente"
                                : "Marcar como concluida"
                            }
                            className="inline-flex size-10 items-center justify-center rounded-md border border-slate-300 text-emerald-700 transition hover:bg-emerald-50"
                            onClick={() => toggleTask(task)}
                          >
                            <CheckCircle2 size={18} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            aria-label="Editar tarefa"
                            className="inline-flex size-10 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition hover:bg-slate-50"
                            onClick={() => startEditing(task)}
                          >
                            <Edit3 size={18} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            aria-label="Excluir tarefa"
                            className="inline-flex size-10 items-center justify-center rounded-md border border-red-200 text-red-700 transition hover:bg-red-50"
                            onClick={() => removeTask(task.id)}
                          >
                            <Trash2 size={18} aria-hidden="true" />
                          </button>
                          <Link
                            href={`/task/${task.id}`}
                            className="inline-flex size-10 items-center justify-center rounded-md border border-slate-300 bg-slate-50 px-3 text-slate-700 transition hover:bg-slate-100"
                          >
                            Detalhes
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}

type SummaryCardProps = {
  icon: typeof ListTodo;
  title: string;
  value: number;
};

function SummaryCard({ icon: Icon, title, value }: SummaryCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-emerald-700">
        <Icon size={20} aria-hidden="true" />
      </div>
      <h2 className="mt-3 text-sm font-medium text-slate-500">{title}</h2>
      <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
    </article>
  );
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value: string) {
  if (!value) {
    return "sem data";
  }

  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value));
}
