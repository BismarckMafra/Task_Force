"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, router, user]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          <Loader2 className="animate-spin text-emerald-700" size={18} aria-hidden="true" />
          Verificando acesso...
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
