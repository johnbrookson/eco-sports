"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Trophy, Activity, MapPin, CalendarDays } from "lucide-react";

import type { PerformanceEvent } from "@/types/performance";

// Dashboard de performance — client component porque recharts precisa de JS
// e o toggle entre Jogos / Avaliações é estado local.
// Recebe a lista completa de eventos do atleta; filtra por tipo para cada tab.

type Tab = "match" | "assessment";

export function PerformanceDashboard({
  events,
}: {
  events: PerformanceEvent[];
}) {
  const [tab, setTab] = useState<Tab>("match");

  const matches = useMemo(
    () => events.filter((e) => e.context.sourceType === "match"),
    [events],
  );
  const assessments = useMemo(
    () => events.filter((e) => e.context.sourceType === "assessment"),
    [events],
  );

  const visible = tab === "match" ? matches : assessments;

  return (
    <div className="space-y-6">
      <Tabs
        current={tab}
        onChange={setTab}
        matchCount={matches.length}
        assessmentCount={assessments.length}
      />

      {visible.length === 0 ? (
        <EmptyState tab={tab} />
      ) : tab === "match" ? (
        <MatchDashboard matches={matches} />
      ) : (
        <AssessmentDashboard assessments={assessments} />
      )}
    </div>
  );
}

// ============================================================
// Tabs
// ============================================================

