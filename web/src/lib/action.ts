export function doClickActionState<State extends ClickState>(
  state: State,
  action: ClickAction
) {
  if (action.step == "_back") {
    return {
      ...state,
      stepHistory: state.stepHistory.slice(0, -1),
    };
  }

  if (action.step == "_restart") {
    return {
      ...state,
      stepHistory: ["start"],
    };
  }

  return {
    ...state,
    stepHistory: [...state.stepHistory, action.step],
  };
}

export interface ClickState {
  stepHistory: string[];
}

export interface ClickAction {
  step: string;
}
