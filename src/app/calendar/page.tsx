import { ProtectedRoute } from "@/components/ProtectedRoute";
import CalendarView from "@/components/CalendarView";

export default function CalendarPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold">Calendário</h1>
          <p className="mt-2 text-sm text-slate-700">Visualize tarefas por data de vencimento.</p>
          <div className="mt-6">
            <CalendarView />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
