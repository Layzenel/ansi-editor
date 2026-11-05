import type { LengthInfo } from "../core/limits";
import type { PrimaryAction } from "../storage";
import { ChevronIcon, InfoIcon } from "./icons";
import { Tip } from "./Tooltip";
import { t } from "../i18n";

const { useState } = BdApi.React;

export type CopyKind = "wrapped" | "raw" | "plain";

export interface FooterProps {
  info: LengthInfo;
  primary: PrimaryAction | "save";
  replying: boolean;
  hasBackticks: boolean;
  onInsert(): void;
  onSend(): void;
  onSave(): void;
  onCopy(kind: CopyKind): void;
  onOptimize(): void;
}

function CopyMenu({ onCopy, primary }: { onCopy(k: CopyKind): void; primary: boolean }) {
  const [open, setOpen] = useState(false);
  const cls = primary ? "ansiEditor-btnPrimary" : "ansiEditor-btnSecondary";
  return (
    <div className="ansiEditor-split">
      <button type="button" className={`ansiEditor-btn ${cls}`} onClick={() => onCopy("wrapped")}>
        {t("footer.copy")}
      </button>
      <button
        type="button"
        className={`ansiEditor-btn ${cls} ansiEditor-splitToggle`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("footer.copy")}
        onClick={() => setOpen(!open)}
      >
        <ChevronIcon />
      </button>
      {open && (
        <div className="ansiEditor-menu" role="menu" onMouseLeave={() => setOpen(false)}>
          {(["wrapped", "raw", "plain"] as CopyKind[]).map((k) => (
            <button
              key={k}
              type="button"
              role="menuitem"
              className="ansiEditor-menuItem"
              onClick={() => {
                setOpen(false);
                onCopy(k);
              }}
            >
              {t(
                k === "wrapped"
                  ? "footer.copyWrapped"
                  : k === "raw"
                    ? "footer.copyRaw"
                    : "footer.copyPlain",
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Footer(p: FooterProps) {
  const over = p.info.level === "error";
  const hints: string[] = [t("footer.mobileHint")];
  if (p.replying) hints.unshift(t("footer.replyHint"));
  if (p.hasBackticks) hints.unshift(t("footer.backticksHint"));
  const btn = (action: PrimaryAction | "save") =>
    `ansiEditor-btn ${p.primary === action ? "ansiEditor-btnPrimary" : "ansiEditor-btnSecondary"}`;

  return (
    <div className="ansiEditor-footer">
      <div className="ansiEditor-footerLeft">
        <Tip
          text={t("footer.counterTip", {
            text: p.info.textChars,
            esc: p.info.escapeChars,
            wrap: p.info.wrapChars,
          })}
        >
          {(tip) => (
            <span
              {...tip}
              tabIndex={0}
              className={`ansiEditor-counter ansiEditor-counter-${p.info.level}`}
              aria-live="polite"
            >
              {p.info.total} / {p.info.limit}
            </span>
          )}
        </Tip>
        <button type="button" className="ansiEditor-btn ansiEditor-btnLink" onClick={p.onOptimize}>
          {t("footer.optimize")}
        </button>
        <Tip text={hints.join("\n")}>
          {(tip) => (
            <span {...tip} tabIndex={0} className="ansiEditor-hint" aria-label={hints.join(". ")}>
              <InfoIcon />
            </span>
          )}
        </Tip>
        {over && (
          <span className="ansiEditor-error" role="alert">
            {t("footer.overLimit", { limit: p.info.limit })}
          </span>
        )}
      </div>
      <div className="ansiEditor-footerRight">
        <CopyMenu onCopy={p.onCopy} primary={p.primary === "copy"} />
        {p.primary === "save" ? (
          <button type="button" className={btn("save")} disabled={over} onClick={p.onSave}>
            {t("footer.save")}
          </button>
        ) : (
          <>
            <button type="button" className={btn("insert")} onClick={p.onInsert}>
              {t("footer.insert")}
            </button>
            <button
              type="button"
              className={btn("send")}
              disabled={over || p.replying}
              title={p.replying ? t("footer.replyHint") : undefined}
              onClick={p.onSend}
            >
              {t("footer.send")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
