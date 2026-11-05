/** Undo/redo stack with typing coalescing. */

export interface History<T> {
  past: T[];
  present: T;
  future: T[];
  /** Group of the last pushed step and when it happened (for coalescing). */
  group: string | null;
  time: number;
}

export interface PushMeta {
  /** Steps with the same group pushed within `gapMs` are merged into one. */
  group?: string | null;
  now?: number;
  /** Force-close the current group after this step (e.g. typed a space). */
  breakAfter?: boolean;
}

export const HISTORY_LIMIT = 100;
export const COALESCE_GAP_MS = 1000;

export function createHistory<T>(present: T): History<T> {
  return { past: [], present, future: [], group: null, time: 0 };
}

export function push<T>(h: History<T>, value: T, meta: PushMeta = {}): History<T> {
  const now = meta.now ?? Date.now();
  const group = meta.group ?? null;
  const merge = group !== null && h.group === group && now - h.time <= COALESCE_GAP_MS;
  const nextGroup = meta.breakAfter ? null : group;
  if (merge) return { ...h, present: value, future: [], group: nextGroup, time: now };
  const past = [...h.past, h.present];
  if (past.length > HISTORY_LIMIT) past.splice(0, past.length - HISTORY_LIMIT);
  return { past, present: value, future: [], group: nextGroup, time: now };
}

export function canUndo<T>(h: History<T>): boolean {
  return h.past.length > 0;
}

export function canRedo<T>(h: History<T>): boolean {
  return h.future.length > 0;
}

export function undo<T>(h: History<T>): History<T> {
  if (!h.past.length) return h;
  const past = h.past.slice(0, -1);
  return { past, present: h.past[h.past.length - 1], future: [h.present, ...h.future], group: null, time: 0 };
}

export function redo<T>(h: History<T>): History<T> {
  if (!h.future.length) return h;
  const [next, ...future] = h.future;
  return { past: [...h.past, h.present], present: next, future, group: null, time: 0 };
}
