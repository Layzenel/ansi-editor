/**
 * @name AnsiEditor
 * @author Layzenel
 * @description Visual editor for colored ANSI text in Discord messages
 * @version 1.0.0
 * @source https://github.com/Layzenel/ansi-editor
 */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => AnsiEditor
});
module.exports = __toCommonJS(index_exports);

// src/meta.json
var meta_default = {
  name: "AnsiEditor",
  author: "Layzenel",
  description: "Visual editor for colored ANSI text in Discord messages",
  version: "1.0.0",
  source: "https://github.com/Layzenel/ansi-editor"
};

// src/styles/editor.css
var editor_default = '/* ANSI Editor — all classes are prefixed with ansiEditor-; colors come from Discord CSS variables. */\n\n.ansiEditor-host {\n  --ae-bg: var(--background-primary, var(--background-base-low, #313338));\n  --ae-bg2: var(--background-secondary, var(--background-base-lower, #2b2d31));\n  --ae-bg3: var(--background-tertiary, var(--background-base-lowest, #1e1f22));\n  --ae-floating: var(--background-floating, var(--background-surface-highest, #111214));\n  --ae-text: var(--text-normal, var(--text-default, #dbdee1));\n  --ae-muted: var(--text-muted, #949ba4);\n  --ae-header: var(--header-primary, var(--text-strong, #f2f3f5));\n  --ae-int: var(--interactive-normal, var(--interactive-text-default, #b5bac1));\n  --ae-int-hover: var(--interactive-hover, var(--interactive-text-hover, #dbdee1));\n  --ae-int-active: var(--interactive-active, var(--interactive-text-active, #ffffff));\n  --ae-brand: var(--brand-500, var(--brand-experiment, #5865f2));\n  --ae-brand-hover: var(--brand-560, var(--brand-experiment-560, #4752c4));\n  --ae-danger: var(--status-danger, #da373c);\n  --ae-warning: var(--status-warning, #f0b232);\n  --ae-border: var(--background-modifier-accent, var(--border-subtle, rgba(255, 255, 255, 0.08)));\n  --ae-hover: var(--background-modifier-hover, rgba(78, 80, 88, 0.3));\n  --ae-selected: var(--background-modifier-selected, rgba(78, 80, 88, 0.6));\n  --ae-radius: 8px;\n  font-family: var(--font-primary, "gg sans", "Noto Sans", sans-serif);\n  color: var(--ae-text);\n}\n\n/* Palette (CSS variables from PALETTE, overridable by themes) */\n.ansiEditor-fg-30 {\n  color: var(--ansi-fg-30);\n}\n.ansiEditor-fg-31 {\n  color: var(--ansi-fg-31);\n}\n.ansiEditor-fg-32 {\n  color: var(--ansi-fg-32);\n}\n.ansiEditor-fg-33 {\n  color: var(--ansi-fg-33);\n}\n.ansiEditor-fg-34 {\n  color: var(--ansi-fg-34);\n}\n.ansiEditor-fg-35 {\n  color: var(--ansi-fg-35);\n}\n.ansiEditor-fg-36 {\n  color: var(--ansi-fg-36);\n}\n.ansiEditor-fg-37 {\n  color: var(--ansi-fg-37);\n}\n.ansiEditor-bg-40 {\n  background-color: var(--ansi-bg-40);\n}\n.ansiEditor-bg-41 {\n  background-color: var(--ansi-bg-41);\n}\n.ansiEditor-bg-42 {\n  background-color: var(--ansi-bg-42);\n}\n.ansiEditor-bg-43 {\n  background-color: var(--ansi-bg-43);\n}\n.ansiEditor-bg-44 {\n  background-color: var(--ansi-bg-44);\n}\n.ansiEditor-bg-45 {\n  background-color: var(--ansi-bg-45);\n}\n.ansiEditor-bg-46 {\n  background-color: var(--ansi-bg-46);\n}\n.ansiEditor-bg-47 {\n  background-color: var(--ansi-bg-47);\n}\n.ansiEditor-b {\n  font-weight: 700;\n}\n.ansiEditor-u {\n  text-decoration: underline;\n}\n\n/* Text-area button fallback (when neighbour classes could not be copied) */\n.ansiEditor-tbWrap {\n  display: flex;\n  align-items: center;\n}\n.ansiEditor-tbButton {\n  cursor: pointer;\n  color: var(--interactive-normal, #b5bac1);\n  background: none;\n  border: 0;\n}\n.ansiEditor-tbButton:hover {\n  color: var(--interactive-hover, #dbdee1);\n}\n.ansiEditor-tbInner {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 4px;\n}\n\n/* Overlay + modal */\n.ansiEditor-backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(0, 0, 0, 0.7);\n  animation: ansiEditor-fade 0.15s ease-out;\n}\n.ansiEditor-closing {\n  animation: ansiEditor-fadeOut 0.15s ease-in forwards;\n}\n.ansiEditor-closing .ansiEditor-modal {\n  animation: ansiEditor-popOut 0.15s ease-in forwards;\n}\n@keyframes ansiEditor-fade {\n  from {\n    opacity: 0;\n  }\n}\n@keyframes ansiEditor-fadeOut {\n  to {\n    opacity: 0;\n  }\n}\n@keyframes ansiEditor-pop {\n  from {\n    transform: scale(0.9);\n    opacity: 0;\n  }\n}\n@keyframes ansiEditor-popOut {\n  to {\n    transform: scale(0.9);\n    opacity: 0;\n  }\n}\n\n.ansiEditor-modal {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  min-width: 560px;\n  min-height: 420px;\n  max-width: 96vw;\n  max-height: 92vh;\n  resize: both;\n  overflow: hidden;\n  background: var(--ae-bg);\n  border-radius: var(--ae-radius);\n  box-shadow: var(--elevation-high, 0 8px 16px rgba(0, 0, 0, 0.24));\n  animation: ansiEditor-pop 0.2s cubic-bezier(0.2, 1.2, 0.4, 1);\n}\n\n.ansiEditor-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 16px 8px;\n}\n.ansiEditor-title {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 600;\n  line-height: 24px;\n  color: var(--ae-header);\n}\n.ansiEditor-close {\n  display: flex;\n  padding: 4px;\n  border: 0;\n  border-radius: 4px;\n  background: none;\n  color: var(--ae-int);\n  cursor: pointer;\n}\n.ansiEditor-close:hover {\n  color: var(--ae-int-hover);\n}\n\n/* Toolbar */\n.ansiEditor-toolbar {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px 16px;\n  align-items: center;\n  padding: 8px 16px;\n  border-bottom: 1px solid var(--ae-border);\n}\n.ansiEditor-toolGroup {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.ansiEditor-toolButtons {\n  gap: 2px;\n}\n.ansiEditor-toolLabel {\n  font-size: 12px;\n  font-weight: 600;\n  text-transform: uppercase;\n  color: var(--ae-muted);\n}\n.ansiEditor-divider {\n  width: 1px;\n  height: 20px;\n  margin: 0 6px;\n  background: var(--ae-border);\n}\n.ansiEditor-palette {\n  display: flex;\n  gap: 4px;\n}\n\n.ansiEditor-swatch {\n  position: relative;\n  width: 20px;\n  height: 20px;\n  padding: 0;\n  border: 1px solid rgba(0, 0, 0, 0.25);\n  border-radius: 4px;\n  cursor: pointer;\n}\n.ansiEditor-swatch-30 {\n  background: var(--ansi-fg-30);\n}\n.ansiEditor-swatch-31 {\n  background: var(--ansi-fg-31);\n}\n.ansiEditor-swatch-32 {\n  background: var(--ansi-fg-32);\n}\n.ansiEditor-swatch-33 {\n  background: var(--ansi-fg-33);\n}\n.ansiEditor-swatch-34 {\n  background: var(--ansi-fg-34);\n}\n.ansiEditor-swatch-35 {\n  background: var(--ansi-fg-35);\n}\n.ansiEditor-swatch-36 {\n  background: var(--ansi-fg-36);\n}\n.ansiEditor-swatch-37 {\n  background: var(--ansi-fg-37);\n}\n.ansiEditor-swatch-40 {\n  background: var(--ansi-bg-40);\n}\n.ansiEditor-swatch-41 {\n  background: var(--ansi-bg-41);\n}\n.ansiEditor-swatch-42 {\n  background: var(--ansi-bg-42);\n}\n.ansiEditor-swatch-43 {\n  background: var(--ansi-bg-43);\n}\n.ansiEditor-swatch-44 {\n  background: var(--ansi-bg-44);\n}\n.ansiEditor-swatch-45 {\n  background: var(--ansi-bg-45);\n}\n.ansiEditor-swatch-46 {\n  background: var(--ansi-bg-46);\n}\n.ansiEditor-swatch-47 {\n  background: var(--ansi-bg-47);\n}\n.ansiEditor-swatchNone {\n  background:\n    linear-gradient(\n      135deg,\n      transparent 45%,\n      var(--ae-danger) 45%,\n      var(--ae-danger) 55%,\n      transparent 55%\n    ),\n    var(--ae-bg3);\n}\n.ansiEditor-swatchActive {\n  outline: 2px solid var(--ae-int-active);\n  outline-offset: 1px;\n}\n.ansiEditor-swatchPartial {\n  outline-style: dashed;\n}\n\n.ansiEditor-iconButton {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  border: 0;\n  border-radius: 4px;\n  background: none;\n  color: var(--ae-int);\n  cursor: pointer;\n}\n.ansiEditor-iconButton:hover:not(:disabled) {\n  background: var(--ae-hover);\n  color: var(--ae-int-hover);\n}\n.ansiEditor-iconButton:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n.ansiEditor-pressed {\n  background: var(--ae-selected);\n  color: var(--ae-int-active);\n}\n.ansiEditor-partial {\n  background: var(--ae-hover);\n  color: var(--ae-int-hover);\n  box-shadow: inset 0 -2px 0 var(--ae-int);\n}\n\n/* Body */\n.ansiEditor-body {\n  position: relative;\n  display: flex;\n  flex: 1;\n  min-height: 0;\n}\n.ansiEditor-split2 {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n  flex: 1;\n  min-height: 0;\n  padding: 12px 16px;\n}\n.ansiEditor-body > .ansiEditor-pane {\n  flex: 1;\n  padding: 12px 16px;\n}\n.ansiEditor-pane {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  min-width: 0;\n  min-height: 0;\n}\n\n.ansiEditor-code {\n  font-family: var(--font-code, Consolas, "Andale Mono WT", monospace);\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n\n.ansiEditor-editor {\n  flex: 1;\n  min-height: 0;\n  overflow: auto;\n  padding: 0.5em;\n  border: 1px solid var(--ae-border);\n  border-radius: 4px;\n  background: var(--ae-bg2);\n  color: var(--ae-text);\n  outline: none;\n  caret-color: var(--ae-int-active);\n  tab-size: 4;\n}\n.ansiEditor-editor:focus-visible {\n  box-shadow: 0 0 0 2px var(--ae-brand);\n}\n.ansiEditor-editor[data-empty]::before {\n  content: attr(data-placeholder);\n  position: absolute;\n  color: var(--ae-muted);\n  pointer-events: none;\n}\n.ansiEditor-marked {\n  outline: 1px dashed var(--ae-int-active);\n  outline-offset: -1px;\n  background-image: linear-gradient(var(--ae-hover), var(--ae-hover));\n}\n\n/* Preview: looks like a Discord code block */\n.ansiEditor-previewWrap {\n  flex: 1;\n  min-height: 0;\n  overflow: auto;\n}\n.ansiEditor-preview {\n  margin: 0;\n  padding: 0.5em;\n  border: 1px solid var(--ae-bg3);\n  border-radius: 4px;\n  background: var(--ae-bg2);\n  color: var(--ae-text);\n}\n.ansiEditor-panel .ansiEditor-previewWrap {\n  flex: none;\n  max-height: 120px;\n}\n\n.ansiEditor-raw {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  min-height: 0;\n  gap: 8px;\n}\n.ansiEditor-rawCode {\n  flex: 1;\n  margin: 0;\n  overflow: auto;\n  padding: 0.5em;\n  border-radius: 4px;\n  background: var(--ae-bg3);\n  color: var(--ae-text);\n}\n.ansiEditor-rawText {\n  flex: 1;\n  resize: none;\n  padding: 0.5em;\n  border: 1px solid var(--ae-border);\n  border-radius: 4px;\n  background: var(--ae-bg3);\n  color: var(--ae-text);\n}\n.ansiEditor-esc {\n  color: var(--ae-brand);\n  opacity: 0.85;\n}\n.ansiEditor-rawActions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n}\n\n/* Tabs */\n.ansiEditor-tabs {\n  display: flex;\n  gap: 4px;\n}\n.ansiEditor-tab {\n  padding: 4px 10px;\n  border: 0;\n  border-radius: 4px;\n  background: none;\n  color: var(--ae-int);\n  font: inherit;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n}\n.ansiEditor-tab:hover {\n  background: var(--ae-hover);\n  color: var(--ae-int-hover);\n}\n.ansiEditor-tabActive {\n  background: var(--ae-selected);\n  color: var(--ae-int-active);\n}\n\n/* Drawer panels (effects / presets) */\n.ansiEditor-drawer {\n  position: absolute;\n  top: 8px;\n  right: 16px;\n  z-index: 2;\n  width: min(380px, calc(100% - 32px));\n  max-height: calc(100% - 16px);\n  overflow: auto;\n  border-radius: var(--ae-radius);\n  background: var(--ae-floating);\n  box-shadow: var(--elevation-high, 0 8px 16px rgba(0, 0, 0, 0.24));\n}\n.ansiEditor-panel {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 12px;\n}\n.ansiEditor-panelRow {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 8px;\n}\n.ansiEditor-panelFooter {\n  justify-content: space-between;\n}\n.ansiEditor-panelTitle {\n  font-size: 12px;\n  font-weight: 700;\n  text-transform: uppercase;\n  color: var(--ae-header);\n}\n.ansiEditor-field {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  font-size: 12px;\n  color: var(--ae-muted);\n}\n.ansiEditor-check {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 14px;\n}\n.ansiEditor-select,\n.ansiEditor-input {\n  padding: 6px 8px;\n  border: 1px solid var(--ae-border);\n  border-radius: 4px;\n  background: var(--ae-bg3);\n  color: var(--ae-text);\n  font: inherit;\n  font-size: 14px;\n}\n.ansiEditor-input {\n  flex: 1;\n  min-width: 120px;\n}\n.ansiEditor-colorSelect {\n  width: 36px;\n  color: transparent;\n}\n.ansiEditor-colorSelect option {\n  color: var(--ae-text);\n  background: var(--ae-bg3);\n}\n.ansiEditor-list {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.ansiEditor-listItem {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.ansiEditor-listMain {\n  display: flex;\n  flex: 1;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n  padding: 6px 8px;\n  border: 0;\n  border-radius: 4px;\n  background: none;\n  color: var(--ae-text);\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n.ansiEditor-listMain:hover {\n  background: var(--ae-hover);\n}\n.ansiEditor-sample {\n  padding: 0 4px;\n  border-radius: 3px;\n}\n.ansiEditor-ellipsis {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.ansiEditor-kbd {\n  padding: 1px 4px;\n  border-radius: 3px;\n  background: var(--ae-bg3);\n  color: var(--ae-muted);\n  font-size: 11px;\n}\n\n/* Banner */\n.ansiEditor-banner {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 8px 16px 0;\n  padding: 8px 12px;\n  border-radius: 4px;\n  background: var(--ae-bg2);\n  font-size: 14px;\n}\n.ansiEditor-banner > span {\n  flex: 1;\n}\n\n/* Footer */\n.ansiEditor-footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 12px 16px;\n  background: var(--ae-bg2);\n}\n.ansiEditor-footerLeft,\n.ansiEditor-footerRight {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.ansiEditor-counter {\n  font-size: 13px;\n  font-variant-numeric: tabular-nums;\n  color: var(--ae-muted);\n}\n.ansiEditor-counter-warning {\n  color: var(--ae-warning);\n}\n.ansiEditor-counter-error {\n  color: var(--ae-danger);\n  font-weight: 600;\n}\n.ansiEditor-hint {\n  display: flex;\n  color: var(--ae-muted);\n}\n.ansiEditor-error {\n  font-size: 13px;\n  color: var(--ae-danger);\n}\n.ansiEditor-muted {\n  font-size: 13px;\n  color: var(--ae-muted);\n}\n\n/* Buttons (Discord look) */\n.ansiEditor-btn {\n  min-height: 32px;\n  padding: 2px 16px;\n  border: 0;\n  border-radius: 4px;\n  font: inherit;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background-color 0.17s ease;\n}\n.ansiEditor-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.ansiEditor-btnPrimary {\n  background: var(--ae-brand);\n  color: #fff;\n}\n.ansiEditor-btnPrimary:hover:not(:disabled) {\n  background: var(--ae-brand-hover);\n}\n.ansiEditor-btnSecondary {\n  background: var(--button-secondary-background, #4e5058);\n  color: #fff;\n}\n.ansiEditor-btnSecondary:hover:not(:disabled) {\n  background: var(--button-secondary-background-hover, #6d6f78);\n}\n.ansiEditor-btnDanger {\n  background: var(--ae-danger);\n  color: #fff;\n}\n.ansiEditor-btnLink {\n  padding: 2px 4px;\n  background: none;\n  color: var(--text-link, #00a8fc);\n}\n.ansiEditor-btnLink:hover {\n  text-decoration: underline;\n}\n.ansiEditor-btnSmall {\n  min-height: 24px;\n  padding: 2px 8px;\n}\n.ansiEditor-split {\n  position: relative;\n  display: flex;\n}\n.ansiEditor-split > .ansiEditor-btn:first-child {\n  border-radius: 4px 0 0 4px;\n}\n.ansiEditor-splitToggle {\n  display: flex;\n  align-items: center;\n  padding: 2px 6px;\n  border-left: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 0 4px 4px 0;\n}\n.ansiEditor-menu {\n  position: absolute;\n  bottom: calc(100% + 6px);\n  right: 0;\n  z-index: 3;\n  display: flex;\n  flex-direction: column;\n  min-width: 220px;\n  padding: 6px 8px;\n  border-radius: 4px;\n  background: var(--ae-floating);\n  box-shadow: var(--elevation-high, 0 8px 16px rgba(0, 0, 0, 0.24));\n}\n.ansiEditor-menuItem {\n  padding: 6px 8px;\n  border: 0;\n  border-radius: 2px;\n  background: none;\n  color: var(--ae-text);\n  font: inherit;\n  font-size: 14px;\n  text-align: left;\n  cursor: pointer;\n}\n.ansiEditor-menuItem:hover {\n  background: var(--ae-brand);\n  color: #fff;\n}\n\n/* Confirm */\n.ansiEditor-confirmBackdrop {\n  position: absolute;\n  inset: 0;\n  z-index: 10;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(0, 0, 0, 0.5);\n}\n.ansiEditor-confirm {\n  width: 360px;\n  max-width: 90%;\n  padding: 16px;\n  border-radius: var(--ae-radius);\n  background: var(--ae-bg);\n  box-shadow: var(--elevation-high, 0 8px 16px rgba(0, 0, 0, 0.24));\n}\n.ansiEditor-confirmText {\n  margin-bottom: 16px;\n  font-size: 16px;\n  color: var(--ae-header);\n}\n.ansiEditor-confirmActions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n}\n\n/* Settings fallback */\n.ansiEditor-settings {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  color: var(--text-normal, #dbdee1);\n}\n.ansiEditor-settingRow {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.ansiEditor-settingName {\n  font-size: 16px;\n  font-weight: 500;\n}\n.ansiEditor-hotkey {\n  min-width: 160px;\n  font-family: var(--font-code, monospace);\n}\n\n/* Focus visibility */\n.ansiEditor-host :is(button, select, input, textarea, [tabindex="0"]):focus-visible,\n.ansiEditor-settings :is(button, select, input):focus-visible {\n  outline: 2px solid var(--focus-primary, var(--ae-brand, #00b0f4));\n  outline-offset: 1px;\n}\n\n/* Own tooltip (Discord look), rendered inside the overlay host */\n.ansiEditor-tooltip {\n  position: fixed;\n  z-index: 1001;\n  max-width: 260px;\n  padding: 6px 10px;\n  border-radius: 6px;\n  background: var(--ae-floating, #111214);\n  box-shadow: var(--elevation-high, 0 8px 16px rgba(0, 0, 0, 0.24));\n  color: var(--ae-text, #dbdee1);\n  font-family: var(--font-primary, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 18px;\n  white-space: pre-line;\n  pointer-events: none;\n  transform: translate(-50%, -100%);\n  animation: ansiEditor-fade 0.1s ease-out;\n}\n.ansiEditor-tooltipBelow {\n  transform: translate(-50%, 0);\n}\n';

