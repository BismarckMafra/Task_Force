import { ArrowRight, CheckCircle2, Gauge, LogIn, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const features = [
  {
    icon: CheckCircle2,
    title: "Tarefas organizadas",
    description: "Prioridades, vencimentos e subtarefas no mesmo fluxo.",
  },
  {
    icon: Gauge,
    title: "Dashboard pronto",
    description: "Base preparada para metricas e graficos das proximas etapas.",
  },
  {
    icon: ShieldCheck,
    title: "Acesso protegido",
    description: "Firebase Authentication com rotas autenticadas.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f3ea]">
      <Navbar />

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-16 pt-10 md:grid-cols-[1.02fr_0.98fr] md:items-center md:px-10 md:pb-24 md:pt-16">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Gestor de tarefas
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            TaskFlow
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
            Um ambiente para acompanhar tarefas, progresso e prazos com login
            seguro e uma base pronta para Kanban, calendario e dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Criar conta
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <LogIn size={18} aria-hidden="true" />
              Entrar
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-sm font-semibold text-slate-950">Resumo de hoje</p>
                <p className="text-xs text-slate-500">Progresso das tarefas</p>
              </div>
              <span className="rounded-md bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                Online
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Pendentes", "Semana", "Vencidas"].map((label, index) => (
                <div key={label} className="rounded-md border border-slate-100 p-4">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {[8, 5, 1][index]}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {["Finalizar cadastro", "Configurar Firebase", "Abrir dashboard"].map(
                (task, index) => (
                  <div
                    key={task}
                    className="flex items-center justify-between rounded-md bg-slate-50 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{task}</p>
                      <p className="text-xs text-slate-500">
                        Prioridade {[ "alta", "media", "baixa" ][index]}
                      </p>
                    </div>
                    <CheckCircle2
                      className={index === 2 ? "text-slate-300" : "text-emerald-600"}
                      size={20}
                      aria-hidden="true"
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-10 md:grid-cols-3 md:px-10">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-lg border border-slate-200 p-5">
              <feature.icon className="text-emerald-700" size={24} aria-hidden="true" />
              <h2 className="mt-4 text-base font-semibold text-slate-950">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
