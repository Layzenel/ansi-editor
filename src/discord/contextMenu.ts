import { extractAnsiBlocks, parseAnsi, type AnsiBlock } from "../core/parser";
import { plainText } from "../core/model";
import { currentUser } from "./modules";
import { copyText } from "./insert";
import { storage } from "../storage";
import { t } from "../i18n";

export interface EditTarget {
  channelId: string;
  messageId: string;
  content: string;
  block: AnsiBlock;
}

export interface ContextMenuHandlers {
  open(content: string): void;
  edit(target: EditTarget): void;
}

async function copy(text: string): Promise<void> {
  const ok = await copyText(text);
  BdApi.UI.showToast(ok ? t("toast.copied") : t("toast.noModules"), {
    type: ok ? "success" : "error",
  });
}

/** One item, or a submenu with "Block N" entries when the message has several blocks. */
function perBlock(
  label: string,
  blocks: AnsiBlock[],
  action: (b: AnsiBlock) => void,
): BdContextMenuItem {
  if (blocks.length === 1) return { label, action: () => action(blocks[0]) };
  return {
    type: "submenu",
    label,
    items: blocks.map((b, i) => ({
      label: t("menu.block", { n: i + 1 }),
      action: () => action(b),
    })),
  };
}

/** Adds the ANSI submenu to the message context menu. Returns the unpatch function. */
export function patchMessageContextMenu(handlers: ContextMenuHandlers): () => void {
  return BdApi.ContextMenu.patch("message", (tree, props) => {
    try {
      if (!storage.getSettings().contextMenu) return;
      const message = props?.message;
      const content: string = message?.content ?? "";
      const blocks = extractAnsiBlocks(content);
      if (!blocks.length) return;
      const own = !!message?.author?.id && message.author.id === currentUser()?.id;
      const items: BdContextMenuItem[] = [
        perBlock(t("menu.open"), blocks, (b) => handlers.open(b.content)),
      ];
      if (own) {
        items.push(
          perBlock(t("menu.edit"), blocks, (block) =>
            handlers.edit({ channelId: message.channel_id, messageId: message.id, content, block }),
          ),
        );
      }
      items.push(
        perBlock(t("menu.copyAnsi"), blocks, (b) => copy(content.slice(b.start, b.end))),
        perBlock(t("menu.copyPlain"), blocks, (b) =>
          copy(plainText(parseAnsi(b.content, { literalEscapes: false }).doc)),
        ),
      );
      const submenu = BdApi.ContextMenu.buildItem({
        type: "submenu",
        id: "ansi-editor",
        label: t("menu.ansi"),
        items,
      });
      const children = tree?.props?.children;
      if (Array.isArray(children))
        children.push(BdApi.ContextMenu.buildItem({ type: "separator" }), submenu);
    } catch (e) {
      console.error("[AnsiEditor] context menu patch failed", e);
    }
  });
}
