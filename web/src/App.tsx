import { Guide } from "./modes/guide/Guide";
import { CONTENT } from "$lib/content";
import { lazy, Match, Suspense, Switch } from "solid-js";

const Editor = lazy(() =>
  import("./modes/editor/Editor").then((m) => ({ default: m.Editor }))
);
const Graph = lazy(() =>
  import("./modes/graph/Graph").then((m) => ({ default: m.Graph }))
);

export function App() {
  const mode = window.location.search.slice(1);
  const initialStep = window.location.hash.slice(1);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Switch fallback={<Guide content={CONTENT} initialStep={initialStep} />}>
        <Match when={mode == "editor"}>
          <Editor />
        </Match>
        <Match when={mode == "graph"}>
          <Graph />
        </Match>
      </Switch>
    </Suspense>
  );
}
