// Grava os dados demo no Data Connect a partir dos mocks de src/lib/mock e
// src/lib/auth/mock-users.ts, pelas mutations de dataconnect/seed/seed.gql.
// Quem grava é a CLI do Firebase (`dataconnect:execute`), com as credenciais
// do `firebase login`.
//
// Emulador local:  DATA_CONNECT_EMULATOR_HOST=127.0.0.1:9399 npm run seed:data
// Projeto real:    npm run seed:data -- --project basketball-net
//
// Sem a variável do emulador no shell, o --project é obrigatório (ver
// seed-target.mjs): o seed sobrescreve os atletas demo.
//
// Os ids que já são UUID (atletas) passam direto. Os demais (tenant, eventos
// de performance, vínculos) viram UUID v5 do id antigo: o mesmo id gera sempre
// o mesmo UUID, então rodar de novo atualiza as linhas em vez de duplicar.
//
// Ficam de fora: `consents` (virá da tabela Consent, no consent flow LGPD) e
// `guardians[]` (contatos de responsáveis sem conta; nenhuma tela lê).

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

import { resolveSeedTarget } from "./seed-target.mjs";

let target;
try {
  target = resolveSeedTarget(process.argv.slice(2), process.env);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
const { projectId, emulator } = target;

// mock-users.ts importa "server-only", que só existe dentro do Next. Aqui ele
// vira um módulo vazio; por isso os mocks entram por import dinâmico, depois
// do hook.
registerHooks({
  resolve: (specifier, context, next) =>
    specifier === "server-only"
      ? { url: "data:text/javascript,", shortCircuit: true }
      : next(specifier, context),
});

const { mockAthletes } = await import("../src/lib/mock/athletes.ts");
const { mockPerformanceEvents } = await import("../src/lib/mock/performance.ts");
const { mockGuardianRelationships } = await import("../src/lib/mock/guardian-relationships.ts");
const { mockUsers } = await import("../src/lib/auth/mock-users.ts");

// Namespace fixo do basketball.net para o UUID v5. Não mude: os UUIDs gerados
// dependem dele.
const NAMESPACE = "6f1c2a9e-4b7d-4e3a-9c51-2d8f0b7a6e14";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function uuidV5(name) {
  const hash = createHash("sha1")
    .update(Buffer.from(NAMESPACE.replaceAll("-", ""), "hex"))
    .update(name)
    .digest();
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.subarray(0, 16).toString("hex");
  return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join("-");
}

function toUuid(id) {
  return UUID.test(id) ? id.toLowerCase() : uuidV5(id);
}

// Todos os mocks vivem num único tenant individual.
const tenantIds = new Set(mockAthletes.map((a) => a.tenantId));
if (tenantIds.size !== 1) {
  throw new Error(`Esperado um único tenant nos mocks, encontrados: ${[...tenantIds].join(", ")}`);
}
const [legacyTenantId] = tenantIds;

const tenant = {
  id: toUuid(legacyTenantId),
  type: "individual",
  name: "basketball.net demo",
  country: "BR",
  locale: "pt-BR",
  timezone: "America/Sao_Paulo",
  subscriptionTier: "free",
  subscriptionStatus: "active",
  status: "active",
};

const userIdByAthleteId = new Map(
  mockUsers.filter((u) => u.athleteId).map((u) => [u.athleteId, u.id]),
);

const users = mockUsers.map((u) => {
  const [firstName, ...rest] = u.name.split(" ");
  return {
    id: u.id,
    individualTenantId: tenant.id,
    firstName,
    lastName: rest.join(" "),
    email: u.email,
    emailVerified: true,
    globalRoles: u.roles,
    professionalSpecialties: u.specialties,
    status: "active",
  };
});

const athletes = mockAthletes.map((a) => {
  const v = a.visibility;
  return {
    id: toUuid(a.id),
    tenantId: tenant.id,
    userId: userIdByAthleteId.get(a.id) ?? null,
    slug: a.slug ?? null,
    firstName: a.profile.firstName,
    lastName: a.profile.lastName,
    preferredName: a.profile.preferredName ?? null,
    birthDate: a.profile.birthDate,
    gender: a.profile.gender,
    country: a.profile.country,
    state: a.profile.state ?? null,
    city: a.profile.city ?? null,
    nationality: a.profile.nationality ?? null,
    photoUrl: a.profile.photoUrl ?? null,
    bio: a.profile.bio ?? null,
    contactEmail: a.contact?.email ?? null,
    contactPhone: a.contact?.phone ?? null,
    contactInstagram: a.contact?.instagram ?? null,
    contactLinkedin: a.contact?.linkedin ?? null,
    discipline: a.sport.discipline,
    primaryPosition: a.sport.primaryPosition ?? null,
    secondaryPositions: a.sport.secondaryPositions ?? null,
    dominantSide: a.sport.dominantSide ?? null,
    heightCm: a.physicalProfile?.heightCm ?? null,
    weightKg: a.physicalProfile?.weightKg ?? null,
    wingspanCm: a.physicalProfile?.wingspanCm ?? null,
    bodyFatPct: a.physicalProfile?.bodyFatPct ?? null,
    physicalNotes: a.physicalProfile?.notes ?? null,
    category: a.category,
    education: a.education ?? null,
    career: a.career ?? null,
    media: a.media ?? null,
    status: a.status,
    publicProfileEnabled: v.publicProfileEnabled,
    discoverable: v.discoverable ?? false,
    showPhoto: v.showPhoto ?? false,
    showAge: v.showAge ?? false,
    showCity: v.showCity ?? false,
    showPhysicalProfile: v.showPhysicalProfile ?? false,
    showHighlightVideos: v.showHighlightVideos ?? false,
    showAchievements: v.showAchievements ?? false,
    showCurrentClub: v.showCurrentClub ?? false,
    showContact: v.showContact ?? false,
    showMatchStats: v.showMatchStats ?? false,
    showAssessmentStats: v.showAssessmentStats ?? false,
    pendingVisibility: a.pendingVisibility ?? null,
    tags: a.tags ?? null,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
});

const relationships = mockGuardianRelationships.map((r) => ({
  id: toUuid(r.id),
  tenantId: tenant.id,
  athleteId: toUuid(r.athleteId),
  guardianId: r.guardianUserId,
  relationshipType: r.relationshipType,
  isPrimary: r.isPrimary ?? null,
  legallyResponsible: r.legallyResponsible,
  status: r.status,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
}));

const events = mockPerformanceEvents.map((e) => {
  const { sourceType, ...context } = e.context;
  return {
    id: toUuid(e.id),
    tenantId: tenant.id,
    athleteId: toUuid(e.athleteId),
    sport: e.sport,
    sourceType,
    context,
    startedAt: e.period.startedAt,
    endedAt: e.period.endedAt,
    season: e.period.season ?? null,
    cycle: e.period.cycle ?? null,
    metrics: e.metrics,
    benchmarks: e.benchmarks ?? null,
    attachments: e.attachments ?? null,
    createdAt: e.createdAt,
  };
});

// A CLI só enxerga o emulador pela FIREBASE_DATA_CONNECT_EMULATOR_HOST, sem
// "http://" (ver seed-target.mjs).
const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const env = emulator
  ? { ...process.env, FIREBASE_DATA_CONNECT_EMULATOR_HOST: emulator }
  : process.env;

function execute(operation, variables) {
  const result = spawnSync(
    "npx",
    ["-y", "firebase-tools@15", "dataconnect:execute", "dataconnect/seed/seed.gql", operation,
      "--project", projectId, "--vars", "@-"],
    { cwd: repoRoot, env, input: JSON.stringify(variables), stdio: ["pipe", "pipe", "inherit"], encoding: "utf8" },
  );
  if (result.status !== 0) {
    console.error(result.stdout);
    throw new Error(`${operation} falhou (saída ${result.status})`);
  }
}

console.log(`Projeto ${projectId}${emulator ? ` (emulador em ${emulator})` : ""}`);

execute("SeedBase", { tenant, users, athletes, relationships });
console.log(`  base       1 tenant, ${users.length} usuários, ${athletes.length} atletas, ${relationships.length} vínculos`);

// O Data Connect recusa variáveis grandes (39 eventos já passam do limite).
const BATCH = 20;
for (let i = 0; i < events.length; i += BATCH) {
  execute("SeedEvents", { events: events.slice(i, i + BATCH) });
}
console.log(`  eventos    ${events.length}`);
