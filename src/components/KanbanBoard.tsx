"use client";

import { useEffect, useMemo, useState } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter, useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";
import { subscribeToTasks, updateTaskStatus } from "@/services/task.service";
import type { Task, TaskStatus } from "@/types/task";

const columns = [
  { id: "pendente", title: "A Fazer" },
  { id: "em_andamento", title: "Fazendo" },
  { id: "concluida", title: "Concluído" },
];

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: { status: task.status } });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{task.title}</p>
          <p className="mt-2 text-xs text-slate-500">Vence em {task.dueDate}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-1">{task.priority}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1">{task.status === "em_andamento" ? "Fazendo" : task.status === "pendente" ? "A Fazer" : "Concluído"}</span>
      </div>
      <Link href={`/task/${task.id}`} className="mt-4 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-900">
        Ver detalhes
      </Link>
    </div>
  );
}

function Column({ status, title, tasks }: { status: TaskStatus; title: string; tasks: Task[] }) {
  const { setNodeRef } = useDroppable({ id: status, data: { status } });

  return (
    <section ref={setNodeRef} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h2>
      <div className="mt-4 space-y-3 min-h-[240px]">
        {tasks.length === 0 ? (
          <p className="rounded-lg bg-white p-4 text-sm text-slate-500">Nenhuma tarefa nesta coluna.</p>
        ) : (
          <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        )}
      </div>
    </section>
  );
}

export default function KanbanBoard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToTasks(
      user.uid,
      (nextTasks) => setTasks(nextTasks),
      () => {},
    );

    return unsubscribe;
  }, [user]);

  const tasksByStatus = useMemo(
    () => ({
      pendente: tasks.filter((task) => task.status === "pendente"),
      em_andamento: tasks.filter((task) => task.status === "em_andamento"),
      concluidas: tasks.filter((task) => task.status === "concluida"),
    }),
    [tasks],
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!user || !over || active.id === over.id) return;

    const activeTask = tasks.find((task) => task.id === String(active.id));
    const destinationStatus = String(over.data.current?.status) as TaskStatus | undefined;

    if (!activeTask || !destinationStatus || activeTask.status === destinationStatus) return;

    await updateTaskStatus(user.uid, activeTask.id, destinationStatus);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-3">
        <Column status="pendente" title="A Fazer" tasks={tasksByStatus.pendente} />
        <Column status="em_andamento" title="Fazendo" tasks={tasksByStatus.em_andamento} />
        <Column status="concluida" title="Concluído" tasks={tasksByStatus.concluidas} />
      </div>
    </DndContext>
  );
}
