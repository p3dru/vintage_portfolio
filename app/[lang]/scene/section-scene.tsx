"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Line,
  LineDashedMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import { flightPhases, smoothstep } from "./progress";
import { POINT_COUNT, shapes } from "./shapes";

export type Flight = { progress: number; target: HTMLElement | null };

const TRAIL_POINTS = 64;
const LANDED_RADIUS = 22; // px: tamanho do avião estacionado no canal
const TAU = Math.PI * 2;

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
    scene.add(points);

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
        : travelShown + (travelTarget - travelShown) * 0.12;
      const t = smoothstep(travelShown);

      if (Math.abs(shown - lastShown) > 1e-4) {
        lastShown = shown;
        const from = Math.min(Math.floor(shown), shapes.length - 1);
        const to = Math.min(from + 1, shapes.length - 1);
        const k = smoothstep(shown - from);
        const a = shapes[from];
        const b = shapes[to];
        for (let i = 0; i < POINT_COUNT * 3; i++) positions[i] = a[i] + (b[i] - a[i]) * k;
        geometry.attributes.position.needsUpdate = true;
      }

      // Lateral: centro do espaço entre o fim do conteúdo e a borda direita.
      const railX = ((main?.getBoundingClientRect().right ?? width * 0.8) + width) / 2;
      const railY = height / 2;
      const railRadius = Math.min((width - railX) * 0.85, height * 0.28, 200);
      const card = flight.target?.getBoundingClientRect();
      // Pousa no canto superior direito do card, ao lado do rótulo curto.
      const landX = card ? card.right - LANDED_RADIUS - 10 : railX;
      const landY = card ? card.top + LANDED_RADIUS + 4 : railY;
      const controlX = (railX + landX) / 2;
      const controlY = Math.min(railY, landY) - height * 0.3;

      const bob = travelShown > 0.99 && !reducedMotion ? Math.sin(time / 500) * 2 : 0;
      const goalX = bezier(railX, controlX, landX, t);
      const goalY = bezier(railY, controlY, landY, t) + bob;
      // Primeiro quadro (ou movimento reduzido): vai direto; depois, desliza até o alvo.
      const ease = reducedMotion || Number.isNaN(position.x) ? 1 : 0.2;
      position.x = Number.isNaN(position.x) ? goalX : position.x + (goalX - position.x) * ease;
      position.y = Number.isNaN(position.y) ? goalY : position.y + (goalY - position.y) * ease;

      const unit = visibleHeight / height;
      points.position.set((position.x - width / 2) * unit, (height / 2 - position.y) * unit, 0);
      points.scale.setScalar((railRadius + (LANDED_RADIUS - railRadius) * t) * unit);
      material.size = (2.5 - t) * pixelRatio;

      if (travelShown < 0.001) {
        if (!reducedMotion) spin += 0.003;
        points.rotation.set(0.25, spin, 0);
      } else {
        // Em voo o nariz aponta para a esquerda (giro → π) e segue a tangente da curva,
        // inclinando no meio do trajeto e nivelando ao pousar.
        const nearestLeft = Math.round((spin - Math.PI) / TAU) * TAU + Math.PI;
        spin += (nearestLeft - spin) * 0.1;
        const slopeX = bezierSlope(railX, controlX, landX, t);
        const slopeY = bezierSlope(railY, controlY, landY, t);
        const heading = Math.atan2(slopeY, -slopeX) * (1 - smoothstep(Math.min(1, t / 0.9)));
        const bank = Math.sin(t * Math.PI) * 0.6;
        const idle = travelShown > 0.99 && !reducedMotion ? Math.sin(time / 900) * 0.25 : 0;
        points.rotation.set(0.25 + bank, spin + idle, heading);
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
