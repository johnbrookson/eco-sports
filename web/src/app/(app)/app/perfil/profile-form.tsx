"use client";

import { useActionState, useId, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  saveProfile,
  type ProfileFormState,
} from "@/lib/profile/actions";
import type { Athlete } from "@/types/athlete";

// Form editável do atleta. Divisão por seções com uma única ação de save.
// Toggles de visibilidade: master switch prominente no topo + toggles inline
// por seção (opção 5C do plano). A autorização autoritativa acontece dentro
// do saveProfile Server Action via DAL.

export function ProfileForm({ athlete }: { athlete: Athlete }) {
  const [state, formAction, pending] = useActionState<
    ProfileFormState,
    FormData
  >(saveProfile, undefined);

  const v = athlete.visibility;
  const achievementsText = athlete.career?.achievements?.join("\n") ?? "";

  // Toast de feedback após save
  const prevStateRef = useRef(state);
  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;
    if (!state) return;
    if (state.ok) {
      toast.success(state.message ?? "Perfil atualizado.");
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-10" noValidate>
      {/* Master: controles de exposição pública do perfil */}
      <PublicVisibilityCard
        publicProfileEnabled={v.publicProfileEnabled}
        discoverable={v.discoverable ?? false}
        slug={athlete.slug}
      />

      {/* Seção: Identidade */}
      <Section
        title="Identidade"
        description="Como você aparece no perfil público e dentro da plataforma."
      >
        <Row>
          <Field label="Primeiro nome" name="firstName" required>
            <Input
              name="firstName"
              defaultValue={athlete.profile.firstName}
              required
            />
          </Field>
          <Field label="Sobrenome" name="lastName" required>
            <Input
              name="lastName"
              defaultValue={athlete.profile.lastName}
              required
            />
          </Field>
        </Row>
        <Row>
          <Field
            label="Como gosta de ser chamado"
            name="preferredName"
            hint="Aparece no hero do perfil público."
          >
            <Input
              name="preferredName"
              defaultValue={athlete.profile.preferredName ?? ""}
            />
          </Field>
          <Field label="Data de nascimento" name="birthDate" required>
            <Input
              name="birthDate"
              type="date"
              defaultValue={athlete.profile.birthDate}
              required
            />
          </Field>
        </Row>
        <Row>
          <Field label="Cidade" name="city">
            <Input name="city" defaultValue={athlete.profile.city ?? ""} />
          </Field>
          <Field label="Estado (UF)" name="state">
            <Input
              name="state"
              defaultValue={athlete.profile.state ?? ""}
              maxLength={2}
            />
          </Field>
        </Row>
        <Field
          label="URL da foto"
          name="photoUrl"
          hint="https://... Por enquanto, cole uma URL pública. Upload real virá depois."
        >
          <Input
            name="photoUrl"
            type="url"
            defaultValue={athlete.profile.photoUrl ?? ""}
          />
        </Field>
        <Field
          label="Slug do perfil público"
          name="slug"
          hint={
            athlete.slug
              ? `URL atual: /atleta/${athlete.slug}`
              : "Letras minúsculas, números e hífens. Ex: joao-silva-2008"
          }
          required
        >
          <Input name="slug" defaultValue={athlete.slug ?? ""} required />
        </Field>
        <Field
          label="Bio editorial"
          name="bio"
          hint="Até 1000 caracteres. Aparece como bloco editorial no perfil público."
        >
          <Textarea
            name="bio"
            rows={6}
            defaultValue={athlete.profile.bio ?? ""}
            maxLength={1000}
          />
        </Field>
      </Section>

      {/* Seção: Esporte */}
      <Section
        title="Esporte"
        description="Categoria, posição e lado dominante."
      >
        <Row>
          <Field label="Categoria" name="category" required>
            <Input
              name="category"
              defaultValue={athlete.category}
              placeholder="sub-17"
              required
            />
          </Field>
          <Field label="Posição principal" name="primaryPosition">
            <select
              name="primaryPosition"
              defaultValue={athlete.sport.primaryPosition ?? ""}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">—</option>
              <option value="point_guard">Armador</option>
              <option value="shooting_guard">Ala-armador</option>
              <option value="small_forward">Ala</option>
              <option value="power_forward">Ala-pivô</option>
              <option value="center">Pivô</option>
            </select>
          </Field>
        </Row>
        <Field label="Lado dominante" name="dominantSide">
          <select
            name="dominantSide"
            defaultValue={athlete.sport.dominantSide ?? "right"}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="right">Destro</option>
            <option value="left">Canhoto</option>
            <option value="ambidextrous">Ambidestro</option>
            <option value="not_applicable">Não se aplica</option>
          </select>
        </Field>
      </Section>

      {/* Seção: Ficha Física */}
      <Section
        title="Ficha física"
        description="Medidas atualizadas para o perfil público."
        visibilityToggle={{
          name: "showPhysicalProfile",
          defaultChecked: v.showPhysicalProfile,
        }}
      >
        <Row>
          <Field label="Altura (cm)" name="heightCm">
            <Input
              name="heightCm"
              type="number"
              step="1"
              defaultValue={athlete.physicalProfile?.heightCm ?? ""}
            />
          </Field>
          <Field label="Peso (kg)" name="weightKg">
            <Input
              name="weightKg"
              type="number"
              step="1"
              defaultValue={athlete.physicalProfile?.weightKg ?? ""}
            />
          </Field>
          <Field label="Envergadura (cm)" name="wingspanCm">
            <Input
              name="wingspanCm"
              type="number"
              step="1"
              defaultValue={athlete.physicalProfile?.wingspanCm ?? ""}
            />
          </Field>
        </Row>
      </Section>

      {/* Seção: Carreira */}
      <Section
        title="Carreira"
        description="Clube atual, comissão técnica e conquistas."
        visibilityToggle={{
          name: "showCurrentClub",
          defaultChecked: v.showCurrentClub,
          label: "Mostrar clube atual no perfil público",
        }}
      >
        <Row>
          <Field label="Clube atual" name="currentClub">
            <Input
              name="currentClub"
              defaultValue={athlete.career?.currentClub ?? ""}
            />
          </Field>
          <Field label="Nome do técnico" name="coachName">
            <Input
              name="coachName"
              defaultValue={athlete.career?.coachName ?? ""}
            />
          </Field>
        </Row>
        <Field
          label="Conquistas"
          name="achievements"
          hint="Uma por linha. Aparecem numeradas no perfil público quando a visibilidade estiver ligada."
        >
          <Textarea
            name="achievements"
            rows={5}
            defaultValue={achievementsText}
          />
        </Field>
        <InlineToggle
          name="showAchievements"
          defaultChecked={v.showAchievements}
          label="Mostrar conquistas no perfil público"
        />
      </Section>

      {/* Seção: Mídia */}
      <Section
        title="Mídia"
        description="Vídeo de destaque exibido no perfil público."
        visibilityToggle={{
          name: "showHighlightVideos",
          defaultChecked: v.showHighlightVideos,
        }}
      >
        <Field
          label="URL do vídeo de destaque"
          name="highlightVideoUrl"
          hint="YouTube aceito. Outros providers caem no fallback por enquanto."
        >
          <Input
            name="highlightVideoUrl"
            type="url"
            defaultValue={athlete.media?.highlightVideoUrls?.[0] ?? ""}
          />
        </Field>
      </Section>

      {/* Seção: Contato */}
      <Section
        title="Contato"
        description="Canais que você quer disponibilizar para scouts e patrocinadores."
        visibilityToggle={{
          name: "showContact",
          defaultChecked: v.showContact,
        }}
      >
        <Row>
          <Field label="E-mail" name="email">
            <Input
              name="email"
              type="email"
              defaultValue={athlete.contact?.email ?? ""}
            />
          </Field>
          <Field label="Telefone" name="phone">
            <Input
              name="phone"
              type="tel"
              defaultValue={athlete.contact?.phone ?? ""}
            />
          </Field>
        </Row>
        <Row>
          <Field label="Instagram" name="instagram" hint="Ex: @seu.handle">
            <Input
              name="instagram"
              defaultValue={athlete.contact?.instagram ?? ""}
            />
          </Field>
          <Field label="LinkedIn (URL)" name="linkedin">
            <Input
              name="linkedin"
              type="url"
              defaultValue={athlete.contact?.linkedin ?? ""}
            />
          </Field>
        </Row>
      </Section>

      {/* Seção: Visibilidade extra (granular, campos que não cabem em seções) */}
      <Section
        title="Privacidade granular"
        description="Controle fino sobre o que aparece no perfil público."
      >
        <InlineToggle
          name="showPhoto"
          defaultChecked={v.showPhoto}
          label="Mostrar foto no hero"
        />
        <InlineToggle
          name="showAge"
          defaultChecked={v.showAge}
          label="Mostrar idade (calculada da data de nascimento)"
        />
        <InlineToggle
          name="showCity"
          defaultChecked={v.showCity}
          label="Mostrar cidade e estado"
        />
        <InlineToggle
          name="showMatchStats"
          defaultChecked={v.showMatchStats}
          label="Exibir estatísticas de partidas no perfil público"
        />
        <InlineToggle
          name="showAssessmentStats"
          defaultChecked={v.showAssessmentStats}
          label="Exibir avaliações físicas no perfil público"
        />
      </Section>

      {/* Footer sticky — save button */}
      <div className="sticky bottom-4 flex justify-end">
        <Button
          type="submit"
          disabled={pending}
          className="h-12 px-8 font-bold shadow-lg"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </div>
    </form>
  );
}

