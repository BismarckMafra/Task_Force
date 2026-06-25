import { Suspense } from "react";

import { LoginPageClient } from "@/app/login/LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ea] px-6">
      <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-sm">
        Carregando login...
      </div>
    </main>
  );
}
