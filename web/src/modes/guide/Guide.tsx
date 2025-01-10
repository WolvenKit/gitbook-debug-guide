import { createSignal, Show } from "solid-js";
import { Button } from "$components/Button";
import type { Content } from "$lib/content";
import { StepPage } from "./StepPage";
import { moveHistory, RESTART_STEP, START_STEP } from "./guide";

import "./guide.css";

interface GuideProps {
  initialStep?: string;
  content: Content;
}

export function Guide(props: GuideProps) {
  const initialStep = props.initialStep || START_STEP;

  const [stepHistory, setStepHistory] = createSignal([initialStep]);

  const historyLength = () => stepHistory().length;
  const currentStepName = () => stepHistory()[historyLength() - 1];
  const step = () => props.content[currentStepName()];

  const showBack = () => !step()?.hide_back && historyLength() > 1;

  function goTo(step: string) {
    setStepHistory(moveHistory(stepHistory(), step));
  }

  return (
    <Show
      when={step()}
      fallback={
        <div>
          <h3 style={{ color: "red" }}>
            Error: The app is in an unexpected state.
          </h3>
          <Button onClick={() => goTo(RESTART_STEP)}>Restart</Button>
        </div>
      }
    >
      <StepPage showBack={showBack()} step={step()} onAction={goTo} />
    </Show>
  );
}
