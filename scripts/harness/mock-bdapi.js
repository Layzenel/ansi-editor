/* Minimal BdApi mock for the harness. Webpack lookups return fakes so the DOM fallback (strategy B) is used. */
(function () {
  const log = (...a) => {
    const el = document.getElementById("log");
    if (el) el.textContent += a.join(" ") + "\n";
    console.log("[mock]", ...a);
  };
  const store = {};
  const dispatch = {
    emitter: {},
    dispatchToLastSubscribed(type, payload) {
      log("dispatch", type, JSON.stringify(payload.plainText));
      document.getElementById("chatbox").textContent += payload.plainText;
    },
  };
  const messageActions = {
    sendMessage: (channelId, msg) => log("sendMessage", channelId, JSON.stringify(msg.content)),
    editMessage: (c, m, msg) => log("editMessage", c, m, JSON.stringify(msg.content)),
  };
  const stores = {
    SelectedChannelStore: { getChannelId: () => "123" },
    UserStore: { getCurrentUser: () => ({ id: "1", premiumType: 0 }) },
    DraftStore: { getDraft: () => document.getElementById("chatbox")?.textContent ?? "" },
    PendingReplyStore: { getPendingReply: () => null },
  };
  window.BdApi = {
    React: window.React,
    ReactDOM: { createRoot: (el) => window.ReactDOM.createRoot(el), createPortal: window.ReactDOM.createPortal },
    Webpack: {
      getModule(filter) {
        for (const m of [dispatch, messageActions]) if (filter(m)) return m;
        return undefined;
      },
      getStore: (name) => stores[name],
      waitForModule: () => new Promise(() => {}),
      Filters: {},
    },
    Patcher: { after: () => () => {}, unpatchAll: () => {} },
    ContextMenu: { patch: () => () => {}, buildItem: (i) => i },
    DOM: {
      addStyle(id, css) {
        const s = document.createElement("style");
        s.id = id;
        s.textContent = css;
        document.head.appendChild(s);
      },
      removeStyle: (id) => document.getElementById(id)?.remove(),
    },
    Data: {
      load: (p, k) => store[k],
      save: (p, k, v) => (store[k] = v),
      delete: (p, k) => delete store[k],
    },
    UI: { showToast: (m, o) => log("toast", o?.type ?? "", m) },
    Utils: { findInTree: () => null },
  };
})();
