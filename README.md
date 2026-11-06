# ANSI Editor — a BetterDiscord plugin

A visual editor for colored text in Discord. A button in the message box opens a window where you
color text like in a regular editor. The result is an ` ```ansi ` block that is inserted into the
message box or sent right away.

## Installation

1. Download [`AnsiEditor.plugin.js`](AnsiEditor.plugin.js) from the root of this repository.
2. Put the file into the BetterDiscord plugins folder:
   - Windows: `%APPDATA%\BetterDiscord\plugins`
   - macOS: `~/Library/Application Support/BetterDiscord/plugins`
   - Linux: `~/.config/BetterDiscord/plugins`
3. Enable **AnsiEditor** in Settings → BetterDiscord → Plugins.

## Features

- A button in the message box icon row (first or last), and an open hotkey, `Ctrl+Shift+A`.
- WYSIWYG editor: 8 text colors, 8 background colors, bold, underline, style reset.
- Style indicator for the text under the caret, with a "partial" state for mixed selections.
- Eyedropper: `Alt+click` on a swatch selects all text with that color.
- Live preview that looks like Discord, and a Code tab with visible escape sequences
  (editable as plain text).
- Effects: rainbow and alternate (by character, word or line, on text or background), with a preview.
- Style presets (`Alt+1…9`), recent documents, draft autosave.
- Undo/redo for 100 steps; consecutive typing is merged into one step.
- Length counter with a breakdown (text / escape codes / wrapper), a 2000 or 4000 limit depending on
  Nitro, and an Optimize button.
- Import from the message box, from the clipboard, by pasting ANSI text (including typed `\u001b`),
  or from a message through the context menu.
- Message context menu → ANSI: open in the editor, edit your own message (only the ANSI block
  changes), copy as ANSI code or as plain text.
- English and Russian interface, picked from the Discord client language.

### Editor hotkeys

| Keys | Action |
| --- | --- |
| `Ctrl+B` / `Ctrl+U` | Bold / underline |
| `Ctrl+Z` / `Ctrl+Shift+Z`, `Ctrl+Y` | Undo / redo |
| `Ctrl+Space` | Reset the selection style |
| `Alt+1…9` | Apply a preset |
| `Ctrl+Enter` | Primary action (insert / send / copy) |
| `Ctrl+Shift+C` | Copy the ANSI block |
| `Esc` | Close (asks for confirmation if there are changes) |

## Limitations

- Discord renders only 8 text colors, 8 background colors, bold and underline. Italic, 256 colors
  and truecolor are not supported, so the editor does not offer them (on import they are dropped with
  a warning).
- Discord mobile clients show the ANSI block as plain code, without colors.
- Escape codes count towards the message length limit.
- ` ``` ` inside the text is broken up with zero-width spaces, otherwise the block would close early.
- Send would drop a pending reply, so while you are replying, Insert is used instead.

## Development

Requires Node.js 20+.

```bash
npm install
npm run build      # AnsiEditor.plugin.js in the repo root (committed: the BetterDiscord site reads it)
npm run dev        # watch + copy into the BD plugins folder (BD_PLUGINS_DIR overrides the path)
npm run deploy     # one build + copy
npm test           # Vitest, src/core only
npm run coverage   # core/ coverage (90% line threshold)
npm run lint
npm run typecheck
```

Test page without Discord: run `node scripts/harness/serve.mjs` and open
<http://localhost:5179/scripts/harness/index.html>. The plugin runs against a mocked BdApi
(the button uses the DOM fallback, and inserting writes into a fake message box).

### Architecture

- `src/core/` — pure logic with no DOM or BdApi: the document model (styled runs), parser,
  serializer with minimal transitions, effects, limits, history. The model is the source of truth;
  the editor DOM is never parsed back.
- `src/discord/` — everything that depends on Discord internals. Every webpack lookup has a fallback:
  the button patches the button row component, or uses a MutationObserver if the component is not
  found within 5 seconds; inserting uses `ComponentDispatch INSERT_TEXT`, or the clipboard otherwise.
- `src/ui/` — React from `BdApi.React`, with its own overlay styled with Discord CSS variables.
- The palette (`PALETTE` in `src/core/palette.ts`) is Solarized, taken from rebane2001's generator.
  It should be checked against Discord's real rendering before a release.
