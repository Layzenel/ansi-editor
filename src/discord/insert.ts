import { Modules, currentChannelId } from "./modules";
import { t } from "../i18n";

const LOG = "[AnsiEditor]";

export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof DiscordNative !== "undefined" && DiscordNative?.clipboard?.copy) {
      DiscordNative.clipboard.copy(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error(LOG, "clipboard failed", e);
    return false;
  }
}

export async function readClipboard(): Promise<string> {
  try {
    return await navigator.clipboard.readText();
  } catch {
    return "";
  }
}

async function fallbackCopy(text: string): Promise<void> {
  const ok = await copyText(text);
  BdApi.UI.showToast(ok ? t("toast.copiedPaste") : t("toast.noModules"), {
    type: ok ? "info" : "error",
  });
}

/** Inserts text into the focused message box; keeps reply state and already typed text. */
export async function insertIntoTextArea(text: string): Promise<void> {
  const cd = Modules.ComponentDispatch;
  if (cd?.dispatchToLastSubscribed) {
    try {
      cd.dispatchToLastSubscribed("INSERT_TEXT", { plainText: text, rawText: text });
      return;
    } catch (e) {
      console.warn(LOG, "INSERT_TEXT failed", e);
    }
  }
  await fallbackCopy(text);
}

/** Sends the text as a new message in the current channel. */
export async function sendMessage(text: string, channelId = currentChannelId()): Promise<boolean> {
  const actions = Modules.MessageActions;
  if (actions?.sendMessage && channelId) {
    try {
      await actions.sendMessage(
        channelId,
        { content: text, tts: false, invalidEmojis: [], validNonShortcutEmojis: [] },
        undefined,
        {},
      );
      return true;
    } catch (e) {
      console.warn(LOG, "sendMessage failed", e);
    }
  }
  await insertIntoTextArea(text);
  return false;
}

/** Edits an existing message. */
export async function editMessage(
  channelId: string,
  messageId: string,
  content: string,
): Promise<boolean> {
  const actions = Modules.MessageActions;
  if (actions?.editMessage) {
    try {
      await actions.editMessage(channelId, messageId, { content });
      return true;
    } catch (e) {
      console.warn(LOG, "editMessage failed", e);
    }
  }
  await fallbackCopy(content);
  return false;
}
