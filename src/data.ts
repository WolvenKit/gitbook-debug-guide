import YAML from "yaml";

export interface Step {
  title: string;
  description?: string;
  options?: { label: string; target: string }[];
}

export type Content = Record<string, Step>;

export const defaultContent = `# This YAML defines how Debug Guide behaves.
# Define steps and options where the user can go next.
# start is a required step, guide won't work without it:
start:
  title: What platform do you have the game from?
  description: |- # You can use markdown here
    This is an ***important*** information if you need help.
  options:
    - label: Steam
      target: success # target is the next step
    - label: Epic
      target: success
    - label: GoG
      target: success
    - label: Not allowed to say
      target: pirate
    - label: Other
      target: pirate

# These are final steps and have no options to go next
success:
  title: Game is good, yay!

pirate:
  title: "?rule3"
`;

export function loadContent(content: string): Content | string {
  let data: Content;

  try {
    data = YAML.parse(content);
  } catch (e) {
    // Return yaml error as string
    if (e instanceof YAML.YAMLError) {
      return e.message;
    }
    // re-throw anything else
    throw e;
  }

  try {
    validateData(data);
  } catch (e) {
    if (typeof e === "string") return e;
    throw e;
  }

  return data;
}

function validateData(data: Content) {
  if (typeof data !== "object" || Array.isArray(data)) {
    throw "Content must be object!";
  }

  if (!ensure(data, "start")) throw 'Missing "start" step!';

  // validate steps
  for (const [name, step] of Object.entries(data)) {
    if (!("title" in step) || !step.title) {
      throw `Step '${name}' is missing a title!`;
    }

    // validate each option if any
    if ("options" in step && step.options) {
      for (let i = 0; i < step.options.length; i++) {
        const option = step.options[i];

        if (!ensure(option, "label")) {
          throw `Option ${i} of step '${name}' is missing a label!`;
        }
        if (!ensure(option, "target")) {
          throw `Option ${i} ('${option.label}') of step '${name}' is missing a target!`;
        }
        if (!ensure(data, option.target)) {
          throw `Option ${i} ('${option.label}') of step '${name}' is targeting step '${option.target}', which does not exist!`;
        }
      }
    }
  }
}

function ensure(container: Record<string, unknown>, what: string) {
  return what in container && !!container[what];
}
