import { createSignal } from "solid-js";
import { StepPage, StepPageProps } from "./StepPage";
import { ClickAction } from "../../common/action";

export function App() {
  const [state, setState] = createSignal<StepPageProps>();

  window.addEventListener("message", (event) => {
    if (event.data?.state?.data) {
      setState(JSON.parse(event.data.state.data));
    }
  });

  if (state()) {
    return (
      <StepPage
        {...state()!}
        onAction={(step) => doAction({ step })}
      ></StepPage>
    );
  }
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
