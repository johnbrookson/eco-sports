import { getCurrentAthlete } from "@/lib/auth/dal";
import { getPerformanceEventsForAthlete } from "@/lib/mock/get-performance";
import { PerformanceDashboard } from "./performance-dashboard";
import { AddEventForm } from "./add-event-form";

export const metadata = {
  title: "Performance — Eco-Sports",
};

export default async function PerformancePage() {
  const athlete = await getCurrentAthlete();
  const events = await getPerformanceEventsForAthlete(athlete.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14 space-y-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Histórico
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Performance
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Seus jogos e avaliações físicas ao longo do tempo. Cada registro é
          um snapshot independente — partida, treino ou teste. Use o
          formulário no final para adicionar um evento novo.
        </p>
      </header>

      <PerformanceDashboard events={events} />

      <AddEventForm />
    </div>
  );
}