function Tabs({
  current,
  onChange,
  matchCount,
  assessmentCount,
}: {
  current: Tab;
  onChange: (t: Tab) => void;
  matchCount: number;
  assessmentCount: number;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1">
      <TabButton
        active={current === "match"}
        onClick={() => onChange("match")}
        icon={<Trophy className="h-3.5 w-3.5" />}
        label="Partidas"
        count={matchCount}
      />
      <TabButton
        active={current === "assessment"}
        onClick={() => onChange("assessment")}
        icon={<Activity className="h-3.5 w-3.5" />}
        label="Avaliações"
        count={assessmentCount}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] font-black tabular-nums ${
          active ? "bg-primary-foreground/20" : "bg-muted-foreground/10"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ============================================================
// Match dashboard
// ============================================================

function MatchDashboard({ matches }: { matches: PerformanceEvent[] }) {
  const chronological = [...matches].sort(
    (a, b) =>
      new Date(a.period.startedAt).getTime() -
      new Date(b.period.startedAt).getTime(),
  );
  const recent = matches.slice(0, 5);

  const avg = (getter: (e: PerformanceEvent) => number | undefined) => {
    const values = recent.map(getter).filter((v): v is number => v != null);
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  const avgPts = avg((e) => e.metrics.points);
  const avgAst = avg((e) => e.metrics.assists);
  const avgReb = avg((e) => e.metrics.rebounds);
  const avgMin = avg((e) => e.metrics.minutesPlayed);

  const chartData = chronological.map((e) => ({
    label: formatChartLabel(e.period.startedAt),
    points: e.metrics.points ?? 0,
    assists: e.metrics.assists ?? 0,
    rebounds: e.metrics.rebounds ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Pontos / jogo" value={formatNumber(avgPts, 1)} hint="últimas 5" />
        <StatCard label="Assistências" value={formatNumber(avgAst, 1)} hint="últimas 5" />
        <StatCard label="Rebotes" value={formatNumber(avgReb, 1)} hint="últimas 5" />
        <StatCard label="Minutos" value={formatNumber(avgMin, 0)} hint="últimas 5" />
      </div>

      <ChartCard title="Evolução — pontos, assistências e rebotes por jogo">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickMargin={8}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickMargin={4}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ fontWeight: 700 }}
            />
            <Line
              type="monotone"
              dataKey="points"
              name="Pontos"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="assists"
              name="Assistências"
              stroke="var(--color-accent)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="rebounds"
              name="Rebotes"
              stroke="var(--color-chart-3)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <EventList events={matches} renderEvent={(e) => <MatchRow event={e} />} />
    </div>
  );
}

function MatchRow({ event }: { event: PerformanceEvent }) {
  const m = event.metrics;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {event.context.competition ?? "Partida"}
          </p>
          <p className="text-base font-black tracking-tight truncate">
            vs {event.context.opponent ?? "—"}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {formatDate(event.period.startedAt)}
          </p>
          {event.context.location && (
            <p className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
              <MapPin className="h-2.5 w-2.5" />
              <span className="truncate max-w-[200px]">{event.context.location}</span>
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-foreground/80">
        <StatInline label="MIN" value={m.minutesPlayed} />
        <StatInline label="PTS" value={m.points} bold />
        <StatInline label="AST" value={m.assists} />
        <StatInline label="REB" value={m.rebounds} />
        {m.steals !== undefined && <StatInline label="STL" value={m.steals} />}
        {m.blocks !== undefined && <StatInline label="BLK" value={m.blocks} />}
        {m.turnovers !== undefined && <StatInline label="TO" value={m.turnovers} />}
      </div>
    </div>
  );
}

// ============================================================
// Assessment dashboard
// ============================================================

function AssessmentDashboard({ assessments }: { assessments: PerformanceEvent[] }) {
  const chronological = [...assessments].sort(
    (a, b) =>
      new Date(a.period.startedAt).getTime() -
      new Date(b.period.startedAt).getTime(),
  );
  const latest = assessments[0];

  const avg = (getter: (e: PerformanceEvent) => number | undefined) => {
    const values = chronological
      .map(getter)
      .filter((v): v is number => v != null);
    if (values.length === 0) return null;
    return values[values.length - 1];
  };

  const chartData = chronological.map((e) => ({
    label: formatChartLabel(e.period.startedAt),
    vertical: e.metrics.verticalJumpCm ?? null,
    sprint: e.metrics.sprintSpeedMps ?? null,
    agility: e.metrics.agilitySeconds ?? null,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Impulsão vertical"
          value={
            avg((e) => e.metrics.verticalJumpCm) !== null
              ? `${avg((e) => e.metrics.verticalJumpCm)} cm`
              : "—"
          }
          hint="última avaliação"
        />
        <StatCard
          label="Sprint"
          value={
            avg((e) => e.metrics.sprintSpeedMps) !== null
              ? `${formatNumber(avg((e) => e.metrics.sprintSpeedMps) ?? 0, 2)} m/s`
              : "—"
          }
          hint="última avaliação"
        />
        <StatCard
          label="Agilidade"
          value={
            avg((e) => e.metrics.agilitySeconds) !== null
              ? `${formatNumber(avg((e) => e.metrics.agilitySeconds) ?? 0, 2)}s`
              : "—"
          }
          hint="última avaliação"
        />
        <StatCard
          label="Coach rating"
          value={
            latest?.metrics.coachRating !== undefined
              ? `${formatNumber(latest.metrics.coachRating, 1)}/10`
              : "—"
          }
          hint="mais recente"
        />
      </div>

      <ChartCard title="Evolução — impulsão vertical ao longo da temporada">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickMargin={8}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickMargin={4}
              domain={["dataMin - 2", "dataMax + 2"]}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ fontWeight: 700 }}
              formatter={(value) => [`${value} cm`, "Vertical"]}
            />
            <Line
              type="monotone"
              dataKey="vertical"
              name="Vertical (cm)"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <EventList
        events={assessments}
        renderEvent={(e) => <AssessmentRow event={e} />}
      />
    </div>
  );
}

function AssessmentRow({ event }: { event: PerformanceEvent }) {
  const m = event.metrics;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Avaliação {event.period.cycle ? `— ${event.period.cycle}` : ""}
          </p>
          <p className="text-base font-black tracking-tight truncate">
            {event.context.location ?? "Local não informado"}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {formatDate(event.period.startedAt)}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-foreground/80">
        {m.verticalJumpCm !== undefined && (
          <StatInline label="VERT" value={`${m.verticalJumpCm}cm`} />
        )}
        {m.sprintSpeedMps !== undefined && (
          <StatInline label="SPR" value={`${m.sprintSpeedMps}m/s`} />
        )}
        {m.agilitySeconds !== undefined && (
          <StatInline label="AGI" value={`${m.agilitySeconds}s`} />
        )}
        {m.enduranceScore !== undefined && (
          <StatInline label="END" value={`${m.enduranceScore}/10`} />
        )}
        {m.coachRating !== undefined && (
          <StatInline label="COACH" value={`${m.coachRating}/10`} bold />
        )}
      </div>
      {m.technicalNotes && (
        <p className="text-xs text-muted-foreground italic mt-1">
          &ldquo;{m.technicalNotes}&rdquo;
        </p>
      )}
    </div>
  );
}

// ============================================================
// Shared primitives
// ============================================================

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">
        {label}
      </p>
      <p className="text-3xl md:text-4xl font-black tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      {hint && (
        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
          {hint}
        </p>
      )}
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-4">
        {title}
      </p>
      {children}
    </div>
  );
}

function EventList<E extends PerformanceEvent>({
  events,
  renderEvent,
}: {
  events: E[];
  renderEvent: (e: E) => React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 md:px-6 py-3 border-b border-border flex items-center gap-2">
        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Histórico completo
        </p>
      </div>
      <ul className="divide-y divide-border">
        {events.map((event) => (
          <li key={event.id} className="px-5 md:px-6 py-4">
            {renderEvent(event)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatInline({
  label,
  value,
  bold,
}: {
  label: string;
  value: number | string | undefined;
  bold?: boolean;
}) {
  if (value === undefined) return null;
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      <span
        className={`tabular-nums ${bold ? "text-primary font-black" : "font-semibold"}`}
      >
        {value}
      </span>
    </span>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  const label = tab === "match" ? "partida" : "avaliação";
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
        Nenhum registro
      </p>
      <h3 className="text-lg font-black tracking-tight mb-2">
        Você ainda não registrou nenhuma {label}.
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Use o formulário abaixo para adicionar a primeira.
      </p>
    </div>
  );
}

// ============================================================
// Formatters
// ============================================================

function formatNumber(n: number, digits: number): string {
  if (Number.isNaN(n)) return "—";
  return n.toFixed(digits).replace(".", ",");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatChartLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}
