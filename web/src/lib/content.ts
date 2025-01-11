import contentRaw from "$content/guide.yaml";

export const CONTENT = contentRaw as Content;

export interface Step {
  title: string;
  description?: string;
  hide_back?: boolean;
  options?: { label: string; target: string }[];
}

export type Content = Record<string, Step>;
