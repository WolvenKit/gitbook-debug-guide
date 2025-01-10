import contentRaw from "$content/guide.yaml?raw";
import { CodeMirror } from "./CodeMirror";

import "./editor.css";

export function Editor() {
  return (
    <div id="editor">
      <CodeMirror content={contentRaw} />
      <div>E</div>
    </div>
  );
}
