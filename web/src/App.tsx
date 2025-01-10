import { Guide } from "./modes/guide/Guide";
import { CONTENT } from "$lib/content";
import { lazy, Match, Suspense, Switch } from "solid-js";

const Editor = lazy(() =>
  import("./modes/editor/Editor").then((m) => ({ default: m.Editor }))
);

export function App() {
  const editorMode = window.location.search.slice(1) == "editor";
  const initialStep = window.location.hash.slice(1);

  return (
    <Switch fallback={<Guide content={CONTENT} initialStep={initialStep} />}>
      <Match when={editorMode}>
        <Suspense fallback={<p>Loading...</p>}>
          <Editor />
        </Suspense>
      </Match>
    </Switch>
  );
}