// src/core/palette.ts
var FG_CODES = [30, 31, 32, 33, 34, 35, 36, 37];
var BG_CODES = [40, 41, 42, 43, 44, 45, 46, 47];
var PALETTE = {
  30: "#4f545c",
  31: "#dc322f",
  32: "#859900",
  33: "#b58900",
  34: "#268bd2",
  35: "#d33682",
  36: "#2aa198",
  37: "#ffffff",
  40: "#002b36",
  41: "#cb4b16",
  42: "#586e75",
  43: "#657b83",
  44: "#839496",
  45: "#6c71c4",
  46: "#93a1a1",
  47: "#fdf6e3"
};
var COLOR_IDS = {
  30: "gray",
  31: "red",
  32: "green",
  33: "yellow",
  34: "blue",
  35: "pink",
  36: "cyan",
  37: "white",
  40: "firefly",
  41: "orange",
  42: "marbleBlue",
  43: "grayTurquoise",
  44: "gray",
  45: "indigo",
  46: "lightGray",
  47: "white"
};
function codeFor(layer, index) {
  return (layer === "fg" ? 30 : 40) + (index & 7);
}
function isFgCode(n) {
  return Number.isInteger(n) && n >= 30 && n <= 37;
}
function isBgCode(n) {
  return Number.isInteger(n) && n >= 40 && n <= 47;
}
function paletteCssVars() {
  const lines = Object.keys(PALETTE).map((code) => {
    const layer = Number(code) < 40 ? "fg" : "bg";
    return `  --ansi-${layer}-${code}: ${PALETTE[code]};`;
  });
  return `:root {
${lines.join("\n")}
}`;
}

// src/i18n/en.ts
var en = {
  "button.tooltip": "ANSI editor",
  "modal.title": "ANSI editor",
  "modal.close": "Close",
  "modal.editingMessage": "Editing message",
  "toolbar.textColor": "Text color",
  "toolbar.bgColor": "Background",
  "toolbar.default": "Default",
  "toolbar.noBg": "No background",
  "toolbar.bold": "Bold (Ctrl+B)",
  "toolbar.underline": "Underline (Ctrl+U)",
  "toolbar.resetStyle": "Reset selection style (Ctrl+Space)",
  "toolbar.clearAll": "Clear everything",
  "toolbar.undo": "Undo (Ctrl+Z)",
  "toolbar.redo": "Redo (Ctrl+Shift+Z)",
  "toolbar.effects": "Effects",
  "toolbar.presets": "Presets and recent",
  "toolbar.new": "New",
  "toolbar.importClipboard": "Import from clipboard",
  "toolbar.partial": "partially",
  "toolbar.altHint": "Alt+click: select all text with this color",
  "color.fg.gray": "Gray",
  "color.fg.red": "Red",
  "color.fg.green": "Green",
  "color.fg.yellow": "Yellow",
  "color.fg.blue": "Blue",
  "color.fg.pink": "Pink",
  "color.fg.cyan": "Cyan",
  "color.fg.white": "White",
  "color.bg.firefly": "Firefly dark blue",
  "color.bg.orange": "Orange",
  "color.bg.marbleBlue": "Marble blue",
  "color.bg.grayTurquoise": "Greyish turquoise",
  "color.bg.gray": "Gray",
  "color.bg.indigo": "Indigo",
  "color.bg.lightGray": "Light gray",
  "color.bg.white": "White",
  "view.editor": "Editor",
  "view.preview": "Preview",
  "view.code": "Code",
  "view.placeholder": "Type text, select it and pick a color…",
  "raw.editAsText": "Edit as text",
  "raw.apply": "Apply",
  "raw.cancel": "Cancel",
  "footer.insert": "Insert",
  "footer.send": "Send",
  "footer.copy": "Copy",
  "footer.save": "Save",
  "footer.copyWrapped": "Copy with ```ansi",
  "footer.copyRaw": "Copy without wrapper",
  "footer.copyPlain": "Copy plain text",
  "footer.optimize": "Optimize",
  "footer.counterTip": "Text: {text} · escape codes: {esc} · wrapper: {wrap}",
  "footer.overLimit": "Message is longer than {limit} characters",
  "footer.replyHint": "You are replying to a message: Send would drop the reply, so Insert is used",
  "footer.mobileHint": "Colors are not shown on mobile Discord clients",
  "footer.backticksHint": "``` in the text is escaped with zero-width spaces",
  "effects.rainbow": "Rainbow",
  "effects.alternate": "Alternate",
  "effects.step": "Step",
  "effects.step.char": "Character",
  "effects.step.word": "Word",
  "effects.step.line": "Line",
  "effects.layer": "Layer",
  "effects.layer.fg": "Text",
  "effects.layer.bg": "Background",
  "effects.skipSpaces": "Skip spaces",
  "effects.colors": "Colors",
  "effects.addColor": "Add color",
  "effects.removeColor": "Remove color",
  "effects.apply": "Apply",
  "effects.target.selection": "Applies to the selection",
  "effects.target.all": "Applies to the whole text",
  "presets.title": "Presets",
  "presets.empty": "No presets yet",
  "presets.add": "Save current style",
  "presets.namePlaceholder": "Preset name",
  "presets.delete": "Delete",
  "presets.recent": "Recent",
  "presets.recentEmpty": "Nothing sent yet",
  "confirm.discard": "Discard unsaved changes?",
  "confirm.clearAll": "Delete all text?",
  "confirm.new": "Start a new document? The current one will be cleared.",
  "confirm.yes": "Yes",
  "confirm.no": "Cancel",
  "import.found": "The message box contains an ANSI block. Import it?",
  "import.yes": "Import",
  "import.no": "No",
  "import.warnings": "Ignored {n} unsupported codes",
  "toast.copied": "Copied",
  "toast.copiedPaste": "Copied — paste with Ctrl+V",
  "toast.sent": "Sent",
  "toast.saved": "Message updated",
  "toast.optimized": "Saved {n} characters",
  "toast.nothingToOptimize": "Already optimal",
  "toast.fallback": "ANSI Editor: could not hook into the message box, using compatibility mode",
  "toast.noModules": "ANSI Editor: some Discord features are unavailable, falling back to clipboard",
  "toast.clipboardEmpty": "Clipboard is empty",
  "toast.dataReset": "ANSI Editor: saved data was damaged and has been reset",
  "toast.allDataReset": "All ANSI Editor data was deleted",
  "menu.ansi": "ANSI",
  "menu.open": "Open in editor",
  "menu.edit": "Edit in ANSI editor",
  "menu.copyAnsi": "Copy as ANSI code",
  "menu.copyPlain": "Copy as plain text",
  "menu.block": "Block {n}",
  "settings.primaryAction": "Primary button action",
  "settings.primaryAction.insert": "Insert",
  "settings.primaryAction.send": "Send",
  "settings.primaryAction.copy": "Copy",
  "settings.buttonPosition": "Button position in the message box",
  "settings.buttonPosition.start": "First",
  "settings.buttonPosition.end": "Last",
  "settings.editButton": "Button in the message edit box",
  "settings.charLimit": "Character limit",
  "settings.charLimit.auto": "Auto (by Nitro)",
  "settings.importOnOpen": "Import ANSI from the message box on open",
  "settings.importOnOpen.ask": "Ask",
  "settings.importOnOpen.always": "Always",
  "settings.importOnOpen.never": "Never",
  "settings.layout": "Layout",
  "settings.layout.side": "Side by side",
  "settings.layout.tabs": "Tabs",
  "settings.layout.editor": "Editor only",
  "settings.trailingReset": "Trailing ESC[0m",
  "settings.aggressive": "Aggressive optimization",
  "settings.aggressive.note": "Do not switch text color on spaces without background or underline",
  "settings.tabs": "Tabs → spaces",
  "settings.tabs.off": "Off",
  "settings.literalEscapes": "Recognize typed \\u001b when pasting",
  "settings.contextMenu": "Message context menu items",
  "settings.hotkey": "Open hotkey",
  "settings.hotkey.record": "Press a key combination…",
  "settings.hotkey.conflict": "Conflicts with a built-in Discord shortcut",
  "settings.hotkey.clear": "Clear",
  "settings.reset": "Reset all data",
  "settings.reset.note": "Deletes settings, presets, recent documents and the draft",
  "settings.reset.button": "Reset",
  "settings.reset.confirm": "Click again to confirm"
};

// src/i18n/ru.ts
var ru = {
  "button.tooltip": "ANSI-редактор",
  "modal.title": "ANSI-редактор",
  "modal.close": "Закрыть",
  "modal.editingMessage": "Редактирование сообщения",
  "toolbar.textColor": "Цвет текста",
  "toolbar.bgColor": "Фон",
  "toolbar.default": "По умолчанию",
  "toolbar.noBg": "Без фона",
  "toolbar.bold": "Жирный (Ctrl+B)",
  "toolbar.underline": "Подчёркивание (Ctrl+U)",
  "toolbar.resetStyle": "Сбросить стиль выделения (Ctrl+Space)",
  "toolbar.clearAll": "Очистить всё",
  "toolbar.undo": "Отменить (Ctrl+Z)",
  "toolbar.redo": "Повторить (Ctrl+Shift+Z)",
  "toolbar.effects": "Эффекты",
  "toolbar.presets": "Пресеты и недавние",
  "toolbar.new": "Новый",
  "toolbar.importClipboard": "Импорт из буфера обмена",
  "toolbar.partial": "частично",
  "toolbar.altHint": "Alt+клик: выделить весь текст этого цвета",
  "color.fg.gray": "Серый",
  "color.fg.red": "Красный",
  "color.fg.green": "Зелёный",
  "color.fg.yellow": "Жёлтый",
  "color.fg.blue": "Синий",
  "color.fg.pink": "Розовый",
  "color.fg.cyan": "Голубой",
  "color.fg.white": "Белый",
  "color.bg.firefly": "Тёмно-синий",
  "color.bg.orange": "Оранжевый",
  "color.bg.marbleBlue": "Мраморно-синий",
  "color.bg.grayTurquoise": "Серо-бирюзовый",
  "color.bg.gray": "Серый",
  "color.bg.indigo": "Индиго",
  "color.bg.lightGray": "Светло-серый",
  "color.bg.white": "Белый",
  "view.editor": "Редактор",
  "view.preview": "Превью",
  "view.code": "Код",
  "view.placeholder": "Введите текст, выделите его и выберите цвет…",
  "raw.editAsText": "Редактировать как текст",
  "raw.apply": "Применить",
  "raw.cancel": "Отмена",
  "footer.insert": "Вставить",
  "footer.send": "Отправить",
  "footer.copy": "Копировать",
  "footer.save": "Сохранить",
  "footer.copyWrapped": "Копировать с ```ansi",
  "footer.copyRaw": "Копировать без обёртки",
  "footer.copyPlain": "Копировать обычный текст",
  "footer.optimize": "Оптимизировать",
  "footer.counterTip": "Текст: {text} · escape-коды: {esc} · обёртка: {wrap}",
  "footer.overLimit": "Сообщение длиннее {limit} символов",
  "footer.replyHint": "Вы отвечаете на сообщение: отправка сбросит ответ, поэтому используется вставка",
  "footer.mobileHint": "На мобильных клиентах Discord цвета не отображаются",
  "footer.backticksHint": "``` в тексте экранированы невидимыми пробелами",
  "effects.rainbow": "Радуга",
  "effects.alternate": "Чередование",
  "effects.step": "Шаг",
  "effects.step.char": "Символ",
  "effects.step.word": "Слово",
  "effects.step.line": "Строка",
  "effects.layer": "Слой",
  "effects.layer.fg": "Текст",
  "effects.layer.bg": "Фон",
  "effects.skipSpaces": "Пропускать пробелы",
  "effects.colors": "Цвета",
  "effects.addColor": "Добавить цвет",
  "effects.removeColor": "Убрать цвет",
  "effects.apply": "Применить",
  "effects.target.selection": "Применяется к выделению",
  "effects.target.all": "Применяется ко всему тексту",
  "presets.title": "Пресеты",
  "presets.empty": "Пресетов пока нет",
  "presets.add": "Сохранить текущий стиль",
  "presets.namePlaceholder": "Название пресета",
  "presets.delete": "Удалить",
  "presets.recent": "Недавние",
  "presets.recentEmpty": "Пока ничего не отправлено",
  "confirm.discard": "Закрыть без сохранения изменений?",
  "confirm.clearAll": "Удалить весь текст?",
  "confirm.new": "Начать новый документ? Текущий будет очищен.",
  "confirm.yes": "Да",
  "confirm.no": "Отмена",
  "import.found": "В поле ввода есть ANSI-блок. Импортировать его?",
  "import.yes": "Импортировать",
  "import.no": "Нет",
  "import.warnings": "Пропущено неподдерживаемых кодов: {n}",
  "toast.copied": "Скопировано",
  "toast.copiedPaste": "Скопировано, вставьте Ctrl+V",
  "toast.sent": "Отправлено",
  "toast.saved": "Сообщение изменено",
  "toast.optimized": "Сэкономлено символов: {n}",
  "toast.nothingToOptimize": "Уже оптимально",
  "toast.fallback": "ANSI Editor: не удалось встроиться в поле ввода, включён режим совместимости",
  "toast.noModules": "ANSI Editor: часть функций Discord недоступна, используется буфер обмена",
  "toast.clipboardEmpty": "Буфер обмена пуст",
  "toast.dataReset": "ANSI Editor: сохранённые данные повреждены и сброшены",
  "toast.allDataReset": "Все данные ANSI Editor удалены",
  "menu.ansi": "ANSI",
  "menu.open": "Открыть в редакторе",
  "menu.edit": "Редактировать в ANSI-редакторе",
  "menu.copyAnsi": "Копировать как ANSI-код",
  "menu.copyPlain": "Копировать как обычный текст",
  "menu.block": "Блок {n}",
  "settings.primaryAction": "Действие основной кнопки",
  "settings.primaryAction.insert": "Вставить",
  "settings.primaryAction.send": "Отправить",
  "settings.primaryAction.copy": "Копировать",
  "settings.buttonPosition": "Позиция кнопки в поле ввода",
  "settings.buttonPosition.start": "В начале",
  "settings.buttonPosition.end": "В конце",
  "settings.editButton": "Кнопка в поле редактирования сообщения",
  "settings.charLimit": "Лимит символов",
  "settings.charLimit.auto": "Авто (по Nitro)",
  "settings.importOnOpen": "Импорт ANSI из поля ввода при открытии",
  "settings.importOnOpen.ask": "Спрашивать",
  "settings.importOnOpen.always": "Всегда",
  "settings.importOnOpen.never": "Никогда",
  "settings.layout": "Раскладка",
  "settings.layout.side": "Рядом",
  "settings.layout.tabs": "Вкладки",
  "settings.layout.editor": "Только редактор",
  "settings.trailingReset": "Завершающий ESC[0m",
  "settings.aggressive": "Агрессивная оптимизация",
  "settings.aggressive.note": "Не переключать цвет текста на пробелах без фона и подчёркивания",
  "settings.tabs": "Табы → пробелы",
  "settings.tabs.off": "Выкл",
  "settings.literalEscapes": "Распознавать текстовые \\u001b при вставке",
  "settings.contextMenu": "Пункты в контекстном меню сообщения",
  "settings.hotkey": "Горячая клавиша открытия",
  "settings.hotkey.record": "Нажмите сочетание клавиш…",
  "settings.hotkey.conflict": "Конфликтует со встроенным сочетанием Discord",
  "settings.hotkey.clear": "Очистить",
  "settings.reset": "Сброс всех данных",
  "settings.reset.note": "Удаляет настройки, пресеты, недавние документы и черновик",
  "settings.reset.button": "Сбросить",
  "settings.reset.confirm": "Нажмите ещё раз для подтверждения"
};

