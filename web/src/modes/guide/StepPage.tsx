import { createMemo, For, Show } from "solid-js";
import { SolidMarkdown } from "solid-markdown";
import { Button } from "$components/Button";
import type { Step } from "$lib/content";
import { BACK_STEP, RESTART_STEP } from "./guide";

export interface StepPageProps {
  step: Step;
  showBack: boolean;
  onAction?: (target: string) => void;
}

export function StepPage(props: StepPageProps) {
  const options = createMemo(() => {
    const options = [...(props.step.options ?? [])];

    if (options.length && props.showBack) {
      options.push({
        label: "Go back",
        target: BACK_STEP,
      });
    }

    if (!options.length) {
      options.push({
        label: "Restart...",
        target: RESTART_STEP,
      });
    }

    return options;
  });

  return (
    <div id="guide" class="container">
      <h1>{props.step.title}</h1>

      <Show when={props.step.description}>
        <SolidMarkdown
          class="step-description"
          children={props.step.description}
        />
      </Show>

      <div class="button-list">
        <For each={options()}>
          {(option) => (
            <Button onClick={() => props.onAction?.(option.target)}>
              {option.label}
            </Button>
          )}
        </For>
      </div>
    </div>
  );
}
