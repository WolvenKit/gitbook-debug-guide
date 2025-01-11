import { EditorView, basicSetup } from "codemirror";
import { createEffect, onCleanup } from "solid-js";
import { yaml } from "@codemirror/lang-yaml";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap, ViewPlugin } from "@codemirror/view";
import { customLinter } from "./linter";
import { lintGutter } from "@codemirror/lint";

export interface CodeMirrorProps {
  initialContent?: string;
  showStep?: string;
  onChange?: (content: string) => void;
  onParsed?: (content: unknown) => void;
}

export function CodeMirror(props: CodeMirrorProps) {
  let view = new EditorView({
    doc: props.initialContent,
    extensions: [
      basicSetup,
      oneDark,
      yaml(),
      customLinter((c) => props.onParsed?.(c[0])),
      lintGutter(),
      keymap.of([indentWithTab]),
      ViewPlugin.define((view) => ({
        update(update) {
          if (update.docChanged) {
            props.onChange?.(view.state.doc.toString());
          }
        },
      })),
    ],
  });

  function findStep(step: string) {
    let i = 1;
    for (const line of view.state.doc.iterLines()) {
      if (line.startsWith(step)) return i;
      i++;
    }
  }

  async function scrollToStep(step: string) {
    if (!step) return;
    const lineNumber = await findStep(step);
    if (lineNumber == undefined) return;
    const line = view.state.doc.line(lineNumber);
    if (!line) return;
    const block = view.lineBlockAt(line.from);
    view.scrollDOM.scrollTo({ ...block, behavior: "smooth" });
  }

  createEffect(async () => {
    if (props.showStep) await scrollToStep(props.showStep);
  });

  onCleanup(() => view.destroy());

  return <>{view.dom}</>;
}
