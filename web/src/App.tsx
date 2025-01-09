import { createSignal } from "solid-js";
import { Guide } from "./Guide";
import { doClickActionState } from "./lib/action";
import { CONTENT } from "./lib/content";

interface AppState {
  stepHistory: string[];
}

export function App() {
  const initialStep = window.location.hash.slice(1) || "start";

  const [state, setState] = createSignal<AppState>({
    stepHistory: [initialStep],
  });

  return (
    <Guide
      content={CONTENT}
      stepHistory={state().stepHistory}
      onAction={(step) => setState(doClickActionState(state(), { step }))}
    />
  );
}
