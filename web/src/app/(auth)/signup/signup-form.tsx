"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp, type SignUpFormState } from "@/lib/auth/actions";

type Role = "athlete" | "parent_guardian";

export function SignupForm() {
  const [state, formAction, pending] = useActionState<
    SignUpFormState,
    FormData
  >(signUp, undefined);

  const [role, setRole] = useState<Role>(
    (state?.values?.role as Role) ?? "athlete",
  );

  const prevStateRef = useRef(state);
  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;
    if (state?.errors?.form) {
      toast.error(state.errors.form[0]);
    } else if (state?.errors) {
      toast.error("Revise os campos marcados.");
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {/* Seletor de role */}
      <input type="hidden" name="role" value={role} />
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Eu sou...
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("athlete")}
            className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition-colors ${
              role === "athlete"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-background text-muted-foreground hover:border-primary/40"
            }`}
          >
            Atleta
          </button>
          <button
            type="button"
            onClick={() => setRole("parent_guardian")}
            className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition-colors ${
              role === "parent_guardian"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-background text-muted-foreground hover:border-primary/40"
            }`}
          >
            Responsável
          </button>
        </div>
        {state?.errors?.role && (
          <p className="text-xs text-destructive">{state.errors.role[0]}</p>
        )}
      </div>

      {/* Nome */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground"
          >
            Nome
          </label>
          <Input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            required
            defaultValue={state?.values?.firstName}
            aria-invalid={Boolean(state?.errors?.firstName)}
            aria-describedby="firstName-error"
          />
          {state?.errors?.firstName && (
            <p id="firstName-error" className="text-xs text-destructive">
              {state.errors.firstName[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="lastName"
            className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground"
          >
            Sobrenome
          </label>
          <Input
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            required
            defaultValue={state?.values?.lastName}
            aria-invalid={Boolean(state?.errors?.lastName)}
            aria-describedby="lastName-error"
          />
          {state?.errors?.lastName && (
            <p id="lastName-error" className="text-xs text-destructive">
              {state.errors.lastName[0]}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground"
        >
          E-mail
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state?.values?.email}
          aria-invalid={Boolean(state?.errors?.email)}
          aria-describedby="email-error"
        />
        {state?.errors?.email && (
          <p id="email-error" className="text-xs text-destructive">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      {/* Senha */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Senha
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          aria-invalid={Boolean(state?.errors?.password)}
          aria-describedby="password-error"
        />
        {state?.errors?.password && (
          <p id="password-error" className="text-xs text-destructive">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {/* Confirmar senha */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Confirmar senha
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          aria-invalid={Boolean(state?.errors?.confirmPassword)}
          aria-describedby="confirmPassword-error"
        />
        {state?.errors?.confirmPassword && (
          <p id="confirmPassword-error" className="text-xs text-destructive">
            {state.errors.confirmPassword[0]}
          </p>
        )}
      </div>

      {/* Campos condicionais por role */}
      {role === "athlete" && (
        <div className="space-y-2">
          <label
            htmlFor="birthDate"
            className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground"
          >
            Data de nascimento
          </label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            required
            defaultValue={state?.values?.birthDate}
            aria-invalid={Boolean(state?.errors?.birthDate)}
            aria-describedby="birthDate-error"
          />
          {state?.errors?.birthDate && (
            <p id="birthDate-error" className="text-xs text-destructive">
              {state.errors.birthDate[0]}
            </p>
          )}
        </div>
      )}

      {role === "parent_guardian" && (
        <div className="space-y-2">
          <label
            htmlFor="athleteEmail"
            className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground"
          >
            E-mail do atleta
          </label>
          <Input
            id="athleteEmail"
            name="athleteEmail"
            type="email"
            required
            placeholder="E-mail da conta do atleta que você supervisiona"
            defaultValue={state?.values?.athleteEmail}
            aria-invalid={Boolean(state?.errors?.athleteEmail)}
            aria-describedby="athleteEmail-error"
          />
          <p className="text-xs text-muted-foreground">
            Informe o e-mail da conta do atleta que você supervisiona. O atleta
            precisa ter criado a conta antes.
          </p>
          {state?.errors?.athleteEmail && (
            <p id="athleteEmail-error" className="text-xs text-destructive">
              {state.errors.athleteEmail[0]}
            </p>
          )}
        </div>
      )}

      {/* Erro geral */}
      {state?.errors?.form && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {state.errors.form[0]}
        </div>
      )}

      <Button type="submit" disabled={pending} className="w-full h-11 font-bold">
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Criando conta...
          </>
        ) : (
          "Criar conta"
        )}
      </Button>
    </form>
  );
}
