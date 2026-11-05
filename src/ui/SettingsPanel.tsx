import { storage, type Settings } from "../storage";
import { hotkeyFromEvent, isDiscordShortcut } from "./hotkey";
import { t, type StringKey } from "../i18n";

const { useState } = BdApi.React;

type Option = { label: string; value: string | number };
type Item =
  | { kind: "switch"; id: keyof Settings; name: StringKey; note?: StringKey }
  | { kind: "dropdown"; id: keyof Settings; name: StringKey; options: Option[] };

const opt = (value: string | number, label: StringKey | string): Option => ({
  value,
  label: label.includes(".") ? t(label as StringKey) : label,
});

function items(): Item[] {
  return [
    {
      kind: "dropdown",
      id: "primaryAction",
      name: "settings.primaryAction",
      options: [
        opt("insert", "settings.primaryAction.insert"),
        opt("send", "settings.primaryAction.send"),
        opt("copy", "settings.primaryAction.copy"),
      ],
    },
    {
      kind: "dropdown",
      id: "buttonPosition",
      name: "settings.buttonPosition",
      options: [
        opt("start", "settings.buttonPosition.start"),
        opt("end", "settings.buttonPosition.end"),
      ],
    },
    { kind: "switch", id: "editButton", name: "settings.editButton" },
    {
      kind: "dropdown",
      id: "charLimit",
      name: "settings.charLimit",
      options: [opt("auto", "settings.charLimit.auto"), opt("2000", "2000"), opt("4000", "4000")],
    },
    {
      kind: "dropdown",
      id: "importOnOpen",
      name: "settings.importOnOpen",
      options: [
        opt("ask", "settings.importOnOpen.ask"),
        opt("always", "settings.importOnOpen.always"),
        opt("never", "settings.importOnOpen.never"),
      ],
    },
    {
      kind: "dropdown",
      id: "layout",
      name: "settings.layout",
      options: [
        opt("side", "settings.layout.side"),
        opt("tabs", "settings.layout.tabs"),
        opt("editor", "settings.layout.editor"),
      ],
    },
    { kind: "switch", id: "trailingReset", name: "settings.trailingReset" },
    {
      kind: "switch",
      id: "aggressive",
      name: "settings.aggressive",
      note: "settings.aggressive.note",
    },
    {
      kind: "dropdown",
      id: "tabSize",
      name: "settings.tabs",
      options: [opt(0, "settings.tabs.off"), opt(2, "2"), opt(4, "4")],
    },
    { kind: "switch", id: "literalEscapes", name: "settings.literalEscapes" },
    { kind: "switch", id: "contextMenu", name: "settings.contextMenu" },
  ];
}

function HotkeyRecorder() {
  const [value, setValue] = useState(storage.getSettings().hotkey);
  const [recording, setRecording] = useState(false);
  const conflict = !!value && isDiscordShortcut(value);
  return (
    <div className="ansiEditor-settingRow">
      <button
        type="button"
        className="ansiEditor-btn ansiEditor-btnSecondary ansiEditor-hotkey"
        onClick={() => setRecording(true)}
        onBlur={() => setRecording(false)}
        onKeyDown={(e) => {
          if (!recording) return;
          e.preventDefault();
          e.stopPropagation();
          if (e.key === "Escape") return setRecording(false);
          const hk = hotkeyFromEvent(e.nativeEvent);
          if (!hk) return;
          setValue(hk);
          setRecording(false);
          if (!isDiscordShortcut(hk)) storage.updateSettings({ hotkey: hk });
        }}
      >
        {recording ? t("settings.hotkey.record") : value || "—"}
      </button>
      <button
        type="button"
        className="ansiEditor-btn ansiEditor-btnLink"
        onClick={() => (setValue(""), storage.updateSettings({ hotkey: "" }))}
      >
        {t("settings.hotkey.clear")}
      </button>
      {conflict && <span className="ansiEditor-error">{t("settings.hotkey.conflict")}</span>}
    </div>
  );
}

function ResetButton() {
  const [armed, setArmed] = useState(false);
  return (
    <button
      type="button"
      className="ansiEditor-btn ansiEditor-btnDanger"
      onClick={() => {
        if (!armed) return setArmed(true);
        storage.resetAll();
        setArmed(false);
        BdApi.UI.showToast(t("toast.allDataReset"), { type: "success" });
      }}
    >
      {armed ? t("settings.reset.confirm") : t("settings.reset.button")}
    </button>
  );
}

/** Fallback panel with native controls, used when BdApi.UI.buildSettingsPanel is missing. */
function NativePanel() {
  const [s, setS] = useState(storage.getSettings());
  const update = (id: keyof Settings, value: unknown) => {
    storage.updateSettings({ [id]: value } as Partial<Settings>);
    setS(storage.getSettings());
  };
  return (
    <div className="ansiEditor-settings">
      {items().map((it) => (
        <label key={it.id} className="ansiEditor-settingRow">
          <span className="ansiEditor-settingName">
            {t(it.name)}
            {it.kind === "switch" && it.note && (
              <small className="ansiEditor-muted"> — {t(it.note)}</small>
            )}
          </span>
          {it.kind === "switch" ? (
            <input
              type="checkbox"
              checked={!!s[it.id]}
              onChange={(e) => update(it.id, e.currentTarget.checked)}
            />
          ) : (
            <select
              className="ansiEditor-select"
              value={String(s[it.id])}
              onChange={(e) => {
                const raw = e.currentTarget.value;
                const o = it.options.find((x) => String(x.value) === raw);
                update(it.id, o?.value ?? raw);
              }}
            >
              {it.options.map((o) => (
                <option key={String(o.value)} value={String(o.value)}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
        </label>
      ))}
      <div className="ansiEditor-settingRow">
        <span className="ansiEditor-settingName">{t("settings.hotkey")}</span>
        <HotkeyRecorder />
      </div>
      <div className="ansiEditor-settingRow">
        <span className="ansiEditor-settingName">
          {t("settings.reset")}{" "}
          <small className="ansiEditor-muted">— {t("settings.reset.note")}</small>
        </span>
        <ResetButton />
      </div>
    </div>
  );
}

/** Settings panel: BetterDiscord's own components when available, native controls otherwise. */
export function buildSettingsPanel(): ReactNode {
  const build = BdApi.UI.buildSettingsPanel;
  if (!build) return <NativePanel />;
  const s = storage.getSettings();
  const settings: BdSettingsItem[] = items().map((it) =>
    it.kind === "switch"
      ? {
          type: "switch",
          id: it.id,
          name: t(it.name),
          note: it.note ? t(it.note) : undefined,
          value: s[it.id],
        }
      : { type: "dropdown", id: it.id, name: t(it.name), value: s[it.id], options: it.options },
  );
  settings.push(
    { type: "custom", id: "hotkey", name: t("settings.hotkey"), children: <HotkeyRecorder /> },
    {
      type: "custom",
      id: "reset",
      name: t("settings.reset"),
      note: t("settings.reset.note"),
      children: <ResetButton />,
    },
  );
  try {
    return build({
      settings,
      onChange: (_cat, id, value) => storage.updateSettings({ [id]: value } as Partial<Settings>),
    });
  } catch (e) {
    console.warn("[AnsiEditor] buildSettingsPanel failed, using native panel", e);
    return <NativePanel />;
  }
}
