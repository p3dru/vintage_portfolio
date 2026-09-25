// Formas da nuvem de partículas, uma por seção. Todas usam o mesmo número de pontos,
// então o morph é só interpolar posição a posição. Coordenadas cabem num raio ~1.

import type { Motif } from "../projects/data";

export const POINT_COUNT = 1400;

type Vec3 = [number, number, number];

// PRNG com semente: as formas saem idênticas a cada carregamento.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function build(seed: number, point: (i: number, rand: () => number) => Vec3) {
  const rand = seeded(seed);
  const out = new Float32Array(POINT_COUNT * 3);
  for (let i = 0; i < POINT_COUNT; i++) out.set(point(i, rand), i * 3);
  return out;
}

const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

// Ponto numa aresta de uma caixa (centro, tamanhos): 12 arestas, escolhidas ao acaso.
function onBoxEdge(center: Vec3, size: Vec3, rand: () => number): Vec3 {
  const axis = Math.floor(rand() * 3);
  const p: Vec3 = [rand() < 0.5 ? -0.5 : 0.5, rand() < 0.5 ? -0.5 : 0.5, rand() < 0.5 ? -0.5 : 0.5];
  p[axis] = rand() - 0.5;
  return [center[0] + p[0] * size[0], center[1] + p[1] * size[1], center[2] + p[2] * size[2]];
}

function onBoxFace(center: Vec3, size: Vec3, rand: () => number): Vec3 {
  const axis = Math.floor(rand() * 3);
  const p: Vec3 = [rand() - 0.5, rand() - 0.5, rand() - 0.5];
  p[axis] = rand() < 0.5 ? -0.5 : 0.5;
  return [center[0] + p[0] * size[0], center[1] + p[1] * size[1], center[2] + p[2] * size[2]];
}

function inBall(center: Vec3, radius: number, rand: () => number): Vec3 {
  const r = radius * Math.cbrt(rand());
  const theta = rand() * Math.PI * 2;
  const phi = Math.acos(2 * rand() - 1);
  return [
    center[0] + r * Math.sin(phi) * Math.cos(theta),
    center[1] + r * Math.cos(phi),
    center[2] + r * Math.sin(phi) * Math.sin(theta),
  ];
}

// Placas empilhadas de baixo (maior) para cima: contorno nítido e topo pontilhado.
function stackedPlates(seed: number, count: number, gap: number) {
  return build(seed, (i, rand) => {
    const k = i % count;
    const width = 1.7 - k * (0.9 / count);
    const center: Vec3 = [0, (k - (count - 1) / 2) * gap, 0];
    const size: Vec3 = [width, 0.1, width * 0.55];
    return rand() < 0.6 ? onBoxEdge(center, size, rand) : onBoxFace(center, size, rand);
  });
}

function onTriangle(a: Vec3, b: Vec3, c: Vec3, rand: () => number): Vec3 {
  let u = rand();
  let v = rand();
  if (u + v > 1) [u, v] = [1 - u, 1 - v];
  return [0, 1, 2].map((k) => a[k] + (b[k] - a[k]) * u + (c[k] - a[k]) * v) as Vec3;
}

// Início: esfera (núcleo).
const sphere = build(1, (i) => {
  const y = 1 - (2 * (i + 0.5)) / POINT_COUNT;
  const r = Math.sqrt(1 - y * y);
  const theta = i * Math.PI * (3 - Math.sqrt(5));
  return [Math.cos(theta) * r * 0.95, y * 0.95, Math.sin(theta) * r * 0.95];
});

// Projetos: cubos empilhados (produtos entregues). A maior parte dos pontos fica nas
// arestas, para os cubos lerem como cubos e não como nuvens.
const cubes = build(2, (i, rand) => {
  const boxes: [Vec3, number][] = [
    [[-0.4, -0.52, 0], 0.62],
    [[0.4, -0.52, 0.05], 0.55],
    [[0, 0.3, -0.02], 0.6],
  ];
  const [center, size] = boxes[i % boxes.length];
  const box: Vec3 = [size, size, size];
  return rand() < 0.7 ? onBoxEdge(center, box, rand) : onBoxFace(center, box, rand);
});

// Fundamentos: quatro placas, uma por grupo (produto, engenharia, dados, IA).
const plates = stackedPlates(3, 4, 0.5);

// Sobre: trilha sinuosa com quatro marcos (produto/front → full-stack → dados → IA).
const trailAt = (t: number): Vec3 => [
  Math.sin(t * Math.PI * 2.2) * 0.7,
  -0.9 + 1.8 * t,
  Math.cos(t * Math.PI * 2.2) * 0.35,
];
const trailMarks = [0.08, 0.36, 0.64, 0.92];
const trail = build(5, (i, rand) => {
  if (i % 10 < 3) return inBall(trailAt(trailMarks[i % trailMarks.length]), 0.1, rand);
  const [x, y, z] = trailAt(rand());
  return [x + (rand() - 0.5) * 0.03, y + (rand() - 0.5) * 0.03, z + (rand() - 0.5) * 0.03];
});

// PPGZT: fachada acadêmica (base, colunas e topo).
const pillars = build(3, (i, rand) => {
  if (i % 10 < 3) {
    const y = i % 2 ? -0.85 : 0.8;
    return [(rand() - 0.5) * 1.7, y + (rand() - 0.5) * 0.12, (rand() - 0.5) * 0.7];
  }
  const x = [-0.6, 0, 0.6][i % 3];
  const angle = rand() * Math.PI * 2;
  return [x + Math.cos(angle) * 0.13, -0.78 + rand() * 1.5, Math.sin(angle) * 0.13];
});

