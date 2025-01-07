import { createSignal } from "solid-js";
import contentRaw from "../guide.yaml";
import { Content } from "../../common/data";
import { Guide } from "./Guide";
import { doClickActionState } from "../../common/action";

const content = contentRaw as Content;

interface AppState {
  stepHistory: string[];
}

export function App() {
  const [state, setState] = createSignal<AppState>({
    stepHistory: ["start"],
  });

  return (
    <Guide
      content={content}
      stepHistory={state().stepHistory}
      onAction={(step) => setState(doClickActionState(state(), { step }))}
    />
  );
}