// ============================================================
// Section / Field primitives
// ============================================================

function Section({
  title,
  description,
  children,
  visibilityToggle,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  visibilityToggle?: {
    name: string;
    defaultChecked?: boolean;
    label?: string;
  };
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
            Seção
          </p>
          <h2 className="text-xl font-black tracking-tight">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              {description}
            </p>
          )}
        </div>
        {visibilityToggle && (
          <InlineToggle
            name={visibilityToggle.name}
            defaultChecked={visibilityToggle.defaultChecked}
            label={visibilityToggle.label ?? "Visível no perfil público"}
            compact
          />
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[auto_auto] lg:auto-cols-fr lg:grid-flow-col">
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  hint,
  required,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5 min-w-0">
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1.5"
      >
        {label}
        {required && <span className="text-primary">*</span>}
      </label>
      <div id={id}>{children}</div>
      {hint && (
        <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
      )}
      {/* Field-name attribute visível para CSS hooks futuros */}
      <span data-field={name} hidden />
    </div>
  );
}

function InlineToggle({
  name,
  defaultChecked,
  label,
  compact,
}: {
  name: string;
  defaultChecked?: boolean;
  label: string;
  compact?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer select-none ${
        compact ? "" : "py-1"
      }`}
    >
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="relative inline-flex h-5 w-9 shrink-0 rounded-full bg-muted transition-colors peer-checked:bg-primary">
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform peer-checked:translate-x-4" />
      </span>
      <span
        className={`${
          compact
            ? "text-xs font-bold uppercase tracking-[0.14em]"
            : "text-sm font-semibold"
        } text-foreground`}
      >
        {label}
      </span>
    </label>
  );
}

function PublicVisibilityCard({
  publicProfileEnabled,
  discoverable,
  slug,
}: {
  publicProfileEnabled: boolean;
  discoverable: boolean;
  slug?: string;
}) {
  return (
    <section className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 md:p-8">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Exposição pública
        </p>
        <h2 className="text-xl font-black tracking-tight">
          Onde seu perfil aparece
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Dois canais independentes: link direto (você controla quem recebe) e
          vitrine pública (qualquer pessoa pode te encontrar por busca).
          Ative apenas o que fizer sentido para você.
        </p>
      </div>

      <div className="space-y-4">
        <ToggleRow
          name="publicProfileEnabled"
          defaultChecked={publicProfileEnabled}
          title={`Publicar perfil em /atleta/${slug ?? "[seu-slug]"}`}
          description="Quando desligado, o link retorna 404 mesmo que os toggles individuais estejam ligados. Use quando quiser compartilhar o link manualmente com scouts, clubes ou patrocinadores."
        />
        <div className="border-t border-primary/20" />
        <ToggleRow
          name="discoverable"
          defaultChecked={discoverable}
          title="Aparecer na vitrine pública em /atletas"
          description="Quando ligado, qualquer visitante pode te encontrar através da busca pública. Requer que o perfil acima esteja publicado. Para atletas menores de idade, recomendamos manter desligado e compartilhar o link manualmente — é um nível de exposição materialmente maior."
          subtle
        />
      </div>
    </section>
  );
}

function ToggleRow({
  name,
  defaultChecked,
  title,
  description,
  subtle,
}: {
  name: string;
  defaultChecked: boolean;
  title: string;
  description: string;
  subtle?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <p
          className={`font-black tracking-tight ${
            subtle ? "text-base" : "text-lg"
          }`}
        >
          {title}
        </p>
        <p className="mt-1 text-xs md:text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
      <label className="flex items-center cursor-pointer shrink-0 mt-1">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <span className="relative inline-flex h-7 w-12 shrink-0 rounded-full bg-muted transition-colors peer-checked:bg-primary">
          <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-background shadow transition-transform peer-checked:translate-x-5" />
        </span>
      </label>
    </div>
  );
}
