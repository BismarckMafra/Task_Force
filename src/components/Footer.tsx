"use client";

import { useEffect, useState } from "react";
import { Contrast, Moon, Sun, Zap } from "lucide-react";

import { useDarkMode } from "./Darkmode";

function FooterContent() {
  const { dark, highContrast, reducedMotion, toggle, toggleHighContrast, toggleReducedMotion } = useDarkMode();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-10">
        <div className="space-y-1">
          <p className="font-semibold">TaskFlow</p>
          <p>Projeto acadêmico de gerenciamento de tarefas com Next.js e Firebase.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-pressed={dark}
            aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 font-medium text-slate-100 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            {dark ? "Modo claro" : "Modo escuro"}
          </button>

          <button
            type="button"
            onClick={toggleHighContrast}
            aria-pressed={highContrast}
            aria-label={highContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 font-medium text-slate-100 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Contrast size={16} aria-hidden="true" />
            {highContrast ? "Contraste padrão" : "Alto contraste"}
          </button>

          <button
            type="button"
            onClick={toggleReducedMotion}
            aria-pressed={reducedMotion}
            aria-label={reducedMotion ? "Desativar redução de movimento" : "Ativar redução de movimento"}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 font-medium text-slate-100 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Zap size={16} aria-hidden="true" />
            {reducedMotion ? "Movimento normal" : "Reduzir movimento"}
          </button>
        </div>
      </div>
    </footer>
  );
}

export function Footer() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Prevent hydration mismatch by rendering empty footer on server
  if (!isHydrated) {
    return (
      <footer className="border-t border-slate-800 bg-slate-950 text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-10">
          <div className="space-y-1">
            <p className="font-semibold">TaskFlow</p>
            <p>Projeto acadêmico de gerenciamento de tarefas com Next.js e Firebase.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2" />
        </div>
      </footer>
    );
  }

  return <FooterContent />;
}
