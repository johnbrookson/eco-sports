"use client";

import { useState } from "react";
import { Play } from "lucide-react";

// Player leve (padrão do site do EC): mostra só a miniatura do YouTube e
// troca pelo iframe no clique, para não carregar o player inteiro em cada
// visita ao perfil. Ocupa o container pai, que define a proporção.
export function LiteYouTube({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Assistir: ${title}`}
      className="group absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- miniatura externa do YouTube, sem otimização do next/image */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
      />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground transition-transform group-hover:scale-110">
        <Play className="ml-1 h-7 w-7 fill-current" />
      </span>
    </button>
  );
}
