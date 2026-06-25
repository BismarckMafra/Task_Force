import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#f7f3ea] px-6 py-8">
      <Link href="/" className="inline-flex text-lg font-bold text-slate-950">
        TaskFlow
      </Link>
      <section className="mx-auto mt-10 w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>
        <div className="mt-6 space-y-5">{children}</div>
        <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
          {footer}
        </div>
      </section>
    </main>
  );
}
