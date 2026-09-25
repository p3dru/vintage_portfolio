"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import { smoothstep } from "./progress";
import { POINT_COUNT, shapes } from "./shapes";

const readAccent = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#b07d62";

// Nuvem de partículas que se transforma na forma da seção atual.
// Lê o progresso do scroll de progressRef a cada quadro (sem re-render do React).
export default function SectionScene({ progressRef }: { progressRef: RefObject<number> }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, 1, 0.1, 20);
    camera.position.z = 5.5;

    const positions = new Float32Array(shapes[0]);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    const material = new PointsMaterial({
      color: readAccent(),
      size: 0.035,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const points = new Points(geometry, material);
    points.rotation.x = 0.25;
    scene.add(points);

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = container;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // A cor acompanha o tema.
    const themeObserver = new MutationObserver(() => material.color.set(readAccent()));
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let shown = progressRef.current ?? 0;
    let lastShown = -1;
    let frame = requestAnimationFrame(function tick() {
      const target = progressRef.current ?? 0;
      // Movimento reduzido: troca direta para a forma da seção, sem morph nem rotação.
      shown = reducedMotion ? Math.round(target) : shown + (target - shown) * 0.08;

      if (Math.abs(shown - lastShown) > 1e-4) {
        lastShown = shown;
        const from = Math.min(Math.floor(shown), shapes.length - 1);
        const to = Math.min(from + 1, shapes.length - 1);
        const t = smoothstep(shown - from);
        const a = shapes[from];
        const b = shapes[to];
        for (let i = 0; i < POINT_COUNT * 3; i++) positions[i] = a[i] + (b[i] - a[i]) * t;
        geometry.attributes.position.needsUpdate = true;
      }

      if (!reducedMotion) points.rotation.y += 0.003;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progressRef]);

  return <div ref={containerRef} className="h-full w-full" aria-hidden="true" />;
}