// IA: rede de nós conectados a um núcleo.
const nodes: Vec3[] = [[0, 0, 0]];
{
  const rand = seeded(40);
  for (let k = 0; k < 9; k++) {
    const angle = (k / 9) * Math.PI * 2;
    nodes.push([Math.cos(angle) * 0.85, (rand() - 0.5) * 1.6, Math.sin(angle) * 0.55]);
  }
}
const network = build(4, (i, rand) => {
  if (i % 20 < 11) {
    const node = nodes[i % nodes.length];
    const r = (i % nodes.length === 0 ? 0.16 : 0.08) * Math.cbrt(rand());
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    return [
      node[0] + r * Math.sin(phi) * Math.cos(theta),
      node[1] + r * Math.cos(phi),
      node[2] + r * Math.sin(phi) * Math.sin(theta),
    ];
  }
  const k = 1 + (i % (nodes.length - 1));
  const from = i % 2 ? nodes[0] : nodes[k];
  const to = i % 2 ? nodes[k] : nodes[(k % (nodes.length - 1)) + 1];
  return lerp3(from, to, rand());
});

// Contato: avião de papel.
const nose: Vec3 = [0.95, 0.25, 0];
const tail: Vec3 = [-0.75, 0.05, 0];
const plane = build(6, (i, rand) => {
  const faces: [Vec3, Vec3, Vec3][] = [
    [nose, tail, [-0.85, 0.12, 0.85]],
    [nose, tail, [-0.85, 0.12, -0.85]],
    [nose, tail, [-0.7, -0.45, 0]],
  ];
  const [a, b, c] = faces[i % 3];
  return onTriangle(a, b, c, rand);
});

export const shapes = [sphere, cubes, plates, network, trail, plane];

// Avião pousado: o contorno do ícone de avião de papel (viewBox 24, nariz em cima à direita),
// achatado em z=0, com a linha da dobra e um leve preenchimento. Mesmo desenho do mobile.
const icon = (u: number, v: number): Vec3 => [(u - 12) / 12, (12 - v) / 12, 0];
const iconOutline: [Vec3, Vec3][] = [
  [icon(3, 11), icon(21, 4)],
  [icon(21, 4), icon(14, 21)],
  [icon(14, 21), icon(11, 13)],
  [icon(11, 13), icon(3, 11)],
  [icon(21, 4), icon(11, 13)],
];
export const planeLanded = build(12, (i, rand) => {
  if (i % 12 === 0) {
    // Preenchimento esparso das duas abas do avião.
    return i % 2
      ? onTriangle(icon(3, 11), icon(21, 4), icon(11, 13), rand)
      : onTriangle(icon(21, 4), icon(14, 21), icon(11, 13), rand);
  }
  const [a, b] = iconOutline[i % iconOutline.length];
  return lerp3(a, b, rand());
});

// Formas das páginas de projeto (mesma ideia dos desenhos SVG de cada uma).
const alertRings = build(7, (i, rand) => {
  if (i % 10 < 3) return inBall([0, 0, 0], 0.32, rand);
  const r = [0.55, 0.78, 1][i % 3];
  const angle = rand() * Math.PI * 2;
  return [Math.cos(angle) * r, (rand() - 0.5) * 0.03, Math.sin(angle) * r];
});

const route: Vec3[] = [
  [-0.85, -0.35, 0.5],
  [-0.35, -0.15, 0.15],
  [0.1, -0.05, 0.4],
  [0.4, 0.15, -0.2],
  [0.85, 0.35, -0.45],
];
const routeGrid = build(8, (i, rand) => {
  if (i % 10 < 5) {
    const line = -1 + (Math.floor(rand() * 7) / 6) * 2;
    const along = rand() * 2 - 1;
    return i % 2 ? [line, -0.45, along] : [along, -0.45, line];
  }
  if (i % 10 < 8) {
    const k = Math.floor(rand() * (route.length - 1));
    return lerp3(route[k], route[k + 1], rand());
  }
  return inBall(route[i % route.length], 0.07, rand);
});

const pipelineBlocks: Vec3[] = [
  [-0.8, 0.3, 0],
  [-0.27, -0.3, 0],
  [0.27, 0.3, 0],
  [0.8, -0.3, 0],
];
const pipeline = build(9, (i, rand) => {
  if (i % 10 < 7) return onBoxEdge(pipelineBlocks[i % 4], [0.36, 0.36, 0.36], rand);
  const k = i % 3;
  return lerp3(pipelineBlocks[k], pipelineBlocks[k + 1], rand());
});

const grainSpots: [Vec3, number][] = [
  [[-0.55, 0.35, 0], 0.4],
  [[0.45, 0.45, 0.1], -0.5],
  [[-0.2, -0.4, 0.15], 0.2],
  [[0.55, -0.35, -0.1], -0.3],
];
const grains = build(10, (i, rand) => {
  const [center, angle] = grainSpots[i % grainSpots.length];
  let p: Vec3;
  if (rand() < 0.6) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    p = [0.16 * Math.sin(phi) * Math.cos(theta), 0.26 * Math.cos(phi), 0.16 * Math.sin(phi) * Math.sin(theta)];
  } else {
    p = onBoxEdge([0, 0, 0], [0.42, 0.62, 0.42], rand);
  }
  const [c, s] = [Math.cos(angle), Math.sin(angle)];
  return [center[0] + p[0] * c - p[1] * s, center[1] + p[0] * s + p[1] * c, center[2] + p[2]];
});

export const projectShapes: Record<Motif, Float32Array> = {
  rings: alertRings,
  grid: routeGrid,
  strata: stackedPlates(11, 3, 0.55),
  pipeline,
  grains,
  columns: pillars,
  network,
};
