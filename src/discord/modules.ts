/**
 * Every lookup of a Discord internal lives here, each with a fallback.
 * Filters were checked against current open-source plugins (BDFDB's PatchModules/LibraryModules).
 */

const W = () => BdApi.Webpack;
const LOG = "[AnsiEditor]";

/** Best-effort source text of a function, memo or forwardRef export. */
export function sourceOf(m: any): string {
  try {
    if (typeof m === "function") return Function.prototype.toString.call(m);
    if (m && typeof m === "object") {
      const inner = m.type ?? m.render;
      if (typeof inner === "function") return Function.prototype.toString.call(inner);
      if (inner?.render) return Function.prototype.toString.call(inner.render);
    }
  } catch {
    /* some exports throw on access */
  }
  return "";
}

const byKeys =
  (...keys: string[]): BdModuleFilter =>
  (m) =>
    !!m && keys.every((k) => k in Object(m));

const bySource =
  (...strings: string[]): BdModuleFilter =>
  (m) => {
    const src = sourceOf(m);
    return !!src && strings.every((s) => src.includes(s));
  };

function safeGet<T = any>(name: string, fn: () => T): T | null {
  try {
    return fn() ?? null;
  } catch (e) {
    console.warn(LOG, `lookup failed: ${name}`, e);
    return null;
  }
}

function store(name: string, ...fallbackKeys: string[]): any {
  return safeGet(name, () => {
    const s = W().getStore?.(name);
    if (s) return s;
    return W().getModule(byKeys(...fallbackKeys), { searchExports: false });
  });
}

/** Text-area buttons row filter (".button", "\"emoji\"", "activeCommandOption"). */
export const textAreaButtonsFilter = bySource(".button", '"emoji"', "activeCommandOption");

export interface PatchTarget {
  owner: any;
  key: string;
}

/** Finds the object + key to patch for a component export, handling plain/memo exports. */
export function resolvePatchTarget(filter: BdModuleFilter): PatchTarget | null {
  return safeGet("patch target", () => {
    const withKey = W().getWithKey?.(filter);
    if (withKey && withKey[0]) {
      const [owner, key] = withKey;
      const exp = owner[key];
      if (exp && typeof exp === "object" && typeof exp.type === "function")
        return { owner: exp, key: "type" };
      return { owner, key };
    }
    const mod = W().getModule((m: any) => m && Object.values(m).some((v) => filter(v)), {
      searchExports: false,
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

/** Resolves when the module matching the filter is loaded (lazy chunks), or null on timeout. */
export async function waitForTarget(
  filter: BdModuleFilter,
  timeoutMs: number,
): Promise<PatchTarget | null> {
  const now = resolvePatchTarget(filter);
  if (now) return now;
  const ctrl = new AbortController();
  const timer = new Promise<null>((r) => setTimeout(() => (ctrl.abort(), r(null)), timeoutMs));
  const found = W()
    .waitForModule(filter, { searchExports: true, signal: ctrl.signal } as any)
    .then(() => resolvePatchTarget(filter))
    .catch(() => null);
  return Promise.race([found, timer]);
}

export const Modules = {
  get ComponentDispatch(): any {
    return safeGet("ComponentDispatch", () =>
      W().getModule((m: any) => m?.dispatchToLastSubscribed && m?.emitter, { searchExports: true }),
    );
  },
  get MessageActions(): any {
    return safeGet("MessageActions", () =>
      W().getModule(byKeys("sendMessage", "editMessage"), { searchExports: false }),
    );
  },
  get SelectedChannelStore(): any {
    return store("SelectedChannelStore", "getChannelId", "getVoiceChannelId");
  },
  get UserStore(): any {
    return store("UserStore", "getCurrentUser", "getUser");
  },
  get DraftStore(): any {
    return store("DraftStore", "getDraft", "getRecentlyEditedDrafts");
  },
  get PendingReplyStore(): any {
    return store("PendingReplyStore", "getPendingReply");
  },
};

export function currentChannelId(): string | null {
  return safeGet("channel id", () => Modules.SelectedChannelStore?.getChannelId?.()) ?? null;
}

export function currentUser(): any {
  return safeGet("current user", () => Modules.UserStore?.getCurrentUser?.());
}

/** Text currently typed in the channel's message box (draft type 0 = channel message). */
export function channelDraft(channelId: string | null): string {
  if (!channelId) return "";
  return safeGet("draft", () => Modules.DraftStore?.getDraft?.(channelId, 0)) ?? "";
}

export function hasPendingReply(channelId: string | null): boolean {
  if (!channelId) return false;
  return !!safeGet("pending reply", () => Modules.PendingReplyStore?.getPendingReply?.(channelId));
}
