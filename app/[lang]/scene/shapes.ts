// Formas da nuvem de partículas, uma por seção. Todas usam o mesmo número de pontos,
// então o morph é só interpolar posição a posição. Coordenadas cabem num raio ~1.

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

// Projetos: cubos empilhados (produtos entregues).
const cubes = build(2, (i, rand) => {
  const boxes: [Vec3, number][] = [
    [[-0.38, -0.5, 0], 0.62],
    [[0.38, -0.5, 0.05], 0.55],
    [[0, 0.25, -0.02], 0.6],
  ];
  const [center, size] = boxes[i % boxes.length];
  const axis = Math.floor(rand() * 3);
  const p: Vec3 = [rand() - 0.5, rand() - 0.5, rand() - 0.5];
  p[axis] = rand() < 0.5 ? -0.5 : 0.5;
  return [center[0] + p[0] * size, center[1] + p[1] * size, center[2] + p[2] * size];
});

// Fundamentos: base, pilares e topo.
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

// Sobre: hélice dupla (trajetória).
const helix = build(5, (i, rand) => {
  if (i % 7 === 0) {
    const t = Math.floor(rand() * 14) / 13;
    const angle = t * Math.PI * 4;
    const a: Vec3 = [Math.cos(angle) * 0.45, -1 + 2 * t, Math.sin(angle) * 0.45];
    return lerp3(a, [-a[0], a[1], -a[2]], rand());
  }
  const t = rand();
  const angle = t * Math.PI * 4 + (i % 2) * Math.PI;
  return [Math.cos(angle) * 0.45, -1 + 2 * t, Math.sin(angle) * 0.45];
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

export const shapes = [sphere, cubes, pillars, network, helix, plane];
