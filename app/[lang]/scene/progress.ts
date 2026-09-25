// Progresso contínuo entre seções: 0 = primeira seção, n-1 = última.
// Cada fronteira entre seções contribui de 0 a 1 enquanto a linha central da tela
// atravessa uma faixa de ±band px ao redor do topo da seção seguinte. Fora dessas
// faixas o valor fica parado num inteiro, e a forma descansa.
export function sectionProgress(tops: number[], midline: number, band: number) {
  let progress = 0;
  for (let k = 1; k < tops.length; k++) {
    progress += Math.min(1, Math.max(0, (midline - tops[k] + band) / (2 * band)));
  }
  return progress;
}

export const smoothstep = (t: number) => t * t * (3 - 2 * t);

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// Voo do Contato (flight 0..1, conduzido pelo scroll): no primeiro trecho a nuvem
// termina de virar avião ainda na lateral; no resto ele cruza até o canal e pousa.
const FORM_SHARE = 0.3;
export const LANDED_AT = 0.97;

export function flightPhases(flight: number) {
  return {
    form: clamp01(flight / FORM_SHARE),
    travel: clamp01((flight - FORM_SHARE) / (1 - FORM_SHARE)),
  };
}

// Quanto do voo já aconteceu, dado onde está o topo da seção de contato.
// Começa quando o topo cruza startTop e termina no fim da página.
export function flightProgress(top: number, startTop: number, topAtBottom: number) {
  const span = startTop - topAtBottom;
  if (span <= 1) return top <= startTop ? 1 : 0;
  return clamp01((startTop - top) / span);
}