// src/i18n/index.ts
function locale() {
  try {
    const store2 = BdApi.Webpack.getStore?.("LocaleStore");
    if (store2?.locale) return String(store2.locale);
  } catch {
  }
  return document.documentElement.lang || navigator.language || "en";
}
function t(key, vars = {}) {
  const table = locale().toLowerCase().startsWith("ru") ? ru : en;
  const s = table[key] ?? en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

// src/storage.ts
var PLUGIN = "AnsiEditor";
var VERSION = 1;
var DEFAULT_SETTINGS = {
  primaryAction: "insert",
  buttonPosition: "start",
  editButton: false,
  charLimit: "auto",
  importOnOpen: "ask",
  layout: "side",
  trailingReset: true,
  aggressive: true,
  tabSize: 4,
  literalEscapes: true,
  contextMenu: true,
  hotkey: "Ctrl+Shift+A"
};
var DEFAULT_UI = { width: 900, height: 600 };
var ENUMS = {
  primaryAction: ["insert", "send", "copy"],
  buttonPosition: ["start", "end"],
  charLimit: ["auto", "2000", "4000"],
  importOnOpen: ["ask", "always", "never"],
  layout: ["side", "tabs", "editor"],
  tabSize: [0, 2, 4]
};
function validateSettings(raw) {
  const out = { ...DEFAULT_SETTINGS };
  if (!raw || typeof raw !== "object") return out;
  const src = raw;
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    const v = src[key];
    const allowed = ENUMS[key];
    const ok = allowed ? allowed.includes(v) : typeof v === typeof DEFAULT_SETTINGS[key];
    if (ok) out[key] = v;
  }
  return out;
}
function validStyle(s) {
  return s && (s.fg === null || isFgCode(s.fg)) && (s.bg === null || isBgCode(s.bg)) && typeof s.bold === "boolean" && typeof s.underline === "boolean";
}
function validatePresets(raw) {
  if (!Array.isArray(raw)) throw new Error("presets");
  return raw.filter((p) => p && typeof p.name === "string" && validStyle(p.style));
}
function validateStrings(raw) {
  if (!Array.isArray(raw)) throw new Error("strings");
  return raw.filter((s) => typeof s === "string");
}
function validateUi(raw) {
  const n = (v, d) => typeof v === "number" && v > 0 ? v : d;
  return { width: n(raw?.width, DEFAULT_UI.width), height: n(raw?.height, DEFAULT_UI.height) };
}
var warned = false;
function load(key, fallback, validate) {
  let raw;
  try {
    raw = BdApi.Data.load(PLUGIN, key);
  } catch {
    raw = void 0;
  }
  if (raw === void 0 || raw === null) return fallback;
  try {
    const env = raw;
    if (typeof env !== "object" || typeof env.version !== "number") throw new Error("envelope");
    return validate(env.data);
  } catch (e) {
    console.warn("[AnsiEditor] damaged data for", key, e);
    if (!warned) {
      warned = true;
      BdApi.UI.showToast(t("toast.dataReset"), { type: "warning" });
    }
    return fallback;
  }
}
function save(key, data) {
  try {
    BdApi.Data.save(PLUGIN, key, { version: VERSION, data });
  } catch (e) {
    console.error("[AnsiEditor] failed to save", key, e);
  }
}
var listeners = /* @__PURE__ */ new Set();
var settingsCache = null;
var storage = {
  getSettings() {
    settingsCache ??= load("settings", { ...DEFAULT_SETTINGS }, validateSettings);
    return settingsCache;
  },
  updateSettings(patch) {
    settingsCache = validateSettings({ ...storage.getSettings(), ...patch });
    save("settings", settingsCache);
    listeners.forEach((l) => l(settingsCache));
  },
  onSettingsChange(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getPresets: () => load("presets", [], validatePresets),
  setPresets: (p) => save("presets", p),
  getRecent: () => load("recent", [], validateStrings),
  addRecent(ansi) {
    if (!ansi) return;
    const list = [ansi, ...storage.getRecent().filter((s) => s !== ansi)].slice(0, 20);
    save("recent", list);
  },
  getDraft: () => load("draft", "", (raw) => typeof raw === "string" ? raw : ""),
  setDraft: (ansi) => save("draft", ansi),
  getUi: () => load("ui", { ...DEFAULT_UI }, validateUi),
  setUi: (ui) => save("ui", ui),
  resetAll() {
    for (const key of ["settings", "presets", "snippets", "recent", "draft", "ui"]) {
      try {
        BdApi.Data.delete(PLUGIN, key);
      } catch {
      }
    }
    settingsCache = null;
    listeners.forEach((l) => l(storage.getSettings()));
  },
  clearCache() {
    settingsCache = null;
    listeners.clear();
  }
};

// src/discord/modules.ts
var W = () => BdApi.Webpack;
var LOG = "[AnsiEditor]";
function sourceOf(m) {
  try {
    if (typeof m === "function") return Function.prototype.toString.call(m);
    if (m && typeof m === "object") {
      const inner = m.type ?? m.render;
      if (typeof inner === "function") return Function.prototype.toString.call(inner);
      if (inner?.render) return Function.prototype.toString.call(inner.render);
    }
  } catch {
  }
  return "";
}
var byKeys = (...keys) => (m) => !!m && keys.every((k) => k in Object(m));
var bySource = (...strings) => (m) => {
  const src = sourceOf(m);
  return !!src && strings.every((s) => src.includes(s));
};
function safeGet(name, fn) {
  try {
    return fn() ?? null;
  } catch (e) {
    console.warn(LOG, `lookup failed: ${name}`, e);
    return null;
  }
}
function store(name, ...fallbackKeys) {
  return safeGet(name, () => {
    const s = W().getStore?.(name);
    if (s) return s;
    return W().getModule(byKeys(...fallbackKeys), { searchExports: false });
  });
}
var textAreaButtonsFilter = bySource(".button", '"emoji"', "activeCommandOption");
function resolvePatchTarget(filter) {
  return safeGet("patch target", () => {
    const withKey = W().getWithKey?.(filter);
    if (withKey && withKey[0]) {
      const [owner, key2] = withKey;
      const exp2 = owner[key2];
      if (exp2 && typeof exp2 === "object" && typeof exp2.type === "function")
        return { owner: exp2, key: "type" };
      return { owner, key: key2 };
    }
    const mod = W().getModule((m) => m && Object.values(m).some((v) => filter(v)), {
      searchExports: false
    });
    if (!mod) return null;
    const key = Object.keys(mod).find((k) => filter(mod[k]));
    if (!key) return null;
    const exp = mod[key];
    if (exp && typeof exp === "object" && typeof exp.type === "function")
      return { owner: exp, key: "type" };
    return { owner: mod, key };
  });
}
async function waitForTarget(filter, timeoutMs) {
  const now = resolvePatchTarget(filter);
  if (now) return now;
  const ctrl = new AbortController();
  const timer = new Promise((r) => setTimeout(() => (ctrl.abort(), r(null)), timeoutMs));
  const found = W().waitForModule(filter, { searchExports: true, signal: ctrl.signal }).then(() => resolvePatchTarget(filter)).catch(() => null);
  return Promise.race([found, timer]);
}
var Modules = {
  get ComponentDispatch() {
    return safeGet(
      "ComponentDispatch",
      () => W().getModule((m) => m?.dispatchToLastSubscribed && m?.emitter, { searchExports: true })
    );
  },
  get MessageActions() {
    return safeGet(
      "MessageActions",
      () => W().getModule(byKeys("sendMessage", "editMessage"), { searchExports: false })
    );
  },
  get SelectedChannelStore() {
    return store("SelectedChannelStore", "getChannelId", "getVoiceChannelId");
  },
  get UserStore() {
    return store("UserStore", "getCurrentUser", "getUser");
  },
  get DraftStore() {
    return store("DraftStore", "getDraft", "getRecentlyEditedDrafts");
  },
  get PendingReplyStore() {
    return store("PendingReplyStore", "getPendingReply");
  }
};
function currentChannelId() {
  return safeGet("channel id", () => Modules.SelectedChannelStore?.getChannelId?.()) ?? null;
}
function currentUser() {
  return safeGet("current user", () => Modules.UserStore?.getCurrentUser?.());
}
function channelDraft(channelId) {
  if (!channelId) return "";
  return safeGet("draft", () => Modules.DraftStore?.getDraft?.(channelId, 0)) ?? "";
}
function hasPendingReply(channelId) {
  if (!channelId) return false;
  return !!safeGet("pending reply", () => Modules.PendingReplyStore?.getPendingReply?.(channelId));
}

// src/ui/icons.tsx
var svg = (size, children) => /* @__PURE__ */ BdApi.React.createElement(
  "svg",
  {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  },
  children
);
var AnsiIcon = ({ size = 24 }) => /* @__PURE__ */ BdApi.React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": "true" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "currentColor",
    d: "M4 3h3v2H5v14h2v2H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm16 0h-3v2h2v14h-2v2h3a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z"
  }
), /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "currentColor",
    d: "M11.1 6h1.8l4 11h-2.1l-.9-2.6H10l-.9 2.6H7.1l4-11Zm-.5 6.6h2.8L12 8.6l-1.4 4Z"
  }
));
var BoldIcon = () => svg(20, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" }));
var UnderlineIcon = () => svg(20, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M7 4v6a5 5 0 0 0 10 0V4M5 20h14" }));
var ResetIcon = () => svg(20, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M4 7h11M9 7v12M14 13l6 6M20 13l-6 6" }));
var TrashIcon = () => svg(20, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" }));
var UndoIcon = () => svg(20, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" }));
var RedoIcon = () => svg(20, /* @__PURE__ */ BdApi.React.createElement("path", { d: "m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" }));
var SparkIcon = () => svg(
  20,
  /* @__PURE__ */ BdApi.React.createElement("path", { d: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" })
);
var StarIcon = () => svg(20, /* @__PURE__ */ BdApi.React.createElement("path", { d: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" }));
var FileIcon = () => svg(20, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M6 3h8l4 4v14H6zM14 3v4h4" }));
var ClipboardIcon = () => svg(20, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M9 4h6v3H9zM9 5H6v16h12V5h-3" }));
var CloseIcon = () => svg(24, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M6 6l12 12M18 6 6 18" }));
var ChevronIcon = () => svg(16, /* @__PURE__ */ BdApi.React.createElement("path", { d: "m6 9 6 6 6-6" }));
var InfoIcon = () => svg(16, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01" }));

// src/ui/Tooltip.tsx
var { useEffect, useRef, useState } = BdApi.React;
var SHOW_DELAY_MS = 150;
var GAP = 8;
function Tip({ text, native, children }) {
  const Native = BdApi.Components?.Tooltip;
  if (native && Native) return /* @__PURE__ */ BdApi.React.createElement(Native, { text }, (p) => children(p));
  return /* @__PURE__ */ BdApi.React.createElement(OwnTip, { text }, children);
}
function OwnTip({ text, children }) {
  const [pos, setPos] = useState(null);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const place = (el) => {
    const r = el.getBoundingClientRect();
    const below = r.top < 60;
    setPos({ left: r.left + r.width / 2, top: below ? r.bottom + GAP : r.top - GAP, below });
  };
  const show = (e, delay = SHOW_DELAY_MS) => {
    const el = e.currentTarget;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => place(el), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setPos(null);
  };
  const host = document.querySelector(".ansiEditor-host") ?? document.body;
  return /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, children({
    "aria-description": text,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: (e) => show(e, 0),
    onBlur: hide,
    onClickCapture: (e) => !pos && show(e, 0)
  }), pos && BdApi.ReactDOM.createPortal(
    /* @__PURE__ */ BdApi.React.createElement(
      "div",
      {
        role: "tooltip",
        className: `ansiEditor-tooltip ${pos.below ? "ansiEditor-tooltipBelow" : ""}`,
        style: { left: pos.left, top: pos.top }
      },
      text
    ),
    host
  ));
}

// src/discord/textareaButton.tsx
var PLUGIN2 = "AnsiEditor";
var LOG2 = "[AnsiEditor]";
var ATTR = "data-ansi-editor";
var STRATEGY_A_TIMEOUT = 5e3;
var { useLayoutEffect, useRef: useRef2, useState: useState2 } = BdApi.React;
function neighbourClasses(me) {
  let parent = me.parentElement;
  if (parent?.hasAttribute(ATTR)) parent = parent.parentElement;
  if (!parent) return {};
  const sib = Array.from(parent.children).find(
    (c) => !c.hasAttribute(ATTR) && c.querySelector("button svg")
  );
  const btn = sib?.querySelector("button");
  const inner = btn?.firstElementChild;
  const cls = (el) => el instanceof HTMLElement && el.className ? el.className : void 0;
  return { wrap: cls(sib), button: cls(btn), inner: cls(inner) };
}
function AnsiButton({ onClick }) {
  const ref = useRef2(null);
  const [cls, setCls] = useState2({});
  useLayoutEffect(() => {
    if (ref.current) setCls(neighbourClasses(ref.current));
  }, []);
  return /* @__PURE__ */ BdApi.React.createElement("div", { ref, ...{ [ATTR]: "" }, className: cls.wrap ?? "ansiEditor-tbWrap" }, /* @__PURE__ */ BdApi.React.createElement(Tip, { native: true, text: t("button.tooltip") }, (tipProps) => /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      ...tipProps,
      type: "button",
      "aria-label": t("button.tooltip"),
      className: `${cls.button ?? ""} ansiEditor-tbButton`,
      onClick
    },
    /* @__PURE__ */ BdApi.React.createElement("div", { className: cls.inner ?? "ansiEditor-tbInner" }, /* @__PURE__ */ BdApi.React.createElement(AnsiIcon, { size: 20 }))
  )));
}
function typeName(props) {
  const type = props?.type;
  if (typeof type === "string") return type.toLowerCase();
  const name = type?.analyticsName ?? type?.name;
  return typeof name === "string" ? name.toLowerCase() : void 0;
}
var HIDDEN_TYPES = ["profile_bio_input", "create_forum_post", "forum_channel_guidelines"];
function shouldShow(props) {
  if (props?.disabled) return false;
  const name = typeName(props);
  if (!name) return true;
  if (name === "edit") return storage.getSettings().editButton;
  return !HIDDEN_TYPES.includes(name);
}
var TextAreaButton = class {
  constructor(onClick) {
    this.onClick = onClick;
  }
  onClick;
  observer = null;
  roots = /* @__PURE__ */ new Map();
  timer = null;
  stopped = false;
  frame = 0;
  async start() {
    this.stopped = false;
    const target = resolvePatchTarget(textAreaButtonsFilter) ?? await waitForTarget(textAreaButtonsFilter, STRATEGY_A_TIMEOUT);
    if (this.stopped) return;
    if (target) {
      this.patch(target.owner, target.key);
      this.timer = setTimeout(() => {
        const boxes = document.querySelectorAll('[class*="channelTextArea"] [class*="buttons"]');
        if (boxes.length && !document.querySelector(`[${ATTR}]`))
          this.fallback("patch rendered nothing");
      }, STRATEGY_A_TIMEOUT);
    } else {
      this.fallback("module not found");
    }
  }
  stop() {
    this.stopped = true;
    BdApi.Patcher.unpatchAll(PLUGIN2);
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
  patch(owner, key) {
    BdApi.Patcher.after(PLUGIN2, owner, key, (_this, [props], ret) => {
      try {
        if (!shouldShow(props)) return;
        const children = ret?.props?.children;
        if (!Array.isArray(children) || children.some((c) => c?.key === "ansi-editor")) return;
        const el = /* @__PURE__ */ BdApi.React.createElement(AnsiButton, { key: "ansi-editor", onClick: this.onClick });
        if (storage.getSettings().buttonPosition === "end") children.push(el);
        else children.unshift(el);
      } catch (e) {
        console.error(LOG2, "button patch failed", e);
      }
    });
  }
  /** Strategy B: watch the DOM and mount the button into every buttons row. */
  fallback(reason) {
    if (this.observer || this.stopped) return;
    console.warn(LOG2, `falling back to DOM strategy: ${reason}`);
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
      subtree: true
    });
    scan();
  }
  mountAll() {
    for (const [el, root] of this.roots) {
      if (!el.isConnected) {
        root.unmount();
        this.roots.delete(el);
      }
    }
    const rows = document.querySelectorAll(
      '[class*="channelTextArea"] [class*="buttons"]'
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
      root.render(/* @__PURE__ */ BdApi.React.createElement(AnsiButton, { onClick: this.onClick }));
      this.roots.set(host, root);
    });
  }
};

// src/core/graphemes.ts
var segmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function graphemeBoundaries(text) {
  const out = [];
  if (segmenter) {
    for (const seg of segmenter.segment(text)) out.push(seg.index);
  } else {
    let i = 0;
    for (const ch of text) {
      out.push(i);
      i += ch.length;
    }
  }
  out.push(text.length);
  return out;
}
function floorBoundary(bounds, offset) {
  let best = 0;
  for (const b of bounds) {
    if (b > offset) break;
    best = b;
  }
  return best;
}
function ceilBoundary(bounds, offset) {
  for (const b of bounds) if (b >= offset) return b;
  return bounds[bounds.length - 1] ?? 0;
}

// src/core/model.ts
var DEFAULT_STYLE = Object.freeze({
  fg: null,
  bg: null,
  bold: false,
  underline: false
});
function styleEquals(a, b) {
  return a.fg === b.fg && a.bg === b.bg && a.bold === b.bold && a.underline === b.underline;
}
function normalize(doc) {
  const out = [];
  for (const run of doc) {
    if (!run.text) continue;
    const last = out[out.length - 1];
    if (last && styleEquals(last.style, run.style)) {
      out[out.length - 1] = { text: last.text + run.text, style: last.style };
    } else {
      out.push({ text: run.text, style: { ...run.style } });
    }
  }
  return out;
}
function plainText(doc) {
  return doc.map((r) => r.text).join("");
}
function docLength(doc) {
  let n = 0;
  for (const r of doc) n += r.text.length;
  return n;
}
function snapRange(doc, start, end) {
  const text = plainText(doc);
  const lo = Math.max(0, Math.min(start, end, text.length));
  const hi = Math.min(text.length, Math.max(start, end, 0));
  const bounds = graphemeBoundaries(text);
  return { start: floorBoundary(bounds, lo), end: ceilBoundary(bounds, hi) };
}
function rawSlice(doc, start, end) {
  const out = [];
  let pos = 0;
  for (const run of doc) {
    const rs = pos;
    const re = pos + run.text.length;
    pos = re;
    if (re <= start || rs >= end) continue;
    const text = run.text.slice(Math.max(0, start - rs), Math.min(run.text.length, end - rs));
    if (text) out.push({ text, style: run.style });
  }
  return out;
}
function sliceDoc(doc, start, end) {
  const r = snapRange(doc, start, end);
  return normalize(rawSlice(doc, r.start, r.end));
}
function deleteRange(doc, start, end) {
  const r = snapRange(doc, start, end);
  return normalize([...rawSlice(doc, 0, r.start), ...rawSlice(doc, r.end, docLength(doc))]);
}
function replaceRange(doc, start, end, other) {
  const r = snapRange(doc, start, end);
  return normalize([
    ...rawSlice(doc, 0, r.start),
    ...other,
    ...rawSlice(doc, r.end, docLength(doc))
  ]);
}
function mapStyle(doc, start, end, fn) {
  const r = snapRange(doc, start, end);
  const mid = rawSlice(doc, r.start, r.end).map((run) => ({
    text: run.text,
    style: fn(run.style)
  }));
  return normalize([...rawSlice(doc, 0, r.start), ...mid, ...rawSlice(doc, r.end, docLength(doc))]);
}
function applyStyle(doc, start, end, patch) {
  return mapStyle(doc, start, end, (s) => ({ ...s, ...patch }));
}
function toggle(doc, start, end, attr) {
  const r = snapRange(doc, start, end);
  const slice = rawSlice(doc, r.start, r.end);
  const all = slice.length > 0 && slice.every((run) => run.style[attr]);
  return applyStyle(doc, r.start, r.end, { [attr]: !all });
}
function clearStyle(doc, start, end) {
  return mapStyle(doc, start, end, () => ({ ...DEFAULT_STYLE }));
}
function styleAt(doc, offset) {
  if (!doc.length) return { ...DEFAULT_STYLE };
  let pos = 0;
  for (const run of doc) {
    const end = pos + run.text.length;
    if (offset > pos && offset <= end) return { ...run.style };
    pos = end;
  }
  return { ...offset <= 0 ? doc[0].style : doc[doc.length - 1].style };
}
function rangeStyle(doc, start, end) {
  const slice = rawSlice(doc, Math.min(start, end), Math.max(start, end));
  if (!slice.length) {
    const s = styleAt(doc, start);
    return { ...s };
  }
  const first = slice[0].style;
  const res = { ...first };
  for (const run of slice) {
    if (run.style.fg !== first.fg) res.fg = "mixed";
    if (run.style.bg !== first.bg) res.bg = "mixed";
    if (run.style.bold !== first.bold) res.bold = "mixed";
    if (run.style.underline !== first.underline) res.underline = "mixed";
  }
  return res;
}
function findStyleRanges(doc, pred) {
  const out = [];
  let pos = 0;
  for (const run of doc) {
    const end = pos + run.text.length;
    if (pred(run.style)) {
      const last = out[out.length - 1];
      if (last && last.end === pos) last.end = end;
      else out.push({ start: pos, end });
    }
    pos = end;
  }
  return out;
}
function optimizeDoc(doc) {
  const out = [];
  for (const run of doc) {
    const prev = out[out.length - 1];
    const invisible = /^\s+$/.test(run.text) && run.style.bg === null && !run.style.underline;
    if (prev && invisible) {
      out.push({ text: run.text, style: { ...prev.style, bg: null, underline: false } });
    } else {
      out.push(run);
    }
  }
  return normalize(out);
}

// src/core/parser.ts
var ESC = "\x1B";
var ZWSP = String.fromCharCode(8203);
var OWN_ESCAPE_RE = new RegExp("`" + ZWSP + "(?=`)", "g");
var BLOCK_RE = /```ansi[ \t]*\n?([\s\S]*?)```/gi;
function extractAnsiBlocks(message) {
  const out = [];
  for (const m of message.matchAll(BLOCK_RE)) {
    const start = m.index ?? 0;
    out.push({ start, end: start + m[0].length, content: trimFenceNewline(m[1]) });
  }
  return out;
}
function trimFenceNewline(s) {
  return s.endsWith("\n") ? s.slice(0, -1) : s;
}
function hasAnsi(text, literalEscapes = false) {
  if (text.includes(ESC) || /```ansi/i.test(text)) return true;
  return literalEscapes && LITERAL_RE.test(text);
}
var LITERAL_RE = /\\(?:u001b|x1b|e|033)(?=\[)/gi;
var SEQ_RE = /\u001b(?:\[([0-?]*)[ -/]*([@-~]))?/g;
function applySgr(style, params) {
  const codes = params === "" ? [0] : params.split(/[;:]/).map((p) => p === "" ? 0 : Number(p));
  let unsupported = 0;
  for (let i = 0; i < codes.length; i++) {
    const c = codes[i];
    if (c === 0) Object.assign(style, DEFAULT_STYLE);
    else if (c === 1) style.bold = true;
    else if (c === 4) style.underline = true;
    else if (c === 22) style.bold = false;
    else if (c === 24) style.underline = false;
    else if (c === 39) style.fg = null;
    else if (c === 49) style.bg = null;
    else if (isFgCode(c)) style.fg = c;
    else if (isBgCode(c)) style.bg = c;
    else {
      unsupported++;
      if ((c === 38 || c === 48 || c === 58) && codes[i + 1] === 5) i += 2;
      else if ((c === 38 || c === 48 || c === 58) && codes[i + 1] === 2) i += 4;
    }
  }
  return unsupported;
}
function parseAnsi(input, options = {}) {
  let text = input.replace(/\r\n?/g, "\n");
  if (options.literalEscapes) text = text.replace(LITERAL_RE, ESC);
  text = text.replace(OWN_ESCAPE_RE, "`");
  const warnings = { unsupportedCodes: 0, strippedSequences: 0 };
  const doc = [];
  const style = { ...DEFAULT_STYLE };
  let last = 0;
  for (const m of text.matchAll(SEQ_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) doc.push({ text: text.slice(last, idx), style: { ...style } });
    last = idx + m[0].length;
    if (m[2] === "m") warnings.unsupportedCodes += applySgr(style, m[1] ?? "");
    else warnings.strippedSequences++;
  }
  if (last < text.length) doc.push({ text: text.slice(last), style: { ...style } });
  return { doc: normalize(doc), warnings };
}
function parseMessage(message, blockIndex = 0, options = {}) {
  const blocks = extractAnsiBlocks(message);
  const block = blocks[blockIndex];
  return { ...parseAnsi(block ? block.content : message, options), block, blocks };
}

// src/discord/insert.ts
var LOG3 = "[AnsiEditor]";
async function copyText(text) {
  try {
    if (typeof DiscordNative !== "undefined" && DiscordNative?.clipboard?.copy) {
      DiscordNative.clipboard.copy(text);
      return true;
    }
  } catch {
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error(LOG3, "clipboard failed", e);
    return false;
  }
}
async function readClipboard() {
  try {
    return await navigator.clipboard.readText();
  } catch {
    return "";
  }
}
async function fallbackCopy(text) {
  const ok = await copyText(text);
  BdApi.UI.showToast(ok ? t("toast.copiedPaste") : t("toast.noModules"), {
    type: ok ? "info" : "error"
  });
}
async function insertIntoTextArea(text) {
  const cd = Modules.ComponentDispatch;
  if (cd?.dispatchToLastSubscribed) {
    try {
      cd.dispatchToLastSubscribed("INSERT_TEXT", { plainText: text, rawText: text });
      return;
    } catch (e) {
      console.warn(LOG3, "INSERT_TEXT failed", e);
    }
  }
  await fallbackCopy(text);
}
async function sendMessage(text, channelId = currentChannelId()) {
  const actions = Modules.MessageActions;
  if (actions?.sendMessage && channelId) {
    try {
      await actions.sendMessage(
        channelId,
        { content: text, tts: false, invalidEmojis: [], validNonShortcutEmojis: [] },
        void 0,
        {}
      );
      return true;
    } catch (e) {
      console.warn(LOG3, "sendMessage failed", e);
    }
  }
  await insertIntoTextArea(text);
  return false;
}
async function editMessage(channelId, messageId, content) {
  const actions = Modules.MessageActions;
  if (actions?.editMessage) {
    try {
      await actions.editMessage(channelId, messageId, { content });
      return true;
    } catch (e) {
      console.warn(LOG3, "editMessage failed", e);
    }
  }
  await fallbackCopy(content);
  return false;
}

// src/discord/contextMenu.ts
async function copy(text) {
  const ok = await copyText(text);
  BdApi.UI.showToast(ok ? t("toast.copied") : t("toast.noModules"), {
    type: ok ? "success" : "error"
  });
}
function perBlock(label, blocks, action) {
  if (blocks.length === 1) return { label, action: () => action(blocks[0]) };
  return {
    type: "submenu",
    label,
    items: blocks.map((b, i) => ({
      label: t("menu.block", { n: i + 1 }),
      action: () => action(b)
    }))
  };
}
function patchMessageContextMenu(handlers) {
  return BdApi.ContextMenu.patch("message", (tree, props) => {
    try {
      if (!storage.getSettings().contextMenu) return;
      const message = props?.message;
      const content = message?.content ?? "";
      const blocks = extractAnsiBlocks(content);
      if (!blocks.length) return;
      const own = !!message?.author?.id && message.author.id === currentUser()?.id;
      const items2 = [
        perBlock(t("menu.open"), blocks, (b) => handlers.open(b.content))
      ];
      if (own) {
        items2.push(
          perBlock(
            t("menu.edit"),
            blocks,
            (block) => handlers.edit({ channelId: message.channel_id, messageId: message.id, content, block })
          )
        );
      }
      items2.push(
        perBlock(t("menu.copyAnsi"), blocks, (b) => copy(content.slice(b.start, b.end))),
        perBlock(
          t("menu.copyPlain"),
          blocks,
          (b) => copy(plainText(parseAnsi(b.content, { literalEscapes: false }).doc))
        )
      );
      const submenu = BdApi.ContextMenu.buildItem({
        type: "submenu",
        id: "ansi-editor",
        label: t("menu.ansi"),
        items: items2
      });
      const children = tree?.props?.children;
      if (Array.isArray(children))
        children.push(BdApi.ContextMenu.buildItem({ type: "separator" }), submenu);
    } catch (e) {
      console.error("[AnsiEditor] context menu patch failed", e);
    }
  });
}

// src/core/serializer.ts
var DEFAULT_SERIALIZE_OPTIONS = Object.freeze({
  wrap: true,
  trailingReset: true,
  escapeBackticks: true,
  tabSize: 4,
  aggressive: true
});
var FENCE_OPEN = "```ansi\n";
var FENCE_CLOSE = "\n```";
function fullCodes(s) {
  const c = [];
  if (s.bold) c.push(1);
  if (s.underline) c.push(4);
  if (s.fg !== null) c.push(s.fg);
  if (s.bg !== null) c.push(s.bg);
  return c;
}
function transition(cur, next) {
  if (styleEquals(cur, next)) return "";
  const needsReset = cur.bold && !next.bold || cur.underline && !next.underline || cur.fg !== null && next.fg === null || cur.bg !== null && next.bg === null;
  let codes;
  if (needsReset) {
    codes = [0, ...fullCodes(next)];
  } else {
    codes = [];
    if (next.bold && !cur.bold) codes.push(1);
    if (next.underline && !cur.underline) codes.push(4);
    if (next.fg !== cur.fg && next.fg !== null) codes.push(next.fg);
    if (next.bg !== cur.bg && next.bg !== null) codes.push(next.bg);
  }
  return `${ESC}[${codes.join(";")}m`;
}
function escapeTripleBackticks(text) {
  return text.replace(/```/g, `\`${ZWSP}\`${ZWSP}\``);
}
function transformText(text, opts) {
  let t2 = text;
  if (opts.tabSize > 0) t2 = t2.replace(/\t/g, " ".repeat(opts.tabSize));
  return t2;
}
function serializeParts(doc, options = {}) {
  const opts = { ...DEFAULT_SERIALIZE_OPTIONS, ...options };
  let cur = { ...DEFAULT_STYLE };
  const pieces = [];
  for (const run of doc) {
    let target = run.style;
    const invisible = /^\s+$/.test(run.text) && target.bg === null && !target.underline;
    if (opts.aggressive && invisible) {
      target = { ...target, fg: cur.fg, bold: cur.bold };
      if (transition(cur, target).startsWith(`${ESC}[0`)) target = run.style;
    }
    const seq = transition(cur, target);
    if (seq) pieces.push({ text: seq, esc: true });
    pieces.push({ text: transformText(run.text, opts), esc: false });
    cur = target;
  }
  if (opts.trailingReset && !styleEquals(cur, DEFAULT_STYLE)) {
    pieces.push({ text: `${ESC}[0m`, esc: true });
  }
  let body = "";
  let escapeChars = 0;
  let textBuf = "";
  const flush = () => {
    body += opts.escapeBackticks ? escapeTripleBackticks(textBuf) : textBuf;
    textBuf = "";
  };
  for (const p of pieces) {
    if (p.esc) {
      flush();
      body += p.text;
      escapeChars += p.text.length;
    } else {
      textBuf += p.text;
    }
  }
  flush();
  const output = opts.wrap ? FENCE_OPEN + body + FENCE_CLOSE : body;
  const wrapChars = opts.wrap ? FENCE_OPEN.length + FENCE_CLOSE.length : 0;
  return { output, escapeChars, wrapChars, textChars: body.length - escapeChars };
}
function serialize(doc, options = {}) {
  return serializeParts(doc, options).output;
}

// src/core/limits.ts
var BASE_LIMIT = 2e3;
var NITRO_LIMIT = 4e3;
function messageLimit(setting, premiumType) {
  if (setting === "2000") return BASE_LIMIT;
  if (setting === "4000") return NITRO_LIMIT;
  return premiumType === 1 || premiumType === 2 ? NITRO_LIMIT : BASE_LIMIT;
}
function limitLevel(total, limit) {
  if (total > limit) return "error";
  if (total >= limit * 0.9) return "warning";
  return "ok";
}
function lengthInfo(doc, options, limit) {
  const parts = serializeParts(doc, options);
  const total = parts.output.length;
  return { ...parts, total, limit, level: limitLevel(total, limit) };
}
function hasTripleBackticks(text) {
  return text.includes("```");
}
function optimizeWithSavings(doc, options) {
  const before = serializeParts(doc, options).output.length;
  const optimized = optimizeDoc(doc);
  const after = serializeParts(optimized, { ...options, aggressive: true }).output.length;
  return { doc: optimized, saved: Math.max(0, before - after) };
}

// src/core/history.ts
var HISTORY_LIMIT = 100;
var COALESCE_GAP_MS = 1e3;
function createHistory(present) {
  return { past: [], present, future: [], group: null, time: 0 };
}
function push(h, value, meta = {}) {
  const now = meta.now ?? Date.now();
  const group = meta.group ?? null;
  const merge = group !== null && h.group === group && now - h.time <= COALESCE_GAP_MS;
  const nextGroup = meta.breakAfter ? null : group;
  if (merge) return { ...h, present: value, future: [], group: nextGroup, time: now };
  const past = [...h.past, h.present];
  if (past.length > HISTORY_LIMIT) past.splice(0, past.length - HISTORY_LIMIT);
  return { past, present: value, future: [], group: nextGroup, time: now };
}
function canUndo(h) {
  return h.past.length > 0;
}
function canRedo(h) {
  return h.future.length > 0;
}
function undo(h) {
  if (!h.past.length) return h;
  const past = h.past.slice(0, -1);
  return {
    past,
    present: h.past[h.past.length - 1],
    future: [h.present, ...h.future],
    group: null,
    time: 0
  };
}
function redo(h) {
  if (!h.future.length) return h;
  const [next, ...future] = h.future;
  return { past: [...h.past, h.present], present: next, future, group: null, time: 0 };
}

// src/ui/editorState.ts
function initEditorState(doc) {
  const end = docLength(doc);
  const sel = { start: end, end };
  return { history: createHistory({ doc, sel }), sel, pending: null, multi: null, dirty: false };
}
var sameRange = (a, b) => a.start === b.start && a.end === b.end;
function editorReducer(state, action) {
  switch (action.type) {
    case "select":
      if (sameRange(state.sel, action.sel)) return state;
      return { ...state, sel: action.sel, pending: null, multi: null };
    case "edit": {
      const history = push(
        state.history,
        { doc: action.doc, sel: action.sel },
        { group: action.group ?? null, breakAfter: action.breakAfter }
      );
      return {
        ...state,
        history,
        sel: action.sel,
        pending: null,
        multi: action.keepMulti ? state.multi : null,
        dirty: true
      };
    }
    case "pending":
      return { ...state, pending: action.style };
    case "multi":
      return { ...state, multi: action.ranges };
    case "undo":
    case "redo": {
      const history = action.type === "undo" ? undo(state.history) : redo(state.history);
      if (history === state.history) return state;
      return {
        ...state,
        history,
        sel: history.present.sel,
        pending: null,
        multi: null,
        dirty: true
      };
    }
    case "clean":
      return { ...state, dirty: false };
  }
}

// src/ui/useEditor.ts
var { useCallback, useMemo, useReducer } = BdApi.React;
var ordered = (r) => ({
  start: Math.min(r.start, r.end),
  end: Math.max(r.start, r.end)
});
function useEditor(initialDoc2) {
  const [state, dispatch] = useReducer(editorReducer, initialDoc2, initEditorState);
  const doc = state.history.present.doc;
  const sel = ordered(state.sel);
  const collapsed = sel.start === sel.end;
  const typingStyle = state.pending ?? styleAt(doc, sel.start);
  const targets = state.multi ?? (collapsed ? null : [sel]);
  const edit = useCallback(
    (next, nextSel, meta = {}) => dispatch({ type: "edit", doc: next, sel: nextSel, ...meta }),
    []
  );
  const mapTargets = (fn) => {
    if (!targets) return;
    const next = targets.reduce(fn, doc);
    edit(next, state.sel, { keepMulti: !!state.multi });
  };
  const patchStyle = (patch) => {
    if (targets) mapTargets((d, r) => applyStyle(d, r.start, r.end, patch));
    else dispatch({ type: "pending", style: { ...typingStyle, ...patch } });
  };
  const toggleAttr = (attr) => {
    if (!targets) {
      dispatch({ type: "pending", style: { ...typingStyle, [attr]: !typingStyle[attr] } });
    } else if (targets.length === 1) {
      mapTargets((d, r) => toggle(d, r.start, r.end, attr));
    } else {
      const all = targets.every((r) => rangeStyle(doc, r.start, r.end)[attr] === true);
      mapTargets((d, r) => applyStyle(d, r.start, r.end, { [attr]: !all }));
    }
  };
  const resetStyle = () => {
    if (targets) mapTargets((d, r) => clearStyle(d, r.start, r.end));
    else dispatch({ type: "pending", style: { ...DEFAULT_STYLE } });
  };
  const selectSameColor = (layer, code) => {
    const ranges = findStyleRanges(doc, (s) => s[layer] === code);
    if (!ranges.length) return;
    if (ranges.length === 1) dispatch({ type: "select", sel: ranges[0] });
    else dispatch({ type: "multi", ranges });
  };
  const pickColor = (layer, code, alt) => {
    if (alt) selectSameColor(layer, code);
    else patchStyle({ [layer]: code });
  };
  const indicator = useMemo(() => {
    if (!targets) return { ...typingStyle };
    if (targets.length === 1) return rangeStyle(doc, targets[0].start, targets[0].end);
    const parts = targets.map((r) => rangeStyle(doc, r.start, r.end));
    const merge = (k) => parts.every((p) => p[k] === parts[0][k]) ? parts[0][k] : "mixed";
    return { fg: merge("fg"), bg: merge("bg"), bold: merge("bold"), underline: merge("underline") };
  }, [doc, targets, typingStyle]);
  const present = useMemo(() => {
    const fg = /* @__PURE__ */ new Set();
    const bg = /* @__PURE__ */ new Set();
    let pos = 0;
    for (const run of doc) {
      const end = pos + run.text.length;
      if (targets?.some((r) => r.start < end && r.end > pos)) {
        fg.add(run.style.fg);
        bg.add(run.style.bg);
      }
      pos = end;
    }
    return { fg, bg };
  }, [doc, targets]);
  const replaceAll = (next) => {
    const end = docLength(next);
    edit(next, { start: end, end });
  };
  return {
    state,
    dispatch,
    doc,
    sel,
    typingStyle,
    indicator,
    present,
    canUndo: canUndo(state.history),
    canRedo: canRedo(state.history),
    edit,
    replaceAll,
    patchStyle,
    toggleAttr,
    resetStyle,
    pickColor
  };
}

// src/ui/selection.ts
function offsetOf(root, node, offset) {
  const r = document.createRange();
  r.setStart(root, 0);
  try {
    r.setEnd(node, offset);
  } catch {
    return 0;
  }
  return r.toString().length;
}
function getSelectionOffsets(root) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return null;
  const range = sel.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null;
  return {
    start: offsetOf(root, range.startContainer, range.startOffset),
    end: offsetOf(root, range.endContainer, range.endOffset)
  };
}
function rangeOffsets(root, r) {
  if (!root.contains(r.startContainer) || !root.contains(r.endContainer)) return null;
  return {
    start: offsetOf(root, r.startContainer, r.startOffset),
    end: offsetOf(root, r.endContainer, r.endOffset)
  };
}
function positionAt(root, offset) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let acc = 0;
  let last = null;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const len = n.data.length;
    if (offset <= acc + len) return [n, offset - acc];
    acc += len;
    last = n;
  }
  if (last) return [last, last.data.length];
  return [root, 0];
}
function setSelectionOffsets(root, start, end) {
  const sel = window.getSelection();
  if (!sel) return;
  const [sn, so] = positionAt(root, start);
  const [en2, eo] = start === end ? [sn, so] : positionAt(root, end);
  const cur = getSelectionOffsets(root);
  if (cur && cur.start === start && cur.end === end) return;
  sel.setBaseAndExtent(sn, so, en2, eo);
}

// src/ui/render.ts
function styleClasses(s) {
  const c = [];
  if (s.fg !== null) c.push(`ansiEditor-fg-${s.fg}`);
  if (s.bg !== null) c.push(`ansiEditor-bg-${s.bg}`);
  if (s.bold) c.push("ansiEditor-b");
  if (s.underline) c.push("ansiEditor-u");
  return c.join(" ");
}
function segments(doc, marks) {
  if (!marks?.length) return doc.map((r) => ({ text: r.text, style: r.style, marked: false }));
  const cuts = /* @__PURE__ */ new Set();
  for (const m of marks) cuts.add(m.start).add(m.end);
  const inMark = (pos2) => marks.some((m) => pos2 >= m.start && pos2 < m.end);
  const out = [];
  let pos = 0;
  for (const run of doc) {
    let from = 0;
    for (let i = 1; i <= run.text.length; i++) {
      if (i === run.text.length || cuts.has(pos + i)) {
        out.push({ text: run.text.slice(from, i), style: run.style, marked: inMark(pos + from) });
        from = i;
      }
    }
    pos += run.text.length;
  }
  return out;
}
function renderInto(root, doc, marks) {
  const frag = document.createDocumentFragment();
  for (const seg of segments(doc, marks)) {
    const span = document.createElement("span");
    span.className = styleClasses(seg.style) + (seg.marked ? " ansiEditor-marked" : "");
    span.textContent = seg.text;
    frag.appendChild(span);
  }
  const br = document.createElement("br");
  br.setAttribute("data-sentinel", "");
  frag.appendChild(br);
  root.replaceChildren(frag);
}

// src/ui/RichEditor.tsx
var { useEffect: useEffect2, useLayoutEffect: useLayoutEffect2, useRef: useRef3, useState: useState3 } = BdApi.React;
function pastedDoc(text, style, literalEscapes) {
  if (hasAnsi(text, literalEscapes)) return parseMessage(text, 0, { literalEscapes }).doc;
  return [{ text, style }];
}
function RichEditor(props) {
  const ref = props.editorRef;
  const latest = useRef3(props);
  latest.current = props;
  const composing = useRef3(null);
  const [renderTick, setRenderTick] = useState3(0);
  useLayoutEffect2(() => {
    const root = ref.current;
    if (!root || composing.current) return;
    renderInto(root, props.doc, props.multi);
    root.toggleAttribute("data-empty", docLength(props.doc) === 0);
    if (document.activeElement === root) setSelectionOffsets(root, props.sel.start, props.sel.end);
  }, [props.doc, props.multi, renderTick]);
  useLayoutEffect2(() => {
    const root = ref.current;
    if (root && document.activeElement === root && !composing.current) {
      setSelectionOffsets(root, props.sel.start, props.sel.end);
    }
  }, [props.sel.start, props.sel.end]);
  useEffect2(() => {
    const root = ref.current;
    if (!root) return;
    const currentSel = () => getSelectionOffsets(root) ?? latest.current.sel;
    const typingStyle = (at) => latest.current.pending ?? styleAt(latest.current.doc, at);
    const insert = (content, range, meta) => {
      const { doc, onEdit } = latest.current;
      const snapped = snapRange(doc, range.start, range.end);
      const next = replaceRange(doc, snapped.start, snapped.end, content);
      const caret = docLength(next) - (docLength(doc) - snapped.end);
      onEdit(next, { start: caret, end: caret }, meta);
    };
    const insertText = (text, meta = {}) => {
      const range = currentSel();
      const style = typingStyle(Math.min(range.start, range.end));
      insert([{ text, style }], range, meta);
    };
    const remove = (range) => {
      const { doc, onEdit } = latest.current;
      const lo = Math.min(range.start, range.end);
      const hi = Math.max(range.start, range.end);
      if (lo === hi) return;
      onEdit(deleteRange(doc, lo, hi), { start: lo, end: lo }, { group: "delete" });
    };
    const fallbackDeleteRange = (sel, forward) => {
      if (sel.start !== sel.end) return sel;
      const text = latest.current.doc.map((r) => r.text).join("");
      const b = graphemeBoundaries(text);
      if (forward) return { start: sel.start, end: b.find((x) => x > sel.start) ?? sel.start };
      return { start: [...b].reverse().find((x) => x < sel.start) ?? 0, end: sel.start };
    };
    const onBeforeInput = (e) => {
      if (e.isComposing || e.inputType === "insertCompositionText") return;
      e.preventDefault();
      const type = e.inputType;
      if (type === "insertText" || type === "insertReplacementText") {
        const text = e.data ?? e.dataTransfer?.getData("text/plain") ?? "";
        if (text) insertText(text, { group: "type", breakAfter: /\s/.test(text) });
      } else if (type === "insertLineBreak" || type === "insertParagraph") {
        insertText("\n", { group: "type", breakAfter: true });
      } else if (type.startsWith("delete")) {
        const targets = e.getTargetRanges?.() ?? [];
        const r = targets.length ? rangeOffsets(root, targets[0]) : null;
        remove(r ?? fallbackDeleteRange(currentSel(), type.endsWith("Forward")));
      } else if (type === "historyUndo") {
        latest.current.onUndo();
      } else if (type === "historyRedo") {
        latest.current.onRedo();
      }
    };
    const onPaste = (e) => {
      e.preventDefault();
      const text = e.clipboardData?.getData("text/plain") ?? "";
      if (!text) return;
      const range = currentSel();
      const style = typingStyle(Math.min(range.start, range.end));
      insert(pastedDoc(text, style, latest.current.literalEscapes), range, {});
    };
    const onDrop = (e) => {
      e.preventDefault();
      const text = e.dataTransfer?.getData("text/plain") ?? "";
      if (!text) return;
      const range = currentSel();
      insert(pastedDoc(text, typingStyle(range.start), latest.current.literalEscapes), range, {});
    };
    const onCompositionStart = () => {
      composing.current = currentSel();
    };
    const onCompositionEnd = (e) => {
      const range = composing.current ?? latest.current.sel;
      composing.current = null;
      const text = e.data ?? "";
      if (text) insert([{ text, style: typingStyle(Math.min(range.start, range.end)) }], range, {});
      setRenderTick((n) => n + 1);
    };
    const onSelectionChange = () => {
      if (composing.current) return;
      const s = getSelectionOffsets(root);
      if (s) latest.current.onSelect(s);
    };
    const onDragStart = (e) => e.preventDefault();
    root.addEventListener("beforeinput", onBeforeInput);
    root.addEventListener("paste", onPaste);
    root.addEventListener("drop", onDrop);
    root.addEventListener("dragstart", onDragStart);
    root.addEventListener("compositionstart", onCompositionStart);
    root.addEventListener("compositionend", onCompositionEnd);
    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      root.removeEventListener("beforeinput", onBeforeInput);
      root.removeEventListener("paste", onPaste);
      root.removeEventListener("drop", onDrop);
      root.removeEventListener("dragstart", onDragStart);
      root.removeEventListener("compositionstart", onCompositionStart);
      root.removeEventListener("compositionend", onCompositionEnd);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, []);
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      ref,
      className: "ansiEditor-editor ansiEditor-code",
      contentEditable: true,
      suppressContentEditableWarning: true,
      spellCheck: false,
      role: "textbox",
      "aria-multiline": "true",
      "aria-label": t("view.editor"),
      "data-placeholder": t("view.placeholder"),
      tabIndex: 0
    }
  );
}

// src/ui/ColorPalette.tsx
function colorName(layer, code) {
  return t(`color.${layer}.${COLOR_IDS[code]}`);
}
var keepFocus = (e) => e.preventDefault();
function Swatch({ layer, code, active, partial, onPick }) {
  const name = code === null ? t(layer === "fg" ? "toolbar.default" : "toolbar.noBg") : colorName(layer, code);
  const label = code === null ? name : `${code} · ${name}`;
  const state = active ? partial ? ` (${t("toolbar.partial")})` : "" : "";
  return /* @__PURE__ */ BdApi.React.createElement(Tip, { text: label + state }, (tip) => /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      ...tip,
      type: "button",
      "aria-label": label,
      "aria-pressed": active,
      className: [
        "ansiEditor-swatch",
        code === null ? "ansiEditor-swatchNone" : `ansiEditor-swatch-${code}`,
        active ? "ansiEditor-swatchActive" : "",
        partial ? "ansiEditor-swatchPartial" : ""
      ].join(" "),
      onMouseDown: keepFocus,
      onClick: (e) => onPick(code, e.altKey)
    }
  ));
}
function ColorPalette({ layer, value, present, onPick }) {
  const codes = [null, ...layer === "fg" ? FG_CODES : BG_CODES];
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      className: "ansiEditor-palette",
      role: "group",
      "aria-label": t(layer === "fg" ? "toolbar.textColor" : "toolbar.bgColor")
    },
    codes.map((code) => {
      const mixed = value === "mixed";
      const active = mixed ? !!present?.has(code) : value === code;
      return /* @__PURE__ */ BdApi.React.createElement(
        Swatch,
        {
          key: String(code),
          layer,
          code,
          active,
          partial: mixed && active,
          onPick
        }
      );
    })
  );
}

// src/ui/Toolbar.tsx
function IconButton({ label, icon, onClick, pressed, disabled }) {
  const text = t(label);
  return /* @__PURE__ */ BdApi.React.createElement(Tip, { text }, (tip) => /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      ...tip,
      type: "button",
      "aria-label": text,
      "aria-pressed": pressed,
      disabled,
      className: [
        "ansiEditor-iconButton",
        pressed === true ? "ansiEditor-pressed" : "",
        pressed === "mixed" ? "ansiEditor-partial" : ""
      ].join(" "),
      onMouseDown: keepFocus,
      onClick
    },
    icon
  ));
}
var toPressed = (v) => v === "mixed" ? "mixed" : v;
function Toolbar(p) {
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-toolbar", role: "toolbar", "aria-label": t("modal.title") }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-toolGroup" }, /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-toolLabel" }, t("toolbar.textColor")), /* @__PURE__ */ BdApi.React.createElement(ColorPalette, { layer: "fg", value: p.style.fg, present: p.presentFg, onPick: p.onFg })), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-toolGroup" }, /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-toolLabel" }, t("toolbar.bgColor")), /* @__PURE__ */ BdApi.React.createElement(ColorPalette, { layer: "bg", value: p.style.bg, present: p.presentBg, onPick: p.onBg })), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-toolGroup ansiEditor-toolButtons" }, /* @__PURE__ */ BdApi.React.createElement(
    IconButton,
    {
      label: "toolbar.bold",
      icon: /* @__PURE__ */ BdApi.React.createElement(BoldIcon, null),
      pressed: toPressed(p.style.bold),
      onClick: p.onBold
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    IconButton,
    {
      label: "toolbar.underline",
      icon: /* @__PURE__ */ BdApi.React.createElement(UnderlineIcon, null),
      pressed: toPressed(p.style.underline),
      onClick: p.onUnderline
    }
  ), /* @__PURE__ */ BdApi.React.createElement(IconButton, { label: "toolbar.resetStyle", icon: /* @__PURE__ */ BdApi.React.createElement(ResetIcon, null), onClick: p.onResetStyle }), /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-divider" }), /* @__PURE__ */ BdApi.React.createElement(
    IconButton,
    {
      label: "toolbar.undo",
      icon: /* @__PURE__ */ BdApi.React.createElement(UndoIcon, null),
      disabled: !p.canUndo,
      onClick: p.onUndo
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    IconButton,
    {
      label: "toolbar.redo",
      icon: /* @__PURE__ */ BdApi.React.createElement(RedoIcon, null),
      disabled: !p.canRedo,
      onClick: p.onRedo
    }
  ), /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-divider" }), /* @__PURE__ */ BdApi.React.createElement(
    IconButton,
    {
      label: "toolbar.effects",
      icon: /* @__PURE__ */ BdApi.React.createElement(SparkIcon, null),
      pressed: p.panel === "effects",
      onClick: () => p.onPanel(p.panel === "effects" ? null : "effects")
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    IconButton,
    {
      label: "toolbar.presets",
      icon: /* @__PURE__ */ BdApi.React.createElement(StarIcon, null),
      pressed: p.panel === "presets",
      onClick: () => p.onPanel(p.panel === "presets" ? null : "presets")
    }
  ), /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-divider" }), /* @__PURE__ */ BdApi.React.createElement(
    IconButton,
    {
      label: "toolbar.importClipboard",
      icon: /* @__PURE__ */ BdApi.React.createElement(ClipboardIcon, null),
      onClick: p.onImportClipboard
    }
  ), /* @__PURE__ */ BdApi.React.createElement(IconButton, { label: "toolbar.new", icon: /* @__PURE__ */ BdApi.React.createElement(FileIcon, null), onClick: p.onNew }), /* @__PURE__ */ BdApi.React.createElement(IconButton, { label: "toolbar.clearAll", icon: /* @__PURE__ */ BdApi.React.createElement(TrashIcon, null), onClick: p.onClearAll })));
}

