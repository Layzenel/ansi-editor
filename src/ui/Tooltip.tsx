const { useEffect, useRef, useState } = BdApi.React;

const SHOW_DELAY_MS = 150;
const GAP = 8;

interface TipProps {
  text: string;
  /**
   * Use BetterDiscord's native Tooltip. Only for elements outside our overlay:
   * Discord renders it in its own layer, which sits below the editor overlay.
   */
  native?: boolean;
  children: (props: Record<string, unknown>) => ReactNode;
}

interface Pos {
  left: number;
  top: number;
  below: boolean;
}

/** Discord-styled tooltip rendered inside the overlay host, so it is always above the modal. */
export function Tip({ text, native, children }: TipProps) {
  const Native = BdApi.Components?.Tooltip;
  if (native && Native) return <Native text={text}>{(p) => children(p)}</Native>;
  return <OwnTip text={text}>{children}</OwnTip>;
}

function OwnTip({ text, children }: Omit<TipProps, "native">) {
  const [pos, setPos] = useState<Pos | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const place = (el: Element) => {
    const r = el.getBoundingClientRect();
    const below = r.top < 60;
    setPos({ left: r.left + r.width / 2, top: below ? r.bottom + GAP : r.top - GAP, below });
  };
  const show = (e: { currentTarget: Element }, delay = SHOW_DELAY_MS) => {
    const el = e.currentTarget;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => place(el), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setPos(null);
  };

  const host = document.querySelector(".ansiEditor-host") ?? document.body;
  return (
    <>
      {children({
        "aria-description": text,
        onMouseEnter: show,
        onMouseLeave: hide,
        onFocus: (e: { currentTarget: Element }) => show(e, 0),
        onBlur: hide,
        onClickCapture: (e: { currentTarget: Element }) => !pos && show(e, 0),
      })}
      {pos &&
        BdApi.ReactDOM.createPortal(
          <div
            role="tooltip"
            className={`ansiEditor-tooltip ${pos.below ? "ansiEditor-tooltipBelow" : ""}`}
            style={{ left: pos.left, top: pos.top }}
          >
            {text}
          </div>,
          host,
        )}
    </>
  );
}
