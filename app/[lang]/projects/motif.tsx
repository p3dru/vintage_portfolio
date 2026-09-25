import type { Motif } from "./data";

// Um desenho por projeto, em traço fino na cor de destaque (currentColor).
const shapes: Record<Motif, React.ReactNode> = {
  // DisasterScan: ondas de alerta a partir de um ponto de risco.
  rings: (
    <>
      {[20, 40, 60, 80].map((r, i) => (
        <circle key={r} cx="100" cy="100" r={r} opacity={1 - i * 0.2} />
      ))}
      <circle cx="100" cy="100" r="6" fill="currentColor" />
      <path d="M100 8v14M100 178v14M8 100h14M178 100h14" />
    </>
  ),
  // Atlas Basis: grade em perspectiva com uma rota traçada.
  grid: (
    <>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={`v${i}`} d={`M${100 + (i - 3) * 12} 40L${100 + (i - 3) * 40} 190`} opacity="0.45" />
      ))}
      {[60, 90, 125, 165].map((y) => (
        <path key={`h${y}`} d={`M${100 - (y - 20) * 0.6} ${y}H${100 + (y - 20) * 0.6}`} opacity="0.45" />
      ))}
      <path d="M52 170L78 128L118 112L104 78L132 56" strokeWidth="3" />
      {[
        [52, 170],
        [118, 112],
        [132, 56],
      ].map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r="5" fill="currentColor" />
      ))}
    </>
  ),
  // Mini Lakehouse Agro: camadas Bronze → Silver → Gold.
  strata: (
    <>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={30 + i * 10}
          y={130 - i * 45}
          width={140 - i * 20}
          height="32"
          rx="8"
          fill="currentColor"
          fillOpacity={0.15 + i * 0.25}
        />
      ))}
      <path d="M100 128v-10M100 83v-10" strokeWidth="3" />
    </>
  ),
  // LibreETL: blocos de pipeline encadeados.
  pipeline: (
    <>
      {[
        [20, 40],
        [80, 80],
        [140, 40],
        [80, 140],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="40" height="28" rx="6" />
      ))}
      <path d="M60 54h20v26M120 94h20V68M100 108v32" strokeDasharray="4 4" />
      <circle cx="100" cy="94" r="4" fill="currentColor" />
    </>
  ),
  // Classificação de Grãos: grãos com caixas de detecção.
  grains: (
    <>
      {[
        [60, 60, -20],
        [130, 70, 25],
        [85, 130, 10],
        [145, 140, -35],
      ].map(([x, y, a], i) => (
        <g key={i} transform={`rotate(${a} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx="16" ry="24" fill="currentColor" fillOpacity={0.2 + i * 0.12} />
          <rect x={x - 24} y={y - 32} width="48" height="64" strokeDasharray="4 3" opacity="0.7" />
        </g>
      ))}
    </>
  ),
  // PPGZT: fachada acadêmica.
  columns: (
    <>
      <path d="M30 70L100 30L170 70Z" />
      <path d="M30 76h140M30 170h140M24 180h152" />
      {[48, 80, 112, 144].map((x) => (
        <rect key={x} x={x} y="84" width="10" height="80" rx="3" fill="currentColor" fillOpacity="0.25" />
      ))}
    </>
  ),
  // Ai BuildCore: núcleo conectado a agentes e skills.
  network: (
    <>
      {[
        [40, 50],
        [160, 45],
        [175, 125],
        [110, 175],
        [30, 140],
        [95, 20],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <path d={`M100 100L${x} ${y}`} opacity="0.5" />
          <circle cx={x} cy={y} r="8" />
        </g>
      ))}
      <path d="M40 50L95 20L160 45M175 125L110 175L30 140" opacity="0.3" />
      <circle cx="100" cy="100" r="16" fill="currentColor" fillOpacity="0.3" />
      <circle cx="100" cy="100" r="6" fill="currentColor" />
    </>
  ),
};

export default function ProjectMotif({ motif }: { motif: Motif }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full text-[var(--accent)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[motif]}
    </svg>
  );
}
