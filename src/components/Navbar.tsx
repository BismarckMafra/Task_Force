"use client";

import { LayoutDashboard, LogIn, Menu, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

const links = [
  { href: "/#features", label: "Recursos" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/calendar", label: "Calendário" },
  { href: "/kanban", label: "Kanban" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <Link href="/" className="text-lg font-bold text-slate-950">
          TaskFlow
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-700 hover:text-slate-950">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!loading && user ? (
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <LayoutDashboard size={17} aria-hidden="true" />
              Menu completo
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                aria-label="Entrar no sistema"
                className="inline-flex size-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-800 transition hover:bg-slate-50"
              >
                <LogIn size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                <UserPlus size={17} aria-hidden="true" />
                Cadastro
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Abrir menu"
          className="inline-flex size-10 items-center justify-center rounded-md border border-slate-300 bg-white md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              {user ? <LayoutDashboard size={17} aria-hidden="true" /> : <LogIn size={17} aria-hidden="true" />}
              {user ? "Menu completo" : "Entrar"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
