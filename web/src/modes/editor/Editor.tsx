import contentRaw from "$content/guide.yaml?raw";
import { CodeMirror } from "./CodeMirror";
import {
  createSignal,
  ErrorBoundary,
  lazy,
  Suspense,
  createMemo,
} from "solid-js";
import YAML from "yaml";
import { contentToMermaid } from "../graph/mermaid";
import { Button } from "$components/Button";

import "./editor.css";
import { download } from "./util";

const Mermaid = lazy(() =>
  import("../graph/Mermaid").then((m) => ({ default: m.Mermaid }))
);

export function Editor() {
  const [showStep, setShowStep] = createSignal<string>();
  const [content, setContent] = createSignal(contentRaw);
  const mermaid = createMemo(() => contentToMermaid(YAML.parse(content())));

  return (
    <div id="editor" class="full-window">
      <div>
        <CodeMirror
          initialContent={content()}
          onChange={setContent}
          showStep={showStep()}
        />
      </div>

      <div class="full-window">
        <div class="toolbar">
          <Button onClick={() => download("guide.yaml", content())}>
            Download YAML
          </Button>
          <Button
            onClick={() =>
              download("guide.md", "```mermaid\n" + mermaid() + "\n```")
            }
          >
            Download Mermaid
          </Button>
        </div>

        <Suspense fallback={<p>Loading...</p>}>
          <ErrorBoundary
            fallback={(err) => (
              <div>
                Error rendering graph
                <br />
                <pre>{err.toString()}</pre>
              </div>
            )}
          >
            <Mermaid content={mermaid()} onClick={setShowStep} />
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  );
}
