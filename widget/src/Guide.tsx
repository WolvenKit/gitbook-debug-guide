import { createMemo, For, Show } from "solid-js";
import { SolidMarkdown } from "solid-markdown";
import { Button } from "./Button";
import type { Step } from "../../common/data";

interface StepPageProps {
  step: Step;
  showBack: boolean;
  onAction?: (target: string) => void;
}

export function Guide(props: StepPageProps) {
  const options = createMemo(() => {
    const options = [...(props.step.options ?? [])];

    if (options.length && props.showBack) {
      options.push({
        label: "Go back",
        target: "_back",
      });
    }

    if (!options.length) {
      options.push({
        label: "Restart...",
        target: "_restart",
      });
    }

    return options;
  });

  return (
    <div>
      <h1>{props.step.title}</h1>

      <Show when={props.step.description}>
        <SolidMarkdown children={props.step.description} />
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
