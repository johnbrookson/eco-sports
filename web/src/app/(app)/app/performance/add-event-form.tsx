"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addPerformanceEvent,
  type AddEventFormState,
} from "@/lib/performance/actions";

// Form para adicionar partida ou avaliação. Alterna os campos visíveis
// conforme o tipo selecionado. O `sourceType` vai como hidden input dentro
// de cada variante para que a discriminated union do Zod case corretamente.

type Variant = "match" | "assessment";

export function AddEventForm() {
  const [variant, setVariant] = useState<Variant>("match");
  const [state, formAction, pending] = useActionState<
    AddEventFormState,
    FormData
  >(addPerformanceEvent, undefined);

  return (
    <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <header className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Adicionar registro
        </p>
        <h2 className="text-xl font-black tracking-tight">
          Registre um evento novo
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha o tipo e preencha os campos. O registro aparece
          imediatamente no gráfico e na lista acima.
        </p>
      </header>

      <div className="mb-6 inline-flex items-center gap-1 rounded-xl border border-border bg-background p-1">
        <VariantButton
          active={variant === "match"}
          onClick={() => setVariant("match")}
          label="Partida"
        />
        <VariantButton
          active={variant === "assessment"}
          onClick={() => setVariant("assessment")}
          label="Avaliação"
        />
      </div>

      {state?.ok && (
        <div
          role="status"
          className="mb-5 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}
      {state?.ok === false && state?.message && (
        <div
          role="alert"
          className="mb-5 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      {variant === "match" ? (
        <MatchForm formAction={formAction} pending={pending} state={state} />
      ) : (
        <AssessmentForm formAction={formAction} pending={pending} state={state} />
      )}
    </section>
  );
}

function VariantButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

// ============================================================
// Match form
// ============================================================

function MatchForm({
  formAction,
  pending,
  state,
}: {
  formAction: (formData: FormData) => void;
  pending: boolean;
  state: AddEventFormState;
}) {
  const err = state?.errors;
  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="sourceType" value="match" />

      <Row>
        <Field label="Data e hora" name="startedAt" required error={err?.startedAt}>
          <Input
            name="startedAt"
            type="datetime-local"
            required
            defaultValue={defaultDateTime()}
          />
        </Field>
        <Field
          label="Duração total (min)"
          name="durationMinutes"
          required
          error={err?.durationMinutes}
          hint="Duração total do jogo (incluindo intervalos)."
        >
          <Input
            name="durationMinutes"
            type="number"
            min="1"
            defaultValue="100"
            required
          />
        </Field>
      </Row>

      <Row>
        <Field label="Competição" name="competition">
          <Input
            name="competition"
            placeholder="Ex: Campeonato Paulista Sub-17"
          />
        </Field>
        <Field label="Adversário" name="opponent">
          <Input name="opponent" placeholder="Ex: Pinheiros" />
        </Field>
      </Row>

      <Field label="Local" name="location">
        <Input name="location" placeholder="Ex: Ginásio do Ibirapuera" />
      </Field>

      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground pt-3 border-t border-border">
        Estatísticas individuais
      </p>

      <Row>
        <Field
          label="Minutos jogados"
          name="minutesPlayed"
          required
          error={err?.minutesPlayed}
        >
          <Input name="minutesPlayed" type="number" min="0" required />
        </Field>
        <Field label="Pontos" name="points" required error={err?.points}>
          <Input name="points" type="number" min="0" required />
        </Field>
      </Row>

      <Row>
        <Field label="Assistências" name="assists" required error={err?.assists}>
          <Input name="assists" type="number" min="0" required />
        </Field>
        <Field label="Rebotes" name="rebounds" required error={err?.rebounds}>
          <Input name="rebounds" type="number" min="0" required />
        </Field>
      </Row>

      <Row>
        <Field label="Roubadas" name="steals">
          <Input name="steals" type="number" min="0" />
        </Field>
        <Field label="Tocos" name="blocks">
          <Input name="blocks" type="number" min="0" />
        </Field>
        <Field label="Turnovers" name="turnovers">
          <Input name="turnovers" type="number" min="0" />
        </Field>
      </Row>

      <Field label="Anotações" name="notes">
        <Textarea name="notes" rows={3} maxLength={500} />
      </Field>

      <SubmitButton pending={pending} label="Registrar partida" />
    </form>
  );
}

// ============================================================
// Assessment form
// ============================================================

function AssessmentForm({
  formAction,
  pending,
  state,
}: {
  formAction: (formData: FormData) => void;
  pending: boolean;
  state: AddEventFormState;
}) {
  const err = state?.errors;
  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="sourceType" value="assessment" />

      <Row>
        <Field label="Data e hora" name="startedAt" required error={err?.startedAt}>
          <Input
            name="startedAt"
            type="datetime-local"
            required
            defaultValue={defaultDateTime()}
          />
        </Field>
        <Field
          label="Duração (min)"
          name="durationMinutes"
          required
          error={err?.durationMinutes}
        >
          <Input
            name="durationMinutes"
            type="number"
            min="1"
            defaultValue="90"
            required
          />
        </Field>
      </Row>

      <Field label="Local" name="location">
        <Input name="location" placeholder="Ex: CT Laranjeiras" />
      </Field>

      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground pt-3 border-t border-border">
        Medições
      </p>

      <Row>
        <Field label="Impulsão vertical (cm)" name="verticalJumpCm">
          <Input name="verticalJumpCm" type="number" step="0.5" min="0" />
        </Field>
        <Field label="Sprint (m/s)" name="sprintSpeedMps">
          <Input name="sprintSpeedMps" type="number" step="0.01" min="0" />
        </Field>
      </Row>

      <Row>
        <Field label="Agilidade (seg)" name="agilitySeconds">
          <Input name="agilitySeconds" type="number" step="0.01" min="0" />
        </Field>
        <Field label="Resistência (0-10)" name="enduranceScore">
          <Input
            name="enduranceScore"
            type="number"
            step="0.1"
            min="0"
            max="10"
          />
        </Field>
      </Row>

      <Field label="Coach rating (0-10)" name="coachRating">
        <Input name="coachRating" type="number" step="0.1" min="0" max="10" />
      </Field>

      <Field label="Anotações técnicas" name="notes">
        <Textarea name="notes" rows={3} maxLength={500} />
      </Field>

      <SubmitButton pending={pending} label="Registrar avaliação" />
    </form>
  );
}

// ============================================================
// Primitives
// ============================================================

function Row({ children }: { children: React.ReactNode }) {
  const count = Array.isArray(children) ? children.length : 1;
  const gridCols =
    count === 3 ? "md:grid-cols-3" : count === 2 ? "md:grid-cols-2" : "";
  return <div className={`grid gap-5 ${gridCols}`}>{children}</div>;
}

function Field({
  label,
  name,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string[];
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 min-w-0">
      <label
        htmlFor={name}
        className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1.5"
      >
        {label}
        {required && <span className="text-primary">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error[0]}</p>}
      {hint && !error && (
        <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
      )}
    </div>
  );
}

function SubmitButton({
  pending,
  label,
}: {
  pending: boolean;
  label: string;
}) {
  return (
    <div className="pt-3 flex justify-end">
      <Button
        type="submit"
        disabled={pending}
        className="h-11 px-6 font-bold gap-2"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            {label}
          </>
        )}
      </Button>
    </div>
  );
}

function defaultDateTime(): string {
  // Default: "agora" arredondado para o minuto, no formato esperado pelo input.
  const now = new Date();
  now.setSeconds(0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}
