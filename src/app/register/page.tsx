"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { useAuth } from "@/contexts/AuthContext";

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const registerSchema = z
  .object({
    name: z.string().min(3, "Informe seu nome com pelo menos 3 caracteres."),
    email: z.email("Informe um email valido."),
    password: z
      .string()
      .regex(
        strongPassword,
        "Use 8+ caracteres com maiuscula, minuscula, numero e simbolo.",
      ),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithEmail, loading } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    setError("");

    try {
      await registerWithEmail({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      router.push("/login?registered=true");
    } catch (err) {
      setError(getRegisterMessage(err));
    }
  }

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Preencha seus dados para receber a verificacao por email."
      footer={
        <p>
          Ja tem conta?{" "}
          <Link className="font-semibold text-emerald-700 hover:text-emerald-800" href="/login">
            Entrar
          </Link>
        </p>
      }
    >
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Nome"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <FormField
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" disabled={isSubmitting || loading}>
          <UserPlus size={18} aria-hidden="true" />
          Cadastrar
        </Button>
      </form>
    </AuthShell>
  );
}

function getRegisterMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";

  if (code.includes("auth/email-already-in-use")) {
    return "Este email ja esta cadastrado.";
  }

  if (code.includes("auth/configuration-not-found")) {
    return "Firebase Authentication ainda nao esta configurado para este projeto.";
  }

  return "Nao foi possivel cadastrar agora. Revise os dados e tente novamente.";
}
