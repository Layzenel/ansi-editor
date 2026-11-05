import { EditorModal, type EditorOptions } from "./EditorModal";

let current: { host: HTMLElement; root: BdReactRoot } | null = null;

const THEME_SELECTOR = ".theme-dark, .theme-light, .theme-darker, .theme-midnight";

/** Copies Discord's theme classes so CSS variables resolve inside our overlay. */
function themeClasses(): string[] {
  const html = document.documentElement;
  const el = html.matches(THEME_SELECTOR) ? html : document.querySelector(THEME_SELECTOR);
  return el ? Array.from(el.classList).filter((c) => c.startsWith("theme-")) : [];
}

export function closeEditor(): void {
  if (!current) return;
  current.root.unmount();
  current.host.remove();
  current = null;
}

/** Opens the editor overlay (one instance; reopening replaces it). */
export function openEditor(options: EditorOptions = {}): void {
  closeEditor();
  const host = document.createElement("div");
  host.className = ["ansiEditor-host", ...themeClasses()].join(" ");
  document.body.appendChild(host);
  const root = BdApi.ReactDOM.createRoot(host);
  current = { host, root };
  root.render(<EditorModal options={options} onClose={closeEditor} />);
}

export const isEditorOpen = () => current !== null;