// src/ui/Preview.tsx
var { useMemo: useMemo2 } = BdApi.React;
function Preview({ body }) {
  const doc = useMemo2(() => parseAnsi(body).doc, [body]);
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-previewWrap", "aria-label": t("view.preview") }, /* @__PURE__ */ BdApi.React.createElement("pre", { className: "ansiEditor-preview ansiEditor-code" }, /* @__PURE__ */ BdApi.React.createElement("code", null, doc.map((run, i) => /* @__PURE__ */ BdApi.React.createElement("span", { key: i, className: styleClasses(run.style) }, run.text)), "\n")));
}

// src/ui/RawView.tsx
var { useState: useState4 } = BdApi.React;
var SEQ = /(\u001b\[[0-9;]*m)/;
function RawView({ output, onApply }) {
  const [editing, setEditing] = useState4(null);
  if (editing !== null) {
    return /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-raw" }, /* @__PURE__ */ BdApi.React.createElement(
      "textarea",
      {
        className: "ansiEditor-rawText ansiEditor-code",
        value: editing,
        spellCheck: false,
        onChange: (e) => setEditing(e.currentTarget.value),
        autoFocus: true
      }
    ), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-rawActions" }, /* @__PURE__ */ BdApi.React.createElement(
      "button",
      {
        type: "button",
        className: "ansiEditor-btn ansiEditor-btnSecondary",
        onClick: () => setEditing(null)
      },
      t("raw.cancel")
    ), /* @__PURE__ */ BdApi.React.createElement(
      "button",
      {
        type: "button",
        className: "ansiEditor-btn ansiEditor-btnPrimary",
        onClick: () => {
          onApply(editing);
          setEditing(null);
        }
      },
      t("raw.apply")
    )));
  }
  const parts = output.split(SEQ);
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-raw" }, /* @__PURE__ */ BdApi.React.createElement("pre", { className: "ansiEditor-rawCode ansiEditor-code", "aria-label": t("view.code") }, parts.map(
    (p, i) => SEQ.test(p) ? /* @__PURE__ */ BdApi.React.createElement("span", { key: i, className: "ansiEditor-esc" }, "␛" + p.slice(1)) : /* @__PURE__ */ BdApi.React.createElement("span", { key: i }, p)
  )), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-rawActions" }, /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      type: "button",
      className: "ansiEditor-btn ansiEditor-btnSecondary",
      onClick: () => setEditing(output.split(ESC).join("\\u001b"))
    },
    t("raw.editAsText")
  )));
}

