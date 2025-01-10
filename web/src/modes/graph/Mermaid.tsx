import { createResource, onMount, onCleanup, createMemo } from "solid-js";
import {
  createScheduled,
  debounce,
  throttle,
} from "@solid-primitives/scheduled";
import mermaid from "mermaid";
import elkLayouts from "@mermaid-js/layout-elk";
import panzoom, { PanZoom } from "panzoom";

import "./mermaid.css";

mermaid.registerLayoutLoaders(elkLayouts);
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  layout: "elk",
  elk: {
    nodePlacementStrategy: "LINEAR_SEGMENTS",
    cycleBreakingStrategy: "MODEL_ORDER",
  },
});

export interface MermaidProps {
  content: string;
  onClick?: (step: string) => void;
}

export function Mermaid(props: MermaidProps) {
  const scheduled = createScheduled((fn) => debounce(fn, 1000));

  const deferredContent = createMemo<string>((p) => {
    const value = props.content;
    return scheduled() ? value : p;
  }, props.content);

  const [svg] = createResource(deferredContent, async (content) => {
    const { svg } = await mermaid.render("mermaid", content);
    return svg;
  });

  let element: HTMLDivElement | undefined = undefined;
  let controls: PanZoom;

  onMount(() => {
    controls = panzoom(element!, {
      bounds: true,
      boundsPadding: 0.0,
    });
  });

  onCleanup(() => {
    controls.dispose();
  });

  function onClick(ev: MouseEvent) {
    const element = ev.target as Element;
    const parent = element.closest("g.node");
    if (!parent) return;
    const step = parent.getAttribute("id")?.split("-").slice(1, -1).join("-");
    if (step) props.onClick?.(step);
  }

  return <div id="mermaid" ref={element} onClick={onClick} innerHTML={svg()} />;
}
