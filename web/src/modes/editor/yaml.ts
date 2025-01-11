import YAML from "yaml";

export interface YAMLMessage {
  name: "YAMLParseError" | "YAMLWarning";
  message: string;
  pos: [number, number];
}

type YAMLGenerator = Generator<
  YAML.Document.Parsed<YAML.ParsedNode, true>,
  void,
  unknown
>;

export function parseYaml(src: string, abort?: AbortSignal) {
  const messages: YAMLMessage[] = [];
  const docs: YAML.Document.Parsed[] = [];

  const tokens = new YAML.Parser().parse(src);
  const composer = new YAML.Composer();

  const iterateDoc = (gen: YAMLGenerator) => {
    for (const doc of gen) {
      if (abort?.aborted) return;

      messages.push(...doc.errors, ...doc.warnings);
      docs.push(doc);
    }
  };

  for (const token of tokens) {
    if (abort?.aborted) return;
    iterateDoc(composer.next(token));
  }

  iterateDoc(composer.end());

  return { messages, docs };
}
