import { Step } from "$lib/content";
import { ensureSyntaxTree, syntaxTree } from "@codemirror/language";
import { linter, Diagnostic } from "@codemirror/lint";

type SyntaxNodeRef = Parameters<
  Parameters<ReturnType<typeof syntaxTree>["iterate"]>[0]["enter"]
>[0];

interface LinterStep extends Partial<Record<keyof Step, true>> {
  keyNode: SyntaxNodeRef;
  optionTargets: Map<string, SyntaxNodeRef[]>;
}

const ALLOWED_ATTRIBUTES: Set<keyof Step> = new Set([
  "description",
  "hide_back",
  "options",
  "title",
]);

export const customLinter = linter(
  (view) => {
    const diagnostics: Diagnostic[] = [];

    const steps = new Map<string, LinterStep>();
    let currentStep: LinterStep | undefined = undefined;
    let inOptions = false;
    let inOptionTarget = false;
    let depth = 0;
    let lastKey: SyntaxNodeRef | undefined = undefined;

    const getString = (node: SyntaxNodeRef) =>
      view.state.sliceDoc(node.from, node.to);

    const startStep = (key: string, node: SyntaxNodeRef) => {
      currentStep = { keyNode: node.node, optionTargets: new Map() };
      steps.set(key, currentStep);
    };

    function enter(node: SyntaxNodeRef) {
      // Syntax error
      if (node.type.isError) {
        diagnostics.push({
          from: node.from,
          to: node.to,
          severity: "error",
          message: `${node.name} Syntax error somewhere around here`,
        });
      }

      // Content parse
      switch (node.name) {
        case "BlockMapping":
          depth++;
          break;

        case "Key": {
          const key = getString(node);

          switch (depth) {
            // Step ids
            case 1:
              startStep(key, node);
              break;

            // Step attributes
            case 2:
              if (!currentStep) throw new Error("No step at depth 2");
              if (!ALLOWED_ATTRIBUTES.has(key as any)) {
                diagnostics.push({
                  from: node.from,
                  to: node.to,
                  severity: "warning",
                  message: `Unknown step attribute '${key}'.`,
                });
              }

              currentStep[key as keyof Step] = true;
              if (key == "options") inOptions = true;
              break;

            case 3:
              if (!currentStep) throw new Error("No step at depth 3");
              if (inOptions && key == "target") {
                inOptionTarget = true;
              }
              break;

            case 4:
              // NOTE: Self-correction
              if (lastKey) startStep(getString(lastKey), lastKey);
              depth = 2;
          }
          lastKey = node.node;
          break;
        }

        case "Literal":
          if (inOptionTarget) {
            if (!currentStep) throw new Error("No step when in option target");
            const value = getString(node).trim();
            if (value && value != "target") {
              const nodes = currentStep.optionTargets.get(value) || [];
              nodes.push(node.node);
              currentStep.optionTargets.set(value, nodes);
            }
          }
          break;

        case "BlockLiteral": {
          if (getString(node).includes(" - label: ")) {
            diagnostics.push({
              from: node.from,
              to: node.to,
              severity: "warning",
              message: `The description seems to include options. Check your indentation!`,
            });
          }
          break;
        }
      }
      return true;
    }

    function leave(node: SyntaxNodeRef) {
      switch (node.name) {
        case "BlockMapping":
          depth--;
          break;

        case "BlockSequence":
          inOptions = false;
          break;

        case "Pair": {
          if (inOptionTarget) inOptionTarget = false;
        }
      }
    }

    const upto = view.state.doc.length;

    const tree = ensureSyntaxTree(view.state, upto, 5000);
    if (!tree) return [];

    tree.cursor().iterate(enter, leave);

    // Analyze steps
    for (const [key, step] of steps) {
      if (!step.title) {
        diagnostics.push({
          from: step.keyNode.from,
          to: step.keyNode.to,
          severity: "error",
          message: `Step '${key}' does not have a 'title'!`,
        });
      }

      for (const [target, optionNodes] of step.optionTargets) {
        if (!steps.has(target)) {
          for (const optionNode of optionNodes) {
            diagnostics.push({
              from: optionNode.from,
              to: optionNode.to,
              severity: "error",
              message: `Step '${target}' does not exist!`,
            });
          }
        }
      }
    }

    // diagnostics.push({
    //   from: node.from,
    //   to: node.to,
    //   severity: "warning",
    //   message: "Regular expressions are FORBIDDEN",
    //   actions: [
    //     {
    //       name: "Remove",
    //       apply(view, from, to) {
    //         view.dispatch({ changes: { from, to } });
    //       },
    //     },
    //   ],
    // });

    return diagnostics;
  },
  { autoPanel: true }
);
