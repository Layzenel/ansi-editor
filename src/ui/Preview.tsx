import { parseAnsi } from "../core/parser";
import { styleClasses } from "./render";
import { t } from "../i18n";

const { useMemo } = BdApi.React;

/** Renders the serialized body exactly as it will be sent, by parsing it back. */
export function Preview({ body }: { body: string }) {
  const doc = useMemo(() => parseAnsi(body).doc, [body]);
  return (
    <div className="ansiEditor-previewWrap" aria-label={t("view.preview")}>
      <pre className="ansiEditor-preview ansiEditor-code">
        <code>
          {doc.map((run, i) => (
            <span key={i} className={styleClasses(run.style)}>
              {run.text}
            </span>
          ))}
          {"\n"}
        </code>
      </pre>
    </div>
  );
}
