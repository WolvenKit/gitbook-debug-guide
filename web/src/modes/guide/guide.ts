export const START_STEP = "start";
export const BACK_STEP = "_back";
export const RESTART_STEP = "_restart";

export function moveHistory(history: string[], target: string) {
  if (target == BACK_STEP) {
    return history.slice(0, -1);
  }

  if (target == RESTART_STEP) {
    return [START_STEP];
  }

  return [...history, target];
}
