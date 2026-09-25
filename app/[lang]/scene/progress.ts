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

export function flightPhases(flight: number) {
  return {
    form: clamp01(flight / FORM_SHARE),
    travel: clamp01((flight - FORM_SHARE) / (1 - FORM_SHARE)),
  };
}

// O scroll só decide QUANDO voar: arma quando o topo do contato sobe acima de armAt
// (fração da altura da tela) ou a página chega ao fim; desarma só abaixo de disarmAt,
// para não ficar indo e voltando na fronteira. O voo em si é conduzido pelo tempo.
export function flightArmed(
  topRatio: number,
  atBottom: boolean,
  wasArmed: boolean,
  armAt = 0.65,
  disarmAt = 0.75
) {
  if (atBottom || topRatio <= armAt) return true;
  if (topRatio > disarmAt) return false;
  return wasArmed;
}

export const FLIGHT_MS = 2600;
