import { Step } from "./data";

export function createGuide(step: Step) {
  const options = step.options ?? [
    {
      label: "Restart...",
      target: "start",
    },
  ];

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
