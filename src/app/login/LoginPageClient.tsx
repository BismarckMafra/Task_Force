"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { GoogleIcon } from "@/components/GoogleIcon";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.email("Informe um email valido."),
  password: z.string().min(1, "Informe sua senha."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithEmail, loginWithGoogle, loading } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const redirectTo = searchParams.get("next") || "/dashboard";

  async function onSubmit(data: LoginFormData) {
    setError("");

    try {
      await loginWithEmail(data);
      router.push(redirectTo);
    } catch (err) {
      setError(getAuthMessage(err));
    }
  }

  async function handleGoogleLogin() {
    setError("");

    try {
      await loginWithGoogle();
      router.push(redirectTo);
    } catch (err) {
      setError(getAuthMessage(err));
    }
  }

  return (
    <AuthShell
      title="Entrar no TaskFlow"
      subtitle="Acesse sua conta para continuar para o dashboard protegido."
      footer={
        <p>
          Ainda nao tem conta?{" "}
          <Link className="font-semibold text-emerald-700 hover:text-emerald-800" href="/register">
            Cadastre-se
          </Link>
        </p>
      }
    >
      {searchParams.get("registered") === "true" && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Conta criada. Enviamos um email de verificacao antes do primeiro uso completo.
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          label="Senha"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" disabled={isSubmitting || loading}>
          <Mail size={18} aria-hidden="true" />
          Entrar com email
        </Button>
      </form>

      <div className="relative py-1 text-center">
        <span className="bg-white px-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
          ou
        </span>
        <div className="absolute left-0 top-1/2 -z-10 h-px w-full bg-slate-200" />
      </div>

      <Button type="button" variant="secondary" onClick={handleGoogleLogin} disabled={loading}>
        <GoogleIcon />
        Entrar com Google
      </Button>
    </AuthShell>
  );
}

function getAuthMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";

  if (code.includes("auth/invalid-credential")) {
    return "Email ou senha incorretos.";
  }

  if (code.includes("auth/popup-closed-by-user")) {
    return "Login com Google cancelado antes da conclusao.";
  }

  if (code.includes("auth/configuration-not-found")) {
    return "Firebase Authentication ainda nao esta configurado para este projeto.";
  }

  return "Nao foi possivel entrar agora. Verifique os dados e tente novamente.";
}