// src/ui/Footer.tsx
var { useState: useState5 } = BdApi.React;
function CopyMenu({ onCopy, primary }) {
  const [open, setOpen] = useState5(false);
  const cls = primary ? "ansiEditor-btnPrimary" : "ansiEditor-btnSecondary";
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-split" }, /* @__PURE__ */ BdApi.React.createElement("button", { type: "button", className: `ansiEditor-btn ${cls}`, onClick: () => onCopy("wrapped") }, t("footer.copy")), /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      type: "button",
      className: `ansiEditor-btn ${cls} ansiEditor-splitToggle`,
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "aria-label": t("footer.copy"),
      onClick: () => setOpen(!open)
    },
    /* @__PURE__ */ BdApi.React.createElement(ChevronIcon, null)
  ), open && /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-menu", role: "menu", onMouseLeave: () => setOpen(false) }, ["wrapped", "raw", "plain"].map((k) => /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      key: k,
      type: "button",
      role: "menuitem",
      className: "ansiEditor-menuItem",
      onClick: () => {
        setOpen(false);
        onCopy(k);
      }
    },
    t(
      k === "wrapped" ? "footer.copyWrapped" : k === "raw" ? "footer.copyRaw" : "footer.copyPlain"
    )
  ))));
}
function Footer(p) {
  const over = p.info.level === "error";
  const hints = [t("footer.mobileHint")];
  if (p.replying) hints.unshift(t("footer.replyHint"));
  if (p.hasBackticks) hints.unshift(t("footer.backticksHint"));
  const btn = (action) => `ansiEditor-btn ${p.primary === action ? "ansiEditor-btnPrimary" : "ansiEditor-btnSecondary"}`;
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-footer" }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-footerLeft" }, /* @__PURE__ */ BdApi.React.createElement(
    Tip,
    {
      text: t("footer.counterTip", {
        text: p.info.textChars,
        esc: p.info.escapeChars,
        wrap: p.info.wrapChars
      })
    },
    (tip) => /* @__PURE__ */ BdApi.React.createElement(
      "span",
      {
        ...tip,
        tabIndex: 0,
        className: `ansiEditor-counter ansiEditor-counter-${p.info.level}`,
        "aria-live": "polite"
      },
      p.info.total,
      " / ",
      p.info.limit
    )
  ), /* @__PURE__ */ BdApi.React.createElement("button", { type: "button", className: "ansiEditor-btn ansiEditor-btnLink", onClick: p.onOptimize }, t("footer.optimize")), /* @__PURE__ */ BdApi.React.createElement(Tip, { text: hints.join("\n") }, (tip) => /* @__PURE__ */ BdApi.React.createElement("span", { ...tip, tabIndex: 0, className: "ansiEditor-hint", "aria-label": hints.join(". ") }, /* @__PURE__ */ BdApi.React.createElement(InfoIcon, null))), over && /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-error", role: "alert" }, t("footer.overLimit", { limit: p.info.limit }))), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-footerRight" }, /* @__PURE__ */ BdApi.React.createElement(CopyMenu, { onCopy: p.onCopy, primary: p.primary === "copy" }), p.primary === "save" ? /* @__PURE__ */ BdApi.React.createElement("button", { type: "button", className: btn("save"), disabled: over, onClick: p.onSave }, t("footer.save")) : /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement("button", { type: "button", className: btn("insert"), onClick: p.onInsert }, t("footer.insert")), /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      type: "button",
      className: btn("send"),
      disabled: over || p.replying,
      title: p.replying ? t("footer.replyHint") : void 0,
      onClick: p.onSend
    },
    t("footer.send")
  ))));
}

