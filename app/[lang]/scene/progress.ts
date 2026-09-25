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
