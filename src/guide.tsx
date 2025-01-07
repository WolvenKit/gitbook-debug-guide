import { Step } from "./data";

export function createGuide(step: Step, showBack: boolean) {
  const options = step.options;
  if (options && showBack) {
    options.push({
      label: "Go back",
      target: "_back",
    });
  }

  if (!options) {
    options.push({
      label: "Restart...",
      target: "start",
    });
  }

  return (
    <vstack align="center">
      <markdown content={"## " + step.title} />

      {step.description ? <markdown content={step.description} /> : null}

      <vstack>
        {options.map((button) => (
          <button
            label={button.label}
            onPress={{
              action: "click",
              step: button.target,
            }}
          />
        ))}
      </vstack>
    </vstack>
  );
}
