import { ProtectedRoute } from "@/components/ProtectedRoute";
import KanbanBoard from "@/components/KanbanBoard";

export default function KanbanPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">Quadro Kanban</h1>
            <p className="mt-2 text-sm text-slate-600">Arraste as tarefas entre colunas para atualizar o status.</p>
          </header>
          <KanbanBoard />
        </div>
      </main>
    </ProtectedRoute>
  );
}
