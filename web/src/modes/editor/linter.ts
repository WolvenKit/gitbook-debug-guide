import { Step } from "$lib/content";
import { ensureSyntaxTree, syntaxTree } from "@codemirror/language";
import { linter, Diagnostic } from "@codemirror/lint";
import { parseYaml } from "./yaml";

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

export function customLinter(onParsed?: (content: unknown[]) => void) {
  let parserAbort = new AbortController();

  return linter(
    (view) => {
      const diagnostics: Diagnostic[] = [];

      parserAbort.abort();
      parserAbort = new AbortController();

      const parserResult = parseYaml(
        view.state.doc.toString(),
        parserAbort.signal
      );
      if (!parserResult) return [];
      const { messages, docs } = parserResult;

      let error = false;

      for (const message of messages) {
        let severity: "error" | "warning" = "warning";
        if (message.name === "YAMLParseError") {
          error = true;
          severity = "error";
        }

        diagnostics.push({
          severity: severity,
          message: message.message,
          from: message.pos[0],
          to: message.pos[1],
        });
      }

      // Don't continue with parser errors
      if (error) return diagnostics;
      onParsed?.(docs.map((v) => v.toJS()));

      // TODO: Use the YAML parser instead result of syntax tree

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
      const checkAttribute = (key: string, node: SyntaxNodeRef) => {
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
                checkAttribute(key, node);
                break;

              case 3:
                if (!currentStep) throw new Error("No step at depth 3");
                if (inOptions && key == "target") {
                  inOptionTarget = true;
                }
                break;

              case 4:
                // NOTE: Self-correction, something bad happens when editing content
                depth = 1;
                if (lastKey) startStep(getString(lastKey), lastKey);
                depth = 2;
                checkAttribute(key, node);
            }
            lastKey = node.node;
            break;
          }

          case "Literal":
            if (inOptionTarget) {
              if (!currentStep)
                throw new Error("No step when in option target");
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
    { autoPanel: true, delay: 1000 }
  );
}
