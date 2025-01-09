import contentRaw from "$content/guide.yaml";
import YAML from "yaml";

export const CONTENT = contentRaw as Content;

export interface Step {
  title: string;
  description?: string;
  hide_back?: boolean;
  options?: { label: string; target: string }[];
}

export type Content = Record<string, Step>;

// TODO: An editor/validator that would use this?
/** Validates content and returns an error or undefined. */
export function getContentError(content: string): string | undefined {
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
