import { EditorView, basicSetup } from "codemirror";
import { onCleanup } from "solid-js";
import { yaml } from "@codemirror/lang-yaml";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { customLinter } from "./linter";
import { lintGutter } from "@codemirror/lint";

export interface CodeMirrorProps {
  content?: string;
}

export function CodeMirror(props: CodeMirrorProps) {
  let view = new EditorView({
    doc: props.content,
    extensions: [
      basicSetup,
      oneDark,
      yaml(),
      customLinter,
      lintGutter(),
      keymap.of([indentWithTab]),
    ],
  });

  onCleanup(() => view.destroy());

  return <>{view.dom}</>;
}
