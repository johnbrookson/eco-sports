// Linhas de quadra de basquete ao fundo de heroes escuros (perfil do atleta,
// página "Em breve"). Fica atrás do conteúdo (-z-10) e herda a cor do texto.

export function CourtLines() {
  return (
    <svg
      className="absolute inset-0 -z-10 h-full w-full text-white opacity-[0.07]"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="20" y="20" width="960" height="560" />
        <line x1="500" y1="20" x2="500" y2="580" />
        <circle cx="500" cy="300" r="70" />
        <path d="M20 90 H150 A210 210 0 0 1 150 510 H20" />
        <path d="M980 90 H850 A210 210 0 0 0 850 510 H980" />
        <rect x="20" y="220" width="190" height="160" />
        <rect x="790" y="220" width="190" height="160" />
      </g>
    </svg>
  );
}