// src/core/effects.ts
var RAINBOW_COLORS = [1, 3, 2, 6, 4, 5];
var DEFAULT_RAINBOW = {
  colors: RAINBOW_COLORS,
  step: "char",
  skipSpaces: true,
  layer: "fg"
};
var DEFAULT_ALTERNATE = {
  colors: [1, 4],
  step: "word",
  skipSpaces: true,
  layer: "fg"
};
function effectUnits(text, step, skipSpaces) {
  if (step === "char") {
    const b = graphemeBoundaries(text);
    const out = [];
    for (let i = 0; i + 1 < b.length; i++) {
      const ch = text.slice(b[i], b[i + 1]);
      if (skipSpaces && /^\s+$/.test(ch)) continue;
      out.push({ start: b[i], end: b[i + 1] });
    }
    return out;
  }
  const re = step === "word" ? /\S+/g : /[^\n]+/g;
  return [...text.matchAll(re)].map((m) => ({
    start: m.index ?? 0,
    end: (m.index ?? 0) + m[0].length
  }));
}
function applyColorCycle(doc, start, end, opts) {
  if (!opts.colors.length || start >= end) return doc;
  const part = sliceDoc(doc, start, end);
  const text = part.map((r) => r.text).join("");
  const units = effectUnits(text, opts.step, opts.skipSpaces);
  let colored = part;
  units.forEach((u, i) => {
    const code = codeFor(opts.layer, opts.colors[i % opts.colors.length]);
    colored = recolor(colored, u, opts.layer, code);
  });
  return replaceRange(doc, start, end, normalize(colored));
}
function recolor(doc, r, layer, code) {
  const out = [];
  let pos = 0;
  for (const run of doc) {
    const rs = pos;
    const re = pos + run.text.length;
    pos = re;
    if (re <= r.start || rs >= r.end) {
      out.push(run);
      continue;
    }
    const a = Math.max(r.start, rs) - rs;
    const b = Math.min(r.end, re) - rs;
    if (a > 0) out.push({ text: run.text.slice(0, a), style: run.style });
    out.push({ text: run.text.slice(a, b), style: { ...run.style, [layer]: code } });
    if (b < run.text.length) out.push({ text: run.text.slice(b), style: run.style });
  }
  return out;
}

