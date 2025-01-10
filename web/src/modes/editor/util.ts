export function download(
  filename: string,
  content: string,
  type = "text/plain"
) {
  const blob = new Blob([content], { type });
  const href = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.setAttribute("download", filename);
  a.setAttribute("href", href);
  a.click();
  URL.revokeObjectURL(href);
}
