import { Step } from "../common/data";

export function createGuide(step: Step, showBack: boolean) {
  return (
    <webframe
      source={{
        url: "https://wolvenkit.github.io/gitbook-debug-guide/",
      }}
      data={{
        data: JSON.stringify({ step, showBack }),
      }}
      aspectRatio={16 / 9}
    />
  );

  // const options = step.options;
  // if (options && showBack) {
  //   options.push({
  //     label: "Go back",
  //     target: "_back",
  //   });
  // }

  // if (!options) {
  //   options.push({
  //     label: "Restart...",
  //     target: "_restart",
  //   });
  // }

  // return (
  //   <vstack align="center">
  //     <markdown content={"## " + step.title} />

  //     {step.description ? <markdown content={step.description} /> : null}

  //     <vstack>
  //       {options.map((button) => (
  //         <button
  //           label={button.label}
  //           onPress={{
  //             action: "click",
  //             step: button.target,
  //           }}
  //         />
  //       ))}
  //     </vstack>
  //   </vstack>
  // );
}
