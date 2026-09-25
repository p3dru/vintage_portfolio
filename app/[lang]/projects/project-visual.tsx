"use client";

import dynamic from "next/dynamic";
import { DESKTOP_QUERY, REDUCED_MOTION_QUERY, useMediaQuery } from "../media";
import type { Motif } from "./data";
import ProjectMotif from "./motif";

// three.js só é baixado no desktop e sem movimento reduzido; senão, fica o desenho SVG.
const ProjectScene = dynamic(() => import("../scene/project-scene"), { ssr: false });

export default function ProjectVisual({ motif }: { motif: Motif }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  return isDesktop && !reducedMotion ? <ProjectScene motif={motif} /> : <ProjectMotif motif={motif} />;
}
