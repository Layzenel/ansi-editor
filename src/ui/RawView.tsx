import { ESC } from "../core/parser";
import { t } from "../i18n";

const { useState } = BdApi.React;

const SEQ = /(\u001b\[[0-9;]*m)/;

/** Read-only code with visible escape sequences, plus a plain-text edit mode that re-parses. */
export function RawView({ output, onApply }: { output: string; onApply(text: string): void }) {
  const [editing, setEditing] = useState<string | null>(null);

  if (editing !== null) {
    return (
      <div className="ansiEditor-raw">
        <textarea
          className="ansiEditor-rawText ansiEditor-code"
          value={editing}
          spellCheck={false}
          onChange={(e) => setEditing(e.currentTarget.value)}
          autoFocus
        />
        <div className="ansiEditor-rawActions">
          <button
            type="button"
            className="ansiEditor-btn ansiEditor-btnSecondary"
            onClick={() => setEditing(null)}
          >
            {t("raw.cancel")}
          </button>
          <button
            type="button"
            className="ansiEditor-btn ansiEditor-btnPrimary"
            onClick={() => {
              onApply(editing);
              setEditing(null);
            }}
          >
            {t("raw.apply")}
          </button>
        </div>
      </div>
    );
  }

  const parts = output.split(SEQ);
  return (
    <div className="ansiEditor-raw">
      <pre className="ansiEditor-rawCode ansiEditor-code" aria-label={t("view.code")}>
        {parts.map((p, i) =>
          SEQ.test(p) ? (
            <span key={i} className="ansiEditor-esc">
              {"␛" + p.slice(1)}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </pre>
      <div className="ansiEditor-rawActions">
        <button
          type="button"
          className="ansiEditor-btn ansiEditor-btnSecondary"
          onClick={() => setEditing(output.split(ESC).join("\\u001b"))}
        >
          {t("raw.editAsText")}
        </button>
      </div>
    </div>
  );
}
