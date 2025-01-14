import { createMemo, For, Show } from "solid-js";
import { SolidMarkdown } from "solid-markdown";
import { Button } from "$components/Button";
import type { Step } from "$lib/content";
import { RESTART_STEP } from "./guide";

export interface StepPageProps {
  step: Step;
  onAction?: (target: string) => void;
  hidden?: boolean;
}

export function StepPage(props: StepPageProps) {
  const options = createMemo(() => {
    const options = [...(props.step.options ?? [])];

    if (!options.length) {
      options.push({
        label: "Restart...",
        target: RESTART_STEP,
      });
    }

    return options;
  });

  return (
    <div
      id="guide"
      classList={{ container: true, hidden: props.hidden }}
      inert={props.hidden}
    >
      <h1>{props.step.title}</h1>

      <Show when={props.step.description}>
        <SolidMarkdown
          class="step-description"
          children={props.step.description}
        />
      </Show>

      <div class="button-list">
        <For each={options()}>
          {(option, i) => (
            <Button
              style={{ "--index": i() }}
              onClick={() => props.onAction?.(option.target)}
            >
              {option.label}
            </Button>
          )}
        </For>
      </div>
    </div>
  );
}