// src/ui/EffectsPanel.tsx
var { useMemo: useMemo3, useState: useState6 } = BdApi.React;
var PREVIEW_CHARS = 120;
function Select(props) {
  return /* @__PURE__ */ BdApi.React.createElement("label", { className: "ansiEditor-field" }, /* @__PURE__ */ BdApi.React.createElement("span", null, props.label), /* @__PURE__ */ BdApi.React.createElement(
    "select",
    {
      className: "ansiEditor-select",
      value: props.value,
      onChange: (e) => props.onChange(e.currentTarget.value)
    },
    props.options.map((o) => /* @__PURE__ */ BdApi.React.createElement("option", { key: o.value, value: o.value }, o.label))
  ));
}
function EffectsPanel({ doc, sel, onApply }) {
  const [effect, setEffect] = useState6("rainbow");
  const [opts, setOpts] = useState6({
    rainbow: DEFAULT_RAINBOW,
    alternate: DEFAULT_ALTERNATE
  });
  const cur = opts[effect];
  const set = (patch) => setOpts({ ...opts, [effect]: { ...cur, ...patch } });
  const hasSelection = sel.start !== sel.end;
  const range = hasSelection ? { start: Math.min(sel.start, sel.end), end: Math.max(sel.start, sel.end) } : { start: 0, end: docLength(doc) };
  const maxColors = effect === "alternate" ? 4 : 8;
  const minColors = effect === "alternate" ? 2 : 1;
  const preview = useMemo3(() => {
    const part = sliceDoc(doc, range.start, Math.min(range.end, range.start + PREVIEW_CHARS));
    const applied = applyColorCycle(part, 0, docLength(part), cur);
    return serialize(applied, { wrap: false, aggressive: false });
  }, [doc, range.start, range.end, cur]);
  const steps = [
    { value: "char", label: t("effects.step.char") },
    { value: "word", label: t("effects.step.word") },
    { value: "line", label: t("effects.step.line") }
  ];
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-panel", role: "region", "aria-label": t("toolbar.effects") }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-tabs", role: "tablist" }, ["rainbow", "alternate"].map((e) => /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      key: e,
      type: "button",
      role: "tab",
      "aria-selected": effect === e,
      className: `ansiEditor-tab ${effect === e ? "ansiEditor-tabActive" : ""}`,
      onClick: () => setEffect(e)
    },
    t(`effects.${e}`)
  ))), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-panelRow" }, /* @__PURE__ */ BdApi.React.createElement(
    Select,
    {
      label: t("effects.step"),
      value: cur.step,
      options: steps,
      onChange: (step) => set({ step })
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    Select,
    {
      label: t("effects.layer"),
      value: cur.layer,
      options: [
        { value: "fg", label: t("effects.layer.fg") },
        { value: "bg", label: t("effects.layer.bg") }
      ],
      onChange: (layer) => set({ layer })
    }
  ), /* @__PURE__ */ BdApi.React.createElement("label", { className: "ansiEditor-check" }, /* @__PURE__ */ BdApi.React.createElement(
    "input",
    {
      type: "checkbox",
      checked: cur.skipSpaces,
      onChange: (e) => set({ skipSpaces: e.currentTarget.checked })
    }
  ), t("effects.skipSpaces"))), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-panelRow", "aria-label": t("effects.colors") }, /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-toolLabel" }, t("effects.colors")), cur.colors.map((c, i) => /* @__PURE__ */ BdApi.React.createElement(
    "select",
    {
      key: i,
      className: "ansiEditor-select ansiEditor-colorSelect",
      style: { backgroundColor: `var(--ansi-${cur.layer}-${codeFor(cur.layer, c)})` },
      value: c,
      "aria-label": `${t("effects.colors")} ${i + 1}`,
      onChange: (e) => {
        const colors = [...cur.colors];
        colors[i] = Number(e.currentTarget.value);
        set({ colors });
      }
    },
    Array.from({ length: 8 }, (_, idx) => /* @__PURE__ */ BdApi.React.createElement("option", { key: idx, value: idx }, colorName(cur.layer, codeFor(cur.layer, idx))))
  )), /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      type: "button",
      className: "ansiEditor-btn ansiEditor-btnSmall",
      disabled: cur.colors.length >= maxColors,
      "aria-label": t("effects.addColor"),
      onClick: () => set({ colors: [...cur.colors, (cur.colors[cur.colors.length - 1] + 1) % 8] })
    },
    "+"
  ), /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      type: "button",
      className: "ansiEditor-btn ansiEditor-btnSmall",
      disabled: cur.colors.length <= minColors,
      "aria-label": t("effects.removeColor"),
      onClick: () => set({ colors: cur.colors.slice(0, -1) })
    },
    "−"
  )), /* @__PURE__ */ BdApi.React.createElement(Preview, { body: preview }), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-panelRow ansiEditor-panelFooter" }, /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-muted" }, t(hasSelection ? "effects.target.selection" : "effects.target.all")), /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      type: "button",
      className: "ansiEditor-btn ansiEditor-btnPrimary",
      disabled: range.start === range.end,
      onClick: () => onApply(applyColorCycle(doc, range.start, range.end, cur))
    },
    t("effects.apply")
  )));
}

// src/ui/PresetsPanel.tsx
var { useState: useState7 } = BdApi.React;
function PresetsPanel(p) {
  const [name, setName] = useState7("");
  const add = () => {
    const n = name.trim() || `${t("presets.title")} ${p.presets.length + 1}`;
    p.onChange([...p.presets, { name: n, style: { ...p.currentStyle } }]);
    setName("");
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-panel", role: "region", "aria-label": t("toolbar.presets") }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-panelTitle" }, t("presets.title")), p.presets.length === 0 && /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-muted" }, t("presets.empty")), /* @__PURE__ */ BdApi.React.createElement("ul", { className: "ansiEditor-list" }, p.presets.map((preset, i) => /* @__PURE__ */ BdApi.React.createElement("li", { key: i, className: "ansiEditor-listItem" }, /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      type: "button",
      className: "ansiEditor-listMain",
      onMouseDown: (e) => e.preventDefault(),
      onClick: () => p.onApply(preset.style)
    },
    i < 9 && /* @__PURE__ */ BdApi.React.createElement("kbd", { className: "ansiEditor-kbd" }, "Alt+", i + 1),
    /* @__PURE__ */ BdApi.React.createElement("span", { className: `ansiEditor-code ansiEditor-sample ${styleClasses(preset.style)}` }, preset.name)
  ), /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      type: "button",
      className: "ansiEditor-btn ansiEditor-btnSmall",
      "aria-label": t("presets.delete"),
      onClick: () => p.onChange(p.presets.filter((_, j) => j !== i))
    },
    "×"
  )))), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-panelRow" }, /* @__PURE__ */ BdApi.React.createElement(
    "input",
    {
      className: "ansiEditor-input",
      placeholder: t("presets.namePlaceholder"),
      value: name,
      onChange: (e) => setName(e.currentTarget.value),
      onKeyDown: (e) => e.key === "Enter" && add()
    }
  ), /* @__PURE__ */ BdApi.React.createElement("button", { type: "button", className: "ansiEditor-btn ansiEditor-btnSecondary", onClick: add }, t("presets.add"))), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-panelTitle" }, t("presets.recent")), p.recent.length === 0 && /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-muted" }, t("presets.recentEmpty")), /* @__PURE__ */ BdApi.React.createElement("ul", { className: "ansiEditor-list" }, p.recent.map((ansi, i) => {
    const text = plainText(parseAnsi(ansi).doc).replace(/\s+/g, " ").trim();
    return /* @__PURE__ */ BdApi.React.createElement("li", { key: i, className: "ansiEditor-listItem" }, /* @__PURE__ */ BdApi.React.createElement(
      "button",
      {
        type: "button",
        className: "ansiEditor-listMain",
        onClick: () => p.onOpenRecent(ansi)
      },
      /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-ellipsis" }, text || "…")
    ));
  })));
}

// src/ui/ConfirmDialog.tsx
var { useEffect: useEffect3, useRef: useRef4 } = BdApi.React;
function ConfirmDialog({
  text,
  onYes,
  onNo
}) {
  const yes = useRef4(null);
  useEffect3(() => yes.current?.focus(), []);
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      className: "ansiEditor-confirmBackdrop",
      onKeyDown: (e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onNo();
        }
      }
    },
    /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-confirm", role: "alertdialog", "aria-modal": "true", "aria-label": text }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-confirmText" }, text), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-confirmActions" }, /* @__PURE__ */ BdApi.React.createElement("button", { type: "button", className: "ansiEditor-btn ansiEditor-btnSecondary", onClick: onNo }, t("confirm.no")), /* @__PURE__ */ BdApi.React.createElement(
      "button",
      {
        ref: yes,
        type: "button",
        className: "ansiEditor-btn ansiEditor-btnDanger",
        onClick: onYes
      },
      t("confirm.yes")
    )))
  );
}

// src/ui/EditorModal.tsx
var { useEffect: useEffect4, useMemo: useMemo4, useRef: useRef5, useState: useState8 } = BdApi.React;
var NARROW_WIDTH = 900;
var DRAFT_DEBOUNCE_MS = 500;
var STORE_OPTS = {
  wrap: false,
  aggressive: false,
  tabSize: 0,
  escapeBackticks: false,
  trailingReset: true
};
function toast(message, type = "info") {
  BdApi.UI.showToast(message, { type });
}
function warnParse(r) {
  if (r.warnings.unsupportedCodes > 0)
    toast(t("import.warnings", { n: r.warnings.unsupportedCodes }), "warning");
}
function initialDoc(opts, literalEscapes) {
  if (opts.edit) return parseAnsi(opts.edit.block.content).doc;
  if (opts.content !== void 0) {
    const r = parseAnsi(opts.content, { literalEscapes });
    warnParse(r);
    return r.doc;
  }
  return parseAnsi(storage.getDraft()).doc;
}
function useSettings() {
  const [s, setS] = useState8(storage.getSettings());
  useEffect4(() => storage.onSettingsChange(setS), []);
  return s;
}
function useNarrow() {
  const [narrow, setNarrow] = useState8(window.innerWidth < NARROW_WIDTH);
  useEffect4(() => {
    const on = () => setNarrow(window.innerWidth < NARROW_WIDTH);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return narrow;
}
var isTextField = (el) => el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;
function EditorModal({ options, onClose }) {
  const settings = useSettings();
  const narrow = useNarrow();
  const ed = useEditor(useMemo4(() => initialDoc(options, settings.literalEscapes), []));
  const { doc, sel, state } = ed;
  const editorRef = useRef5(null);
  const boxRef = useRef5(null);
  const [panel, setPanel] = useState8(null);
  const [view, setView] = useState8("editor");
  const [sideView, setSideView] = useState8("preview");
  const [confirm, setConfirm] = useState8(null);
  const [presets, setPresetsState] = useState8(() => storage.getPresets());
  const [recent, setRecent] = useState8(() => storage.getRecent());
  const [closing, setClosing] = useState8(false);
  const channelId = options.edit?.channelId ?? currentChannelId();
  const [importOffer, setImportOffer] = useState8(null);
  const serializeOpts = {
    trailingReset: settings.trailingReset,
    aggressive: settings.aggressive,
    tabSize: settings.tabSize,
    escapeBackticks: true
  };
  const limit = messageLimit(settings.charLimit, currentUser()?.premiumType);
  const info = useMemo4(
    () => lengthInfo(doc, { ...serializeOpts, wrap: true }, limit),
    [doc, settings, limit]
  );
  const body = useMemo4(() => serialize(doc, { ...serializeOpts, wrap: false }), [doc, settings]);
  const replying = !options.edit && hasPendingReply(channelId);
  const layout = narrow && settings.layout === "side" ? "tabs" : settings.layout;
  useEffect4(() => {
    if (options.edit || options.content !== void 0 || settings.importOnOpen === "never") return;
    const draft = channelDraft(channelId);
    if (!extractAnsiBlocks(draft).length) return;
    if (settings.importOnOpen === "always") importFromText(draft);
    else setImportOffer(draft);
  }, []);
  useEffect4(() => {
    if (options.edit) return;
    const id = setTimeout(() => storage.setDraft(serialize(doc, STORE_OPTS)), DRAFT_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [doc]);
  useEffect4(() => {
    const box = boxRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    let id;
    const ro = new ResizeObserver(() => {
      clearTimeout(id);
      id = setTimeout(
        () => storage.setUi({ width: box.offsetWidth, height: box.offsetHeight }),
        300
      );
    });
    ro.observe(box);
    return () => (clearTimeout(id), ro.disconnect());
  }, []);
  useEffect4(() => {
    if (!panel && !confirm) editorRef.current?.focus();
  }, [view, panel, confirm]);
  const escRef = useRef5(() => {
  });
  escRef.current = () => panel ? setPanel(null) : confirm ? setConfirm(null) : requestClose();
  useEffect4(() => {
    const onKey = (e) => {
      if (e.key !== "Escape" || document.activeElement !== document.body) return;
      e.preventDefault();
      escRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const ui = useMemo4(() => storage.getUi(), []);
  function importFromText(text) {
    const r = parseMessage(text, 0, { literalEscapes: settings.literalEscapes });
    warnParse(r);
    ed.replaceAll(r.doc);
  }
  const ask = (text, yes) => setConfirm({ text, yes });
  const close = () => {
    setClosing(true);
    setTimeout(onClose, 150);
  };
  const requestClose = () => state.dirty ? ask(t("confirm.discard"), close) : close();
  const finish = () => {
    const stored = serialize(doc, STORE_OPTS);
    storage.addRecent(stored);
    setRecent(storage.getRecent());
    ed.dispatch({ type: "clean" });
  };
  const doInsert = async () => {
    await insertIntoTextArea(info.output);
    finish();
    if (!options.edit) storage.setDraft("");
    close();
  };
  const doSend = async () => {
    if (info.level === "error") return;
    if (replying) return doInsert();
    const ok = await sendMessage(info.output, channelId);
    finish();
    storage.setDraft("");
    if (ok) toast(t("toast.sent"), "success");
    close();
  };
  const doSave = async () => {
    const target = options.edit;
    if (!target || info.level === "error") return;
    const { content: content2, block } = target;
    const next = content2.slice(0, block.start) + info.output + content2.slice(block.end);
    const ok = await editMessage(target.channelId, target.messageId, next);
    finish();
    if (ok) toast(t("toast.saved"), "success");
    close();
  };
  const doCopy = async (kind) => {
    const text = kind === "wrapped" ? info.output : kind === "raw" ? body : plainText(doc);
    const ok = await copyText(text);
    if (ok) finish();
    toast(ok ? t("toast.copied") : t("toast.noModules"), ok ? "success" : "error");
  };
  const primaryAction = options.edit ? "save" : settings.primaryAction;
  const doPrimary = () => {
    if (primaryAction === "save") return doSave();
    if (primaryAction === "send") return doSend();
    if (primaryAction === "copy") return doCopy("wrapped");
    return doInsert();
  };
  const doOptimize = () => {
    const r = optimizeWithSavings(doc, { ...serializeOpts, wrap: true });
    if (r.saved > 0) {
      ed.edit(r.doc, state.sel);
      toast(t("toast.optimized", { n: r.saved }), "success");
    } else toast(t("toast.nothingToOptimize"));
  };
  const importClipboard = async () => {
    const text = await readClipboard();
    if (!text) return toast(t("toast.clipboardEmpty"), "warning");
    const r = parseMessage(text, 0, { literalEscapes: settings.literalEscapes });
    warnParse(r);
    const next = replaceRange(doc, sel.start, sel.end, r.doc);
    const caret = sel.start + docLength(r.doc);
    ed.edit(next, { start: caret, end: caret });
  };
  const applyPreset = (style) => ed.patchStyle({ ...style });
  const savePresets = (p) => {
    setPresetsState(p);
    storage.setPresets(p);
  };
  const onKeyDown = (e) => {
    e.stopPropagation();
    const mod = e.ctrlKey || e.metaKey;
    if (e.key === "Escape") {
      e.preventDefault();
      if (panel) setPanel(null);
      else requestClose();
      return;
    }
    if (e.key === "Tab") return trapFocus(e);
    if (mod && e.code === "Enter") {
      e.preventDefault();
      doPrimary();
      return;
    }
    if (isTextField(e.target)) return;
    const run = (fn) => (e.preventDefault(), fn());
    if (mod && e.shiftKey && e.code === "KeyC") return run(() => doCopy("wrapped"));
    if (mod && e.shiftKey && e.code === "KeyZ") return run(() => ed.dispatch({ type: "redo" }));
    if (mod && e.code === "KeyY") return run(() => ed.dispatch({ type: "redo" }));
    if (mod && e.code === "KeyZ") return run(() => ed.dispatch({ type: "undo" }));
    if (mod && e.code === "KeyB") return run(() => ed.toggleAttr("bold"));
    if (mod && e.code === "KeyU") return run(() => ed.toggleAttr("underline"));
    if (mod && e.code === "Space") return run(ed.resetStyle);
    const digit = /^Digit([1-9])$/.exec(e.code);
    if (e.altKey && !mod && digit) {
      const preset = presets[Number(digit[1]) - 1];
      if (preset) run(() => applyPreset(preset.style));
    }
  };
  function trapFocus(e) {
    const box = boxRef.current;
    if (!box) return;
    const items2 = Array.from(
      box.querySelectorAll(
        'button:not([disabled]), [tabindex="0"], input, select, textarea, [contenteditable="true"]'
      )
    ).filter((el) => el.offsetParent !== null);
    if (!items2.length) return;
    const first = items2[0];
    const last = items2[items2.length - 1];
    const wrapTo = e.shiftKey ? document.activeElement === first ? last : null : document.activeElement === last ? first : null;
    if (wrapTo) {
      e.preventDefault();
      wrapTo.focus();
    }
  }
  const stop = (e) => e.stopPropagation();
  const editor = /* @__PURE__ */ BdApi.React.createElement(
    RichEditor,
    {
      editorRef,
      doc,
      sel: state.sel,
      multi: state.multi,
      pending: state.pending,
      literalEscapes: settings.literalEscapes,
      onEdit: (d, s, meta) => ed.edit(d, s, meta),
      onSelect: (s) => ed.dispatch({ type: "select", sel: s }),
      onUndo: () => ed.dispatch({ type: "undo" }),
      onRedo: () => ed.dispatch({ type: "redo" })
    }
  );
  const preview = /* @__PURE__ */ BdApi.React.createElement(Preview, { body });
  const raw = /* @__PURE__ */ BdApi.React.createElement(RawView, { output: info.output, onApply: importFromText });
  const tabButton = (v, label, active, onClick) => /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      key: v,
      type: "button",
      role: "tab",
      "aria-selected": active,
      className: `ansiEditor-tab ${active ? "ansiEditor-tabActive" : ""}`,
      onClick
    },
    label
  );
  let content;
  if (layout === "side") {
    content = /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-split2" }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-pane" }, editor), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-pane" }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-tabs", role: "tablist" }, tabButton(
      "preview",
      t("view.preview"),
      sideView === "preview",
      () => setSideView("preview")
    ), tabButton("code", t("view.code"), sideView === "code", () => setSideView("code"))), sideView === "preview" ? preview : raw));
  } else if (layout === "tabs") {
    content = /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-pane" }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-tabs", role: "tablist" }, tabButton("editor", t("view.editor"), view === "editor", () => setView("editor")), tabButton("preview", t("view.preview"), view === "preview", () => setView("preview")), tabButton("code", t("view.code"), view === "code", () => setView("code"))), view === "editor" ? editor : view === "preview" ? preview : raw);
  } else {
    content = /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-pane" }, editor);
  }
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      className: `ansiEditor-backdrop ${closing ? "ansiEditor-closing" : ""}`,
      onMouseDown: (e) => e.target === e.currentTarget && requestClose(),
      onKeyDown,
      onKeyUp: stop,
      onKeyPress: stop,
      onPaste: stop,
      onCopy: stop,
      onCut: stop
    },
    /* @__PURE__ */ BdApi.React.createElement(
      "div",
      {
        ref: boxRef,
        className: "ansiEditor-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t("modal.title"),
        style: { width: ui.width, height: ui.height }
      },
      /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-header" }, /* @__PURE__ */ BdApi.React.createElement("h2", { className: "ansiEditor-title" }, t("modal.title"), options.edit && /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-muted" }, " · ", t("modal.editingMessage"))), /* @__PURE__ */ BdApi.React.createElement(
        "button",
        {
          type: "button",
          className: "ansiEditor-close",
          "aria-label": t("modal.close"),
          onClick: requestClose
        },
        /* @__PURE__ */ BdApi.React.createElement(CloseIcon, null)
      )),
      /* @__PURE__ */ BdApi.React.createElement(
        Toolbar,
        {
          style: ed.indicator,
          presentFg: ed.present.fg,
          presentBg: ed.present.bg,
          canUndo: ed.canUndo,
          canRedo: ed.canRedo,
          panel,
          onFg: (c, alt) => ed.pickColor("fg", c, alt),
          onBg: (c, alt) => ed.pickColor("bg", c, alt),
          onBold: () => ed.toggleAttr("bold"),
          onUnderline: () => ed.toggleAttr("underline"),
          onResetStyle: ed.resetStyle,
          onClearAll: () => docLength(doc) && ask(t("confirm.clearAll"), () => ed.replaceAll([])),
          onUndo: () => ed.dispatch({ type: "undo" }),
          onRedo: () => ed.dispatch({ type: "redo" }),
          onNew: () => {
            const fresh = () => (ed.replaceAll([]), ed.dispatch({ type: "clean" }), storage.setDraft(""));
            if (docLength(doc)) ask(t("confirm.new"), fresh);
            else fresh();
          },
          onImportClipboard: importClipboard,
          onPanel: setPanel
        }
      ),
      importOffer !== null && /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-banner", role: "status" }, /* @__PURE__ */ BdApi.React.createElement("span", null, t("import.found")), /* @__PURE__ */ BdApi.React.createElement(
        "button",
        {
          type: "button",
          className: "ansiEditor-btn ansiEditor-btnPrimary ansiEditor-btnSmall",
          onClick: () => (importFromText(importOffer), setImportOffer(null))
        },
        t("import.yes")
      ), /* @__PURE__ */ BdApi.React.createElement(
        "button",
        {
          type: "button",
          className: "ansiEditor-btn ansiEditor-btnSecondary ansiEditor-btnSmall",
          onClick: () => setImportOffer(null)
        },
        t("import.no")
      )),
      /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-body" }, content, panel && /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-drawer" }, panel === "effects" ? /* @__PURE__ */ BdApi.React.createElement(EffectsPanel, { doc, sel, onApply: (d) => ed.edit(d, state.sel) }) : /* @__PURE__ */ BdApi.React.createElement(
        PresetsPanel,
        {
          presets,
          recent,
          currentStyle: sel.start === sel.end ? ed.typingStyle : styleAt(doc, sel.start + 1),
          onApply: applyPreset,
          onChange: savePresets,
          onOpenRecent: (ansi) => ed.replaceAll(parseAnsi(ansi).doc)
        }
      ))),
      /* @__PURE__ */ BdApi.React.createElement(
        Footer,
        {
          info,
          primary: primaryAction,
          replying,
          hasBackticks: hasTripleBackticks(plainText(doc)),
          onInsert: doInsert,
          onSend: doSend,
          onSave: doSave,
          onCopy: doCopy,
          onOptimize: doOptimize
        }
      ),
      confirm && /* @__PURE__ */ BdApi.React.createElement(
        ConfirmDialog,
        {
          text: confirm.text,
          onNo: () => setConfirm(null),
          onYes: () => {
            setConfirm(null);
            confirm.yes();
          }
        }
      )
    )
  );
}

