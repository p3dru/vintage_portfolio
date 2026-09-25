"use client";

import { useEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import type { Motif } from "../projects/data";
import { smoothstep } from "./progress";
import { POINT_COUNT, projectShapes, shapes } from "./shapes";

const ASSEMBLE_MS = 1400;

// Resolve qualquer cor CSS (inclusive color-mix) para o formato que o three entende.
function resolveColor(css: string) {
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return "#b07d62";
  context.fillStyle = css;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

// Forma 3D do topo da página de projeto: as partículas saem de uma esfera, montam a
// forma do projeto e giram devagar. Cor = --draw do projeto (via `color` do container).
export default function ProjectScene({ motif }: { motif: Motif }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(40, 1, 0.1, 20);
    camera.position.z = 3.4;

    const start = shapes[0];
    const target = projectShapes[motif];
    const positions = new Float32Array(start);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    const material = new PointsMaterial({
      color: resolveColor(getComputedStyle(container).color),
      size: 1.8 * pixelRatio,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const points = new Points(geometry, material);
    points.rotation.x = 0.35;
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

    const themeObserver = new MutationObserver(() =>
      material.color.set(resolveColor(getComputedStyle(container).color))
    );
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let assembled = false;
    let begin = -1;
    let frame = requestAnimationFrame(function tick(time) {
      if (begin < 0) begin = time;
      if (!assembled) {
        const k = smoothstep(Math.min(1, (time - begin) / ASSEMBLE_MS));
        for (let i = 0; i < POINT_COUNT * 3; i++) positions[i] = start[i] + (target[i] - start[i]) * k;
        geometry.attributes.position.needsUpdate = true;
        assembled = k >= 1;
      }
      points.rotation.y += 0.004;
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
  }, [motif]);

  return (
    <div ref={containerRef} className="h-full w-full text-[var(--draw)]" aria-hidden="true" />
  );
}
