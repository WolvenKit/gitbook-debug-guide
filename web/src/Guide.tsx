import { Show } from "solid-js";
import { Button } from "./Button";
import type { Content } from "./lib/content";
import { StepPage } from "./StepPage";

interface GuideProps {
  stepHistory: string[];
  content: Content;
  onAction: (target: string) => void;
}

export function Guide(props: GuideProps) {
  const historyLength = () => props.stepHistory.length;
  const currentStepName = () => props.stepHistory[historyLength() - 1];
  const step = () => props.content[currentStepName()];

  const showBack = () => !step()?.hide_back && historyLength() > 1;

  return (
    <Show
      when={step()}
      fallback={
        <div>
          <h3 style={{ color: "red" }}>
            Error: The app is in an unexpected state.
          </h3>
          <Button onClick={() => props.onAction("_restart")}>Restart</Button>
        </div>
      }
    >
      <StepPage showBack={showBack()} step={step()} onAction={props.onAction} />
    </Show>
  );
}
