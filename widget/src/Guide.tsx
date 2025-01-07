import type { Content } from "../../common/data";
import { StepPage } from "./StepPage";

interface GuideProps {
  stepHistory: string[];
  content: Content;
  onAction?: (target: string) => void;
}

export function Guide(props: GuideProps) {
  const historyLength = () => props.stepHistory.length;
  const currentStepName = () => props.stepHistory[historyLength() - 1];
  const step = () => props.content[currentStepName()];

  const showBack = () => !step().hide_back && historyLength() > 1;

  return (
    <StepPage showBack={showBack()} step={step()} onAction={props.onAction} />
  );
}
