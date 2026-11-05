import { resolvePatchTarget, textAreaButtonsFilter, waitForTarget } from "./modules";
import { storage } from "../storage";
import { AnsiIcon } from "../ui/icons";
import { Tip } from "../ui/Tooltip";
import { t } from "../i18n";

const PLUGIN = "AnsiEditor";
const LOG = "[AnsiEditor]";
const ATTR = "data-ansi-editor";
const STRATEGY_A_TIMEOUT = 5000;

const { useLayoutEffect, useRef, useState } = BdApi.React;

interface Classes {
  wrap?: string;
  button?: string;
  inner?: string;
}

/** Copies class names from a neighbouring icon button so hover/active states match Discord. */
function neighbourClasses(me: HTMLElement): Classes {
  let parent = me.parentElement;
  // Strategy B mounts into a display:contents host; look at the host's siblings instead.
  if (parent?.hasAttribute(ATTR)) parent = parent.parentElement;
  if (!parent) return {};
  const sib = Array.from(parent.children).find(
    (c) => !c.hasAttribute(ATTR) && c.querySelector("button svg"),
  ) as HTMLElement | undefined;
  const btn = sib?.querySelector("button");
  return {
    wrap: sib?.className,
    button: btn?.className,
    inner: (btn?.firstElementChild as HTMLElement | null)?.className,
  };
}

export function AnsiButton({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [cls, setCls] = useState<Classes>({});
  useLayoutEffect(() => {
    if (ref.current) setCls(neighbourClasses(ref.current));
  }, []);
  return (
    <div ref={ref} {...{ [ATTR]: "" }} className={cls.wrap ?? "ansiEditor-tbWrap"}>
      <Tip text={t("button.tooltip")}>
        {(tipProps) => (
          <button
            {...tipProps}
            type="button"
            aria-label={t("button.tooltip")}
            className={`${cls.button ?? ""} ansiEditor-tbButton`}
            onClick={onClick}
          >
            <div className={cls.inner ?? "ansiEditor-tbInner"}>
              <AnsiIcon size={20} />
            </div>
          </button>
        )}
      </Tip>
    </div>
  );
}

function typeName(props: any): string | undefined {
  const type = props?.type;
  if (typeof type === "string") return type.toLowerCase();
  const name = type?.analyticsName ?? type?.name;
  return typeof name === "string" ? name.toLowerCase() : undefined;
}

const HIDDEN_TYPES = ["profile_bio_input", "create_forum_post", "forum_channel_guidelines"];

/** Server channels, DMs, group DMs, threads; not when the box is disabled. */
function shouldShow(props: any): boolean {
  if (props?.disabled) return false;
  const name = typeName(props);
  if (!name) return true;
  if (name === "edit") return storage.getSettings().editButton;
  return !HIDDEN_TYPES.includes(name);
}

export class TextAreaButton {
  private observer: MutationObserver | null = null;
  private roots = new Map<HTMLElement, BdReactRoot>();
  private timer: ReturnType<typeof setTimeout> | null = null;
  private stopped = false;
  private frame = 0;

  constructor(private readonly onClick: () => void) {}

  async start(): Promise<void> {
    this.stopped = false;
    const target =
      resolvePatchTarget(textAreaButtonsFilter) ??
      (await waitForTarget(textAreaButtonsFilter, STRATEGY_A_TIMEOUT));
    if (this.stopped) return;
    if (target) {
      this.patch(target.owner, target.key);
      // Sanity check: if the patch never renders our button while a message box is on screen, fall back.
      this.timer = setTimeout(() => {
        const boxes = document.querySelectorAll('[class*="channelTextArea"] [class*="buttons"]');
        if (boxes.length && !document.querySelector(`[${ATTR}]`))
          this.fallback("patch rendered nothing");
      }, STRATEGY_A_TIMEOUT);
    } else {
      this.fallback("module not found");
    }
  }

  stop(): void {
    this.stopped = true;
    BdApi.Patcher.unpatchAll(PLUGIN);
    if (this.timer) clearTimeout(this.timer);
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
    this.observer = null;
    for (const [el, root] of this.roots) {
      root.unmount();
      el.remove();
    }
    this.roots.clear();
  }

  /** Strategy A: patch the buttons row component and add our element to its children. */
  private patch(owner: any, key: string): void {
    BdApi.Patcher.after(PLUGIN, owner, key, (_this, [props], ret) => {
      try {
        if (!shouldShow(props)) return;
        const children = ret?.props?.children;
        if (!Array.isArray(children) || children.some((c: any) => c?.key === "ansi-editor")) return;
        const el = <AnsiButton key="ansi-editor" onClick={this.onClick} />;
        if (storage.getSettings().buttonPosition === "end") children.push(el);
        else children.unshift(el);
      } catch (e) {
        console.error(LOG, "button patch failed", e);
      }
    });
  }

  /** Strategy B: watch the DOM and mount the button into every buttons row. */
  private fallback(reason: string): void {
    if (this.observer || this.stopped) return;
    console.warn(LOG, `falling back to DOM strategy: ${reason}`);
    BdApi.UI.showToast(t("toast.fallback"), { type: "warning" });
    const scan = () => {
      this.frame = 0;
      this.mountAll();
    };
    this.observer = new MutationObserver(() => {
      if (!this.frame) this.frame = requestAnimationFrame(scan);
    });
    this.observer.observe(document.getElementById("app-mount") ?? document.body, {
      childList: true,
      subtree: true,
    });
    scan();
  }

  private mountAll(): void {
    for (const [el, root] of this.roots) {
      if (!el.isConnected) {
        root.unmount();
        this.roots.delete(el);
      }
    }
    const rows = document.querySelectorAll<HTMLElement>(
      '[class*="channelTextArea"] [class*="buttons"]',
    );
    const settings = storage.getSettings();
    rows.forEach((row) => {
      if (row.querySelector(`:scope > [${ATTR}]`)) return;
      const box = row.closest('[class*="channelTextArea"]');
      const textbox = box?.querySelector('[role="textbox"]');
      if (textbox?.getAttribute("contenteditable") === "false") return;
      const isEdit = !!row.closest('li[id^="chat-messages"], [class*="messageListItem"]');
      if (isEdit && !settings.editButton) return;
      const host = document.createElement("div");
      host.setAttribute(ATTR, "");
      host.style.display = "contents";
      if (settings.buttonPosition === "end") row.appendChild(host);
      else row.insertBefore(host, row.firstChild);
      const root = BdApi.ReactDOM.createRoot(host);
      root.render(<AnsiButton onClick={this.onClick} />);
      this.roots.set(host, root);
    });
  }
}
