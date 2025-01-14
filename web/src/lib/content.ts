import contentRaw from "$content/guide.yaml";
import settingsRaw from "$content/settings.yaml";

export const CONTENT = contentRaw as Content;
export const SETTINGS = settingsRaw as Settings;

export interface Step {
  title: string;
  description?: string;
  hide_back?: boolean;
  options?: { label: string; target: string }[];
}

export type Content = Record<string, Step>;

export interface Settings {
  bottom_buttons: { label: string; target: string }[];
}
