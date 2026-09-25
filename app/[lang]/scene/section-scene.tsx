"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Group,
  Line,
  LineDashedMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import { flightPhases, smoothstep } from "./progress";
import { planeLanded, POINT_COUNT, shapes } from "./shapes";

export type Flight = { progress: number; target: HTMLElement | null };

const TRAIL_POINTS = 64;
const LANDED_RADIUS = 16; // px: avião pousado ≈ 24px de largura
const ICON_INSET = 26; // px: ponto de pouso a partir do canto superior direito do card
const HOP_MS = 900; // salto em arco entre canais
const TAU = Math.PI * 2;
const LEFT = Math.PI; // giro com o nariz para a esquerda (0 = direita)

// Ângulo equivalente a `angle` mais próximo de `from`, só avançando, ou pelo lado mais curto.
const forwardTo = (from: number, angle: number) => from + ((((angle - from) % TAU) + TAU) % TAU);
const nearestTo = (from: number, angle: number) =>
  from + (((((angle - from) % TAU) + TAU + Math.PI) % TAU) - Math.PI);

const readAccent = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#b07d62";

// Ponto da curva de Bézier quadrática S → C → E.
const bezier = (s: number, c: number, e: number, t: number) =>
  (1 - t) * (1 - t) * s + 2 * (1 - t) * t * c + t * t * e;
const bezierSlope = (s: number, c: number, e: number, t: number) =>
  2 * (1 - t) * (c - s) + 2 * t * (e - c);

