import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Criar conta — Eco-Sports",
  description: "Crie sua conta na Eco-Sports.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Criar conta
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Comece na Eco-Sports
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Preencha os dados abaixo para criar sua conta.
        </p>
      </div>

      <SignupForm />

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
