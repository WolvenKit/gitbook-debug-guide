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
  optimizeDeps: {
    include: ["micromark", "unified"],
  },
  base: "",
});
