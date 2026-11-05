import { t } from "../i18n";

const { useEffect, useRef } = BdApi.React;

/** In-modal confirmation (Discord's own modal layer would open underneath our overlay). */
export function ConfirmDialog({
  text,
  onYes,
  onNo,
}: {
  text: string;
  onYes(): void;
  onNo(): void;
}) {
  const yes = useRef<HTMLButtonElement>(null);
  useEffect(() => yes.current?.focus(), []);
  return (
    <div
      className="ansiEditor-confirmBackdrop"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onNo();
        }
      }}
    >
      <div className="ansiEditor-confirm" role="alertdialog" aria-modal="true" aria-label={text}>
        <div className="ansiEditor-confirmText">{text}</div>
        <div className="ansiEditor-confirmActions">
          <button type="button" className="ansiEditor-btn ansiEditor-btnSecondary" onClick={onNo}>
            {t("confirm.no")}
          </button>
          <button
            ref={yes}
            type="button"
            className="ansiEditor-btn ansiEditor-btnDanger"
            onClick={onYes}
          >
            {t("confirm.yes")}
          </button>
        </div>
      </div>
    </div>
  );
}