// src/ui/openEditor.tsx
var current = null;
var THEME_SELECTOR = ".theme-dark, .theme-light, .theme-darker, .theme-midnight";
function themeClasses() {
  const html = document.documentElement;
  const el = html.matches(THEME_SELECTOR) ? html : document.querySelector(THEME_SELECTOR);
  return el ? Array.from(el.classList).filter((c) => c.startsWith("theme-")) : [];
}
function closeEditor() {
  if (!current) return;
  current.root.unmount();
  current.host.remove();
  current = null;
}
function openEditor(options = {}) {
  closeEditor();
  const host = document.createElement("div");
  host.className = ["ansiEditor-host", ...themeClasses()].join(" ");
  document.body.appendChild(host);
  const root = BdApi.ReactDOM.createRoot(host);
  current = { host, root };
  root.render(/* @__PURE__ */ BdApi.React.createElement(EditorModal, { options, onClose: closeEditor }));
}
var isEditorOpen = () => current !== null;

// src/ui/hotkey.ts
var DISCORD_SHORTCUTS = [
  "Ctrl+K",
  "Ctrl+T",
  "Ctrl+I",
  "Ctrl+E",
  "Ctrl+P",
  "Ctrl+/",
  "Ctrl+'",
  "Ctrl+Shift+M",
  "Ctrl+Shift+D",
  "Ctrl+Shift+U",
  "Ctrl+Shift+N",
  "Ctrl+Shift+T",
  "Ctrl+Shift+I",
  "Ctrl+Shift+H",
  "Ctrl+Shift+Alt+Up",
  "Ctrl+Shift+Alt+Down",
  "Ctrl+Alt+Up",
  "Ctrl+Alt+Down",
  "Ctrl+Enter",
  "Ctrl+Shift+/",
  "Ctrl+R"
];
function keyName(code) {
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit\d$/.test(code)) return code.slice(5);
  if (/^F\d{1,2}$/.test(code)) return code;
  const map = {
    Slash: "/",
    Quote: "'",
    Period: ".",
    Comma: ",",
    Semicolon: ";",
    BracketLeft: "[",
    BracketRight: "]",
    Backquote: "`",
    Minus: "-",
    Equal: "=",
    ArrowUp: "Up",
    ArrowDown: "Down",
    ArrowLeft: "Left",
    ArrowRight: "Right",
    Space: "Space",
    Enter: "Enter"
  };
  return map[code] ?? null;
}
function hotkeyFromEvent(e) {
  const key = keyName(e.code);
  if (!key) return null;
  const parts = [];
  if (e.ctrlKey || e.metaKey) parts.push("Ctrl");
  if (e.shiftKey) parts.push("Shift");
  if (e.altKey) parts.push("Alt");
  if (!parts.length) return null;
  parts.push(key);
  return parts.join("+");
}
var isDiscordShortcut = (hotkey) => DISCORD_SHORTCUTS.includes(hotkey);

// src/ui/SettingsPanel.tsx
var { useState: useState9 } = BdApi.React;
var opt = (value, label) => ({
  value,
  label: label.includes(".") ? t(label) : label
});
function items() {
  return [
    {
      kind: "dropdown",
      id: "primaryAction",
      name: "settings.primaryAction",
      options: [
        opt("insert", "settings.primaryAction.insert"),
        opt("send", "settings.primaryAction.send"),
        opt("copy", "settings.primaryAction.copy")
      ]
    },
    {
      kind: "dropdown",
      id: "buttonPosition",
      name: "settings.buttonPosition",
      options: [
        opt("start", "settings.buttonPosition.start"),
        opt("end", "settings.buttonPosition.end")
      ]
    },
    { kind: "switch", id: "editButton", name: "settings.editButton" },
    {
      kind: "dropdown",
      id: "charLimit",
      name: "settings.charLimit",
      options: [opt("auto", "settings.charLimit.auto"), opt("2000", "2000"), opt("4000", "4000")]
    },
    {
      kind: "dropdown",
      id: "importOnOpen",
      name: "settings.importOnOpen",
      options: [
        opt("ask", "settings.importOnOpen.ask"),
        opt("always", "settings.importOnOpen.always"),
        opt("never", "settings.importOnOpen.never")
      ]
    },
    {
      kind: "dropdown",
      id: "layout",
      name: "settings.layout",
      options: [
        opt("side", "settings.layout.side"),
        opt("tabs", "settings.layout.tabs"),
        opt("editor", "settings.layout.editor")
      ]
    },
    { kind: "switch", id: "trailingReset", name: "settings.trailingReset" },
    {
      kind: "switch",
      id: "aggressive",
      name: "settings.aggressive",
      note: "settings.aggressive.note"
    },
    {
      kind: "dropdown",
      id: "tabSize",
      name: "settings.tabs",
      options: [opt(0, "settings.tabs.off"), opt(2, "2"), opt(4, "4")]
    },
    { kind: "switch", id: "literalEscapes", name: "settings.literalEscapes" },
    { kind: "switch", id: "contextMenu", name: "settings.contextMenu" }
  ];
}
function HotkeyRecorder() {
  const [value, setValue] = useState9(storage.getSettings().hotkey);
  const [recording, setRecording] = useState9(false);
  const conflict = !!value && isDiscordShortcut(value);
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-settingRow" }, /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      type: "button",
      className: "ansiEditor-btn ansiEditor-btnSecondary ansiEditor-hotkey",
      onClick: () => setRecording(true),
      onBlur: () => setRecording(false),
      onKeyDown: (e) => {
        if (!recording) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.key === "Escape") return setRecording(false);
        const hk = hotkeyFromEvent(e.nativeEvent);
        if (!hk) return;
        setValue(hk);
        setRecording(false);
        if (!isDiscordShortcut(hk)) storage.updateSettings({ hotkey: hk });
      }
    },
    recording ? t("settings.hotkey.record") : value || "—"
  ), /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      type: "button",
      className: "ansiEditor-btn ansiEditor-btnLink",
      onClick: () => (setValue(""), storage.updateSettings({ hotkey: "" }))
    },
    t("settings.hotkey.clear")
  ), conflict && /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-error" }, t("settings.hotkey.conflict")));
}
function ResetButton() {
  const [armed, setArmed] = useState9(false);
  return /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      type: "button",
      className: "ansiEditor-btn ansiEditor-btnDanger",
      onClick: () => {
        if (!armed) return setArmed(true);
        storage.resetAll();
        setArmed(false);
        BdApi.UI.showToast(t("toast.allDataReset"), { type: "success" });
      }
    },
    armed ? t("settings.reset.confirm") : t("settings.reset.button")
  );
}
function NativePanel() {
  const [s, setS] = useState9(storage.getSettings());
  const update = (id, value) => {
    storage.updateSettings({ [id]: value });
    setS(storage.getSettings());
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-settings" }, items().map((it) => /* @__PURE__ */ BdApi.React.createElement("label", { key: it.id, className: "ansiEditor-settingRow" }, /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-settingName" }, t(it.name), it.kind === "switch" && it.note && /* @__PURE__ */ BdApi.React.createElement("small", { className: "ansiEditor-muted" }, " — ", t(it.note))), it.kind === "switch" ? /* @__PURE__ */ BdApi.React.createElement(
    "input",
    {
      type: "checkbox",
      checked: !!s[it.id],
      onChange: (e) => update(it.id, e.currentTarget.checked)
    }
  ) : /* @__PURE__ */ BdApi.React.createElement(
    "select",
    {
      className: "ansiEditor-select",
      value: String(s[it.id]),
      onChange: (e) => {
        const raw = e.currentTarget.value;
        const o = it.options.find((x) => String(x.value) === raw);
        update(it.id, o?.value ?? raw);
      }
    },
    it.options.map((o) => /* @__PURE__ */ BdApi.React.createElement("option", { key: String(o.value), value: String(o.value) }, o.label))
  ))), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-settingRow" }, /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-settingName" }, t("settings.hotkey")), /* @__PURE__ */ BdApi.React.createElement(HotkeyRecorder, null)), /* @__PURE__ */ BdApi.React.createElement("div", { className: "ansiEditor-settingRow" }, /* @__PURE__ */ BdApi.React.createElement("span", { className: "ansiEditor-settingName" }, t("settings.reset"), " ", /* @__PURE__ */ BdApi.React.createElement("small", { className: "ansiEditor-muted" }, "— ", t("settings.reset.note"))), /* @__PURE__ */ BdApi.React.createElement(ResetButton, null)));
}
function buildSettingsPanel() {
  const build = BdApi.UI.buildSettingsPanel;
  if (!build) return /* @__PURE__ */ BdApi.React.createElement(NativePanel, null);
  const s = storage.getSettings();
  const settings = items().map(
    (it) => it.kind === "switch" ? {
      type: "switch",
      id: it.id,
      name: t(it.name),
      note: it.note ? t(it.note) : void 0,
      value: s[it.id]
    } : { type: "dropdown", id: it.id, name: t(it.name), value: s[it.id], options: it.options }
  );
  settings.push(
    { type: "custom", id: "hotkey", name: t("settings.hotkey"), children: /* @__PURE__ */ BdApi.React.createElement(HotkeyRecorder, null) },
    {
      type: "custom",
      id: "reset",
      name: t("settings.reset"),
      note: t("settings.reset.note"),
      children: /* @__PURE__ */ BdApi.React.createElement(ResetButton, null)
    }
  );
  try {
    return build({
      settings,
      onChange: (_cat, id, value) => storage.updateSettings({ [id]: value })
    });
  } catch (e) {
    console.warn("[AnsiEditor] buildSettingsPanel failed, using native panel", e);
    return /* @__PURE__ */ BdApi.React.createElement(NativePanel, null);
  }
}

// src/index.tsx
var STYLE_ID = "AnsiEditor-styles";
var LOG4 = "[AnsiEditor]";
var AnsiEditor = class {
  button = null;
  unpatchMenu = null;
  start() {
    console.log(LOG4, `starting v${meta_default.version}`);
    BdApi.DOM.addStyle(STYLE_ID, `${paletteCssVars()}
${editor_default}`);
    this.button = new TextAreaButton(() => openEditor());
    this.button.start().catch((e) => console.error(LOG4, "button init failed", e));
    try {
      this.unpatchMenu = patchMessageContextMenu({
        open: (content) => openEditor({ content }),
        edit: (target) => openEditor({ edit: target })
      });
    } catch (e) {
      console.error(LOG4, "context menu init failed", e);
    }
    window.addEventListener("keydown", this.onGlobalKey, true);
  }
  stop() {
    window.removeEventListener("keydown", this.onGlobalKey, true);
    this.button?.stop();
    this.button = null;
    this.unpatchMenu?.();
    this.unpatchMenu = null;
    closeEditor();
    BdApi.DOM.removeStyle(STYLE_ID);
    storage.clearCache();
    console.log(LOG4, "stopped");
  }
  getSettingsPanel() {
    return buildSettingsPanel();
  }
  /** Global open hotkey; only while the Discord window has focus. */
  onGlobalKey = (e) => {
    const hotkey = storage.getSettings().hotkey;
    if (!hotkey || isEditorOpen() || !document.hasFocus()) return;
    if (hotkeyFromEvent(e) !== hotkey) return;
    e.preventDefault();
    e.stopPropagation();
    openEditor();
  };
};
module.exports = module.exports.default;