// Nuvem de partículas em tela cheia (transparente, sem capturar cliques).
// Na lateral direita assume a forma de cada seção; no Contato vira avião, voa até o
// canal em flightRef.target e pousa. Tudo lido de refs a cada quadro, sem re-render.
export default function SectionScene({
  progressRef,
  flightRef,
}: {
  progressRef: RefObject<number>;
  flightRef: RefObject<Flight>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(pixelRatio);
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.z = 10;
    // Altura visível no plano z=0; converte px de tela em unidades do mundo.
    const visibleHeight = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);

    const positions = new Float32Array(shapes[0]);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    const material = new PointsMaterial({
      color: readAccent(),
      size: 2.5 * pixelRatio,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const points = new Points(geometry, material);
    // Rolagem (x, no eixo do nariz) → giro (y) → rumo na tela (z).
    points.rotation.order = "ZYX";
    // O grupo leva a posição e a inclinação para a câmera; pousado, mostra as asas de cima.
    const body = new Group();
    body.add(points);
    scene.add(body);

    const trailPositions = new Float32Array(TRAIL_POINTS * 3);
    const trailGeometry = new BufferGeometry();
    trailGeometry.setAttribute("position", new BufferAttribute(trailPositions, 3));
    const trailMaterial = new LineDashedMaterial({
      color: readAccent(),
      dashSize: 0.06,
      gapSize: 0.08,
      transparent: true,
      opacity: 0,
    });
    const trail = new Line(trailGeometry, trailMaterial);
    scene.add(trail);

    let width = 0;
    let height = 0;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // A cor acompanha o tema.
    const themeObserver = new MutationObserver(() => {
      material.color.set(readAccent());
      trailMaterial.color.set(readAccent());
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const main = document.querySelector("main");
    let shown = progressRef.current ?? 0;
    let lastShown = -1;
    let travelShown = 0;
    let spin = 0;
    let settle = 0;
    let lastSettle = -1;
    let facing = LEFT;
    let parkedOn: HTMLElement | null = null;
    let hop: { fromX: number; fromY: number; start: number } | null = null;
    // Card onde o avião assentou: recebe data-parked (destaque via CSS).
    let parkedCard: HTMLElement | null = null;
    const park = (card: HTMLElement | null) => {
      if (parkedCard && parkedCard !== card) parkedCard.removeAttribute("data-parked");
      parkedCard = card;
      card?.setAttribute("data-parked", "");
    };
    const position = { x: NaN, y: NaN };

    let frame = requestAnimationFrame(function tick(time) {
      const flight = flightRef.current ?? { progress: 0, target: null };
      const { form, travel: travelTarget } = flightPhases(flight.progress);

      // Movimento reduzido: troca direta de forma e de lugar, sem morph, voo nem giro.
      const morphTarget = Math.max(progressRef.current ?? 0, shapes.length - 2 + form);
      const target = flight.progress > 0 ? morphTarget : (progressRef.current ?? 0);
      shown = reducedMotion ? Math.round(target) : shown + (target - shown) * 0.08;
      travelShown = reducedMotion
        ? Math.round(travelTarget)
        : travelShown + (travelTarget - travelShown) * 0.05;
      const t = smoothstep(travelShown);
      const landed = travelShown > 0.99;

      // Lateral: centro do espaço entre o fim do conteúdo e a borda direita.
      const railX = ((main?.getBoundingClientRect().right ?? width * 0.8) + width) / 2;
      const railY = height / 2;
      const railRadius = Math.min((width - railX) * 0.6, height * 0.2, 150);
      const card = flight.target?.getBoundingClientRect();
      // Pousa no canto superior direito do card, onde fica o ícone .card-plane.
      const landX = card ? card.right - ICON_INSET : railX;
      const landY = card ? card.top + ICON_INSET : railY;
      const controlX = (railX + landX) / 2;
      const controlY = Math.min(railY, landY) - height * 0.25;

      // Já pousado e o alvo mudou (hover em outro canal): salta em arco até ele.
      if (!landed || reducedMotion) {
        parkedOn = null;
        hop = null;
      } else if (parkedOn && flight.target && flight.target !== parkedOn) {
        hop = { fromX: position.x, fromY: position.y, start: time };
        facing = landX > position.x ? 0 : LEFT;
        parkedOn = flight.target;
      } else {
        parkedOn ??= flight.target;
      }

      let slopeX: number;
      let slopeY: number;
      let bank: number;
      let headingWeight: number;
      let flare: number;
      if (hop) {
        const h = smoothstep(Math.min(1, (time - hop.start) / HOP_MS));
        const hopControlX = (hop.fromX + landX) / 2;
        const hopControlY = Math.min(hop.fromY, landY) - 70;
        position.x = bezier(hop.fromX, hopControlX, landX, h);
        position.y = bezier(hop.fromY, hopControlY, landY, h);
        slopeX = bezierSlope(hop.fromX, hopControlX, landX, h);
        slopeY = bezierSlope(hop.fromY, hopControlY, landY, h);
        flare = Math.sin(Math.PI * Math.min(1, Math.max(0, (h - 0.7) / 0.3))) * 0.3;
        bank = Math.sin(h * Math.PI) * 0.5;
        headingWeight = Math.sin(h * Math.PI);
        if (h >= 1) hop = null;
      } else {
        const goalX = bezier(railX, controlX, landX, t);
        const goalY = bezier(railY, controlY, landY, t);
        // Primeiro quadro (ou movimento reduzido): vai direto; depois, desliza até o alvo.
        const ease = reducedMotion ? 1 : 0.2;
        position.x = Number.isNaN(position.x) ? goalX : position.x + (goalX - position.x) * ease;
        position.y = Number.isNaN(position.y) ? goalY : position.y + (goalY - position.y) * ease;
        slopeX = bezierSlope(railX, controlX, landX, t);
        slopeY = bezierSlope(railY, controlY, landY, t);
        // Arremetida: no fim do trajeto o nariz levanta, como um avião de papel perdendo velocidade.
        flare = Math.sin(Math.PI * Math.min(1, Math.max(0, (t - 0.8) / 0.2))) * 0.35;
        bank = Math.sin(t * Math.PI) * 0.6;
        headingWeight = 1 - smoothstep(Math.min(1, t / 0.9));
        if (travelShown < 0.001) facing = LEFT;
      }

      // Pousado: o avião 3D se "dobra" no contorno plano do avião de papel, de frente para a
      // câmera; ao sair (novo salto ou scroll para cima), desdobra de volta.
      const resting = landed && !hop;
      settle = reducedMotion ? Number(resting) : settle + (Number(resting) - settle) * 0.09;
      const s = smoothstep(settle);
      park(resting && settle > 0.9 ? flight.target : null);

      if (Math.abs(shown - lastShown) > 1e-4 || Math.abs(settle - lastSettle) > 1e-4) {
        lastShown = shown;
        lastSettle = settle;
        const from = Math.min(Math.floor(shown), shapes.length - 1);
        const to = Math.min(from + 1, shapes.length - 1);
        const k = smoothstep(shown - from);
        const a = shapes[from];
        const b = shapes[to];
        for (let i = 0; i < POINT_COUNT * 3; i++) {
          const base = a[i] + (b[i] - a[i]) * k;
          positions[i] = base + (planeLanded[i] - base) * s;
        }
        geometry.attributes.position.needsUpdate = true;
      }

      // Toque: afunda 3px e comprime de leve enquanto assenta.
      const touch = reducedMotion ? 0 : Math.sin(s * Math.PI);

      const unit = visibleHeight / height;
      body.position.set(
        (position.x - width / 2) * unit,
        (height / 2 - position.y - touch * 3) * unit,
        0
      );
      body.rotation.x = (0.25 + 0.35 * t) * (1 - s);
      const radius = (railRadius + (LANDED_RADIUS - railRadius) * t) * unit;
      points.scale.set(radius * (1 + touch * 0.06), radius * (1 - touch * 0.12), radius);
      // Pontos finos ao assentar, para o contorno e a dobra lerem como desenho.
      material.size = (2.5 - t - 0.5 * s) * pixelRatio;

      if (flight.progress <= 0) {
        // Lateral: formas girando devagar.
        if (!reducedMotion) spin += 0.003;
        points.rotation.set(0, spin, 0);
      } else if (travelShown < 0.001) {
        // Virando avião na lateral: o giro desacelera até o nariz apontar para a esquerda,
        // sempre no mesmo sentido, sem meia-volta.
        spin = reducedMotion ? LEFT : spin + (forwardTo(spin, LEFT) - spin) * 0.05;
        points.rotation.set(0, spin, 0);
      } else {
        // Em voo o nariz segue a tangente da curva, inclinando no meio e nivelando ao pousar.
        spin = reducedMotion ? facing : spin + (nearestTo(spin, facing) - spin) * 0.12;
        const heading = Math.atan2(-slopeY, slopeX) - facing;
        const wrapped = Math.atan2(Math.sin(heading), Math.cos(heading)) * headingWeight;
        // Nariz para cima: rotação negativa com o nariz à esquerda, positiva à direita.
        const noseUp = (facing === LEFT ? -1 : 1) * flare;
        points.rotation.set(bank * (1 - s), spin, (wrapped + noseUp) * (1 - s));
      }

      // Trilha tracejada do ponto de partida até o avião; some ao pousar.
      trailMaterial.opacity = reducedMotion ? 0 : 0.45 * Math.sin(Math.min(1, t) * Math.PI);
      if (trailMaterial.opacity > 0.01) {
        for (let i = 0; i < TRAIL_POINTS; i++) {
          const u = (t * i) / (TRAIL_POINTS - 1);
          trailPositions[i * 3] = (bezier(railX, controlX, landX, u) - width / 2) * unit;
          trailPositions[i * 3 + 1] = (height / 2 - bezier(railY, controlY, landY, u)) * unit;
        }
        trailGeometry.attributes.position.needsUpdate = true;
        trail.computeLineDistances();
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(frame);
      park(null);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      trailGeometry.dispose();
      trailMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progressRef, flightRef]);

  return <div ref={containerRef} className="h-full w-full" aria-hidden="true" />;
}
