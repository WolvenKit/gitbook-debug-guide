import contentRaw from "$content/guide.yaml?raw";
import { CodeMirror } from "./CodeMirror";
import {
  createSignal,
  ErrorBoundary,
  lazy,
  Suspense,
  createMemo,
} from "solid-js";
import { contentToMermaid } from "../graph/mermaid";
import { Button } from "$components/Button";
import { download } from "./util";
import { createScheduled, debounce } from "@solid-primitives/scheduled";
import { Content, CONTENT } from "$lib/content";

import "./editor.css";

const Mermaid = lazy(() =>
  import("../graph/Mermaid").then((m) => ({ default: m.Mermaid }))
);

export function Editor() {
  const [showStep, setShowStep] = createSignal<string>();
  const [content, setContent] = createSignal(CONTENT);

  let rawContent = contentRaw;

  // Update mermaid with a debounce
  const scheduled = createScheduled((fn) => debounce(fn, 1000));
  const deferredContent = createMemo<Content>((p) => {
    const value = content();
    return scheduled() ? value : p;
  }, content());

  const mermaid = createMemo<string>((last) => {
    try {
      return contentToMermaid(deferredContent());
    } catch (e) {
      if (import.meta.env.DEV) console.error(e);
      return last;
    }
  }, "");

  return (
    <div id="editor" class="full-window">
      <CodeMirror
        initialContent={contentRaw}
        onChange={(c) => (rawContent = c)}
        onParsed={setContent}
        showStep={showStep()}
      />

      <div class="full-window">
        <div class="toolbar">
          <Button onClick={() => download("guide.yaml", rawContent)}>
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
