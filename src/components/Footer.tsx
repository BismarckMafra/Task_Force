import { useDarkMode } from "./Darkmode";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-10">
        <p className="font-semibold">TaskFlow</p>
        <p>Projeto academico de gerenciamento de tarefas com Next.js e Firebase.</p>
      </div>
     const {dark, toggle} = useDarkMode()
      <button onClick={toggle} aria-pressed={dark}>
        {dark ? 'Modo Claro' : 'Modo Escuro'}
      </button>
    </footer>
  );
}
