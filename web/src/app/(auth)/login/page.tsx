import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar — Eco-Sports",
  description: "Acesse sua conta na Eco-Sports.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Entrar
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Acesse sua conta
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Use seu e-mail e senha para entrar na Eco-Sports.
        </p>
      </div>

      <LoginForm />

      <DemoCredentialsHint />
    </div>
  );
}

function DemoCredentialsHint() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">
        Ambiente de desenvolvimento
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Usuários mock disponíveis:
      </p>
      <ul className="mt-2 space-y-1 font-mono text-xs text-foreground">
        <li>joao@demo.ecosports.app / joao123</li>
        <li>mariana@demo.ecosports.app / mariana123</li>
      </ul>
    </div>
  );
}
