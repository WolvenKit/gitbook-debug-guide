import Path from "node:path";
import { uneval } from "devalue";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import YAML from "yaml";

const YAML_REGEX = /\.ya?ml$/;

export default defineConfig({
  plugins: [
    solid(),
    {
      name: "yaml",
      enforce: "pre",
      transform(src, id) {
        if (!YAML_REGEX.exec(id)) return;

        return { code: "export default " + uneval(YAML.parse(src)) + ";" };
      },
    },
  ],
  resolve: {
    alias: {
      $content: Path.resolve("../content"),
    },
  },
  server: {
    fs: {
      allow: [".", "../content"],
    },
  },
  optimizeDeps: {
    include: [
      // Because of solid-markdown
      "micromark",
      "unified",
    ],
  },
  // To make all import paths relative in build
  base: "",
});
