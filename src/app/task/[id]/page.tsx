"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "@/contexts/AuthContext";
import { getTask, updateTask } from "@/services/task.service";
import type { Task } from "@/types/task";
import { Button } from "@/components/Button";

const taskSchema = z.object({
  title: z.string().min(3, "Informe um titulo."),
  description: z.string().max(240).optional(),
  dueDate: z.string().min(1, "Informe a data de vencimento."),
  priority: z.enum(["baixa", "media", "alta"]),
  status: z.enum(["pendente", "em_andamento", "concluida"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

type WorkLogEntry = {
  id: string;
  note: string;
};

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = params?.id as string | undefined;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [workLog, setWorkLog] = useState<WorkLogEntry[]>([]);
  const [note, setNote] = useState("");

  const totalSubtasks = task?.subtasks?.length ?? 0;
  const completedSubtasks = task?.subtasks?.filter((subtask) => subtask.done).length ?? 0;
  const progressPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const { register, handleSubmit, reset } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "media",
      status: "pendente",
    },
  });

  useEffect(() => {
    if (!user || !taskId) return;

    getTask(user.uid, taskId).then((result) => {
      if (!result) {
        setLoading(false);
        return;
      }

      setTask(result);
      reset({
        title: result.title,
        description: result.description,
        dueDate: result.dueDate,
        priority: result.priority,
        status: result.status,
      });
      setWorkLog([{ id: "initial", note: "Tarefa carregada para edição." }]);
      setLoading(false);
    });
  }, [user, taskId, reset]);

  async function onSubmit(values: TaskFormValues) {
    if (!user || !taskId) return;

    await updateTask(user.uid, taskId, {
      ...values,
      description: values.description || "",
      subtasks: task?.subtasks || [],
    });

    setTask((current) => current ? { ...current, ...values } : null);
  }

  function addSubtask() {
    if (!subtaskTitle.trim()) return;

    const nextSubtasks = [
      ...(task?.subtasks || []),
      { id: `${Date.now()}`, title: subtaskTitle.trim(), done: false },
    ];

    setTask((current) => current ? { ...current, subtasks: nextSubtasks } : null);
    setSubtaskTitle("");
  }

  function toggleSubtask(id: string) {
    setTask((current) =>
      current
        ? {
            ...current,
            subtasks: current.subtasks?.map((subtask) =>
              subtask.id === id ? { ...subtask, done: !subtask.done } : subtask,
            ),
          }
        : current,
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded border bg-white p-6 text-center text-slate-700">Carregando tarefa...</div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded border bg-white p-6 text-center text-slate-700">
          Tarefa não encontrada.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-3 rounded border bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Detalhes da tarefa</h1>
            <p className="mt-1 text-sm text-slate-700">Edite campos, subtarefas e status.</p>
          </div>
          <Link href="/kanban" className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
            Voltar para Kanban
          </Link>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Progresso das subtarefas</p>
              <p className="mt-1 text-xs text-slate-500">
                {totalSubtasks > 0
                  ? `${completedSubtasks} de ${totalSubtasks} concluídas`
                  : "Adicione subtarefas para calcular o progresso automaticamente."}
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {progressPercentage}% concluído
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Título</span>
                <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950" {...register("title")} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Status</span>
                <select className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950" {...register("status")}> 
                  <option value="pendente">A Fazer</option>
                  <option value="em_andamento">Fazendo</option>
                  <option value="concluida">Concluída</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Descrição</span>
              <textarea className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" rows={4} {...register("description")} />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Vencimento</span>
                <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" type="date" {...register("dueDate")} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Prioridade</span>
                <select className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" {...register("priority")}>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Salvar alterações</Button>
            </div>
          </form>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Subtarefas</h2>
              <p className="text-sm text-slate-500">Gerencie pequenos passos desta tarefa.</p>
            </div>
            <div className="flex gap-2">
              <input
                className="rounded-md border border-slate-300 px-3 py-2"
                placeholder="Nova subtarefa"
                value={subtaskTitle}
                onChange={(event) => setSubtaskTitle(event.target.value)}
              />
              <Button type="button" onClick={addSubtask}>Adicionar</Button>
            </div>
          </div>
          <div className="space-y-3">
            {(task.subtasks || []).map((subtask) => (
              <div key={subtask.id} className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 p-3">
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input type="checkbox" checked={subtask.done} onChange={() => toggleSubtask(subtask.id)} />
                  <span className={subtask.done ? "line-through text-slate-400" : ""}>{subtask.title}</span>
                </label>
              </div>
            ))}
            {task.subtasks?.length === 0 && <p className="text-sm text-slate-700">Nenhuma subtarefa cadastrada.</p>}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Registro de trabalho</h2>
          <p className="mt-1 text-sm text-slate-700">Notas rápidas sobre o trabalho realizado.</p>
          <textarea
            className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Descreva o que foi feito..."
          />
          <button
            type="button"
            className="mt-3 inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
            onClick={() => {
              if (!note.trim()) return;
              setWorkLog((current) => [...current, { id: `${Date.now()}`, note: note.trim() }]);
              setNote("");
            }}
          >
            Adicionar registro
          </button>
          <div className="mt-4 space-y-2">
            {workLog.map((entry) => (
              <div key={entry.id} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {entry.note}
              </div>
            ))}
            {workLog.length === 0 && <p className="text-sm text-slate-700">Nenhum registro adicionado.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
