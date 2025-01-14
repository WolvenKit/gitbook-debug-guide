import { createSignal, For, Show } from "solid-js";
import { Button } from "$components/Button";
import { SETTINGS, type Content } from "$lib/content";
import { StepPage } from "./StepPage";
import { BACK_STEP, moveHistory, RESTART_STEP, START_STEP } from "./guide";

import "./guide.css";

interface GuideProps {
  initialStep?: string;
  content: Content;
}

export function Guide(props: GuideProps) {
  const initialStep = props.initialStep || START_STEP;

  const [stepHistory, setStepHistory] = createSignal([initialStep]);

  const historyLength = () => stepHistory().length;
  const step = () => props.content[stepHistory()[historyLength() - 1]];

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
      <div id="top-bar">
        <div
          style={{ opacity: +showBack(), transition: "0.3s opacity" }}
          inert={!showBack()}
        >
          <Button onClick={() => goTo(BACK_STEP)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="icon"
              style="margin: 0 0.5rem 0 -0.5rem"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
            back
          </Button>
        </div>
      </div>

      <div id="guide-wrapper">
        <For each={stepHistory().slice(-2)} >
          {(stepName, i) => (
            <StepPage
              step={props.content[stepName]}
              onAction={goTo}
              hidden={!i() && historyLength() != 1}
            />
          )}
        </For>
      </div>

      <div id="bottom-bar">
        <div style={{ "margin-left": "auto" }}>
          <For each={SETTINGS.bottom_buttons}>
            {(option) => (
              <Button onClick={() => goTo(option.target)}>
                {option.label}
              </Button>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
}
