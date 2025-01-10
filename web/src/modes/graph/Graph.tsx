import { CONTENT } from "$lib/content";
import { contentToMermaid } from "./mermaid";
import { Mermaid } from "./Mermaid";

export function Graph() {
  return (
    <div class="full-window">
      <Mermaid content={contentToMermaid(CONTENT)} />
    </div>
  );
}
