import { createSignal } from "solid-js";
import { Guide } from "./Guide";
import { defaultContent, loadContent, type Content } from "../../common/data";
import { ClickAction, doClickActionState } from "../../common/action";

interface State {
  content: Content;
  stepHistory: string[];
}

export function App() {
  const [state, setState] = createSignal<State>({
    content: loadContent(defaultContent) as unknown as Content,
    stepHistory: ["start"],
  });

  window.addEventListener("message", (event) => {
    if (event.data?.state) {
      setState(event.data.state);
    }
  });

  const historyLength = () => state().stepHistory.length;
  const currentStepName = () => state().stepHistory[historyLength() - 1];
  const step = () => state().content?.[currentStepName()];

  const showBack = () => !step().hide_back && historyLength() > 1;

  return (
    <Guide
      showBack={showBack()}
      step={step()}
      onAction={(target) =>
        import.meta.env.DEV
          ? setState(doClickActionState(state(), { step: target }))
          : doAction({
              step: target,
            })
      }
    />
  );
}

function doAction(action: ClickAction) {
  window.parent.postMessage(
    {
      action: {
        type: "click",
        ...action,
      },
    },
    "*"
  );
}
