// Ciclo de desenvolvimento: um avião de papel percorre as etapas e acende cada uma ao passar.
// Só SVG + CSS (offset-path); a animação para com prefers-reduced-motion (ver globals.css).
const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = 78;
const LABEL_RADIUS = 108;
const LAP_SECONDS = 12;

export default function DevCycle({
  stages,
  center,
  label,
}: {
  stages: string[];
  center: string;
  label: string;
}) {
  const step = LAP_SECONDS / stages.length;
  return (
    <div className="relative h-[260px] w-[260px]" role="img" aria-label={label}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0" aria-hidden="true">
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
          strokeDasharray="4 6"
        />
        <text
          x={CENTER}
          y={CENTER}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[var(--muted)] text-[11px] uppercase tracking-[0.2em]"
        >
          {center}
        </text>
        {stages.map((stage, index) => {
          // Etapa 0 no topo, seguindo no sentido horário, como o avião.
          const angle = ((-90 + (360 / stages.length) * index) * Math.PI) / 180;
          const delay = { animationDelay: `${index * step}s` };
          return (
            <g key={stage}>
              <circle
                className="cycle-dot"
                style={delay}
                cx={CENTER + RADIUS * Math.cos(angle)}
                cy={CENTER + RADIUS * Math.sin(angle)}
                r="7"
                strokeWidth="2"
              />
              <text
                className="cycle-label text-[11px] font-semibold"
                style={delay}
                x={CENTER + LABEL_RADIUS * Math.cos(angle)}
                y={CENTER + LABEL_RADIUS * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {stage}
              </text>
            </g>
          );
        })}
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="dev-cycle-plane h-6 w-6 text-[var(--accent)]"
        style={{
          offsetPath: `path("M${CENTER},${CENTER - RADIUS} A${RADIUS},${RADIUS} 0 1,1 ${CENTER},${CENTER + RADIUS} A${RADIUS},${RADIUS} 0 1,1 ${CENTER},${CENTER - RADIUS}")`,
          animationDuration: `${LAP_SECONDS}s`,
        }}
        aria-hidden="true"
      >
        <path d="M3 11L21 4L14 21L11 13Z" fill="currentColor" fillOpacity="0.25" />
        <path
          d="M3 11L21 4L14 21L11 13ZM21 4L11 13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
