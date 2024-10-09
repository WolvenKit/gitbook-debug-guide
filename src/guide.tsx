import { Step } from "./data";

export function createGuide(step: Step) {
  return (
    <box grow={100}>
      <vstack align="center">
        <markdown content={"## " + step.title} />

        {step.description ? <markdown content={step.description} /> : null}

        <vstack>
          {step.options?.map((button) => (
            <button
              label={button.label}
              onPress={{
                action: "click",
                step: button.target,
              }}
            />
          )) ?? []}
        </vstack>
      </vstack>
    </box>
  );
}
