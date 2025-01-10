import { Content } from "$lib/content";

export function contentToMermaid(content: Content) {
  let mermaid = `graph TD\n`;

  for (const [stepName, step] of Object.entries(content)) {
    let title = `"${step.title.replace('"', "#quot;")}"`;
    if (stepName == "start" || !step.options?.length) {
      title = "([" + title + "])";
    } else if ((step.options?.length ?? 0) > 1) {
      title = "{{" + title + "}}";
    } else {
      title = "[" + title + "]";
    }

    if (step.options?.length) {
      let first = true;
      for (const option of step.options) {
        mermaid += `\t${stepName}`;

        if (first) {
          mermaid += `${title}`;
          first = false;
        }

        mermaid += ` --"${option.label}"--> ${option.target}\n`;
      }
    } else {
      mermaid += `\t${stepName}${title}\n`;
    }
  }

  return mermaid;
}
