/* Minimal typings for the parts of the BetterDiscord API this plugin uses. */
import type * as ReactNS from "react";

declare global {
  type ReactNode = ReactNS.ReactNode;

  interface BdReactRoot {
    render(node: ReactNS.ReactNode): void;
    unmount(): void;
  }

  interface BdWebpackOptions {
    searchExports?: boolean;
    defaultExport?: boolean;
    first?: boolean;
  }

  type BdModuleFilter = (exports: any, module?: any, id?: string) => boolean;

  interface BdSettingsItem {
    type: string;
    id: string;
    name: string;
    note?: string;
    value?: unknown;
    options?: { label: string; value: unknown }[];
    children?: ReactNS.ReactNode;
    disabled?: boolean;
  }

  interface BdContextMenuItem {
    type?: "submenu" | "separator" | "text" | "toggle" | "radio";
    id?: string;
    label?: string;
    action?: () => void;
    items?: BdContextMenuItem[];
    disabled?: boolean;
  }

  const BdApi: {
    React: typeof ReactNS;
    ReactDOM: {
      createRoot(el: Element): BdReactRoot;
      createPortal(node: ReactNS.ReactNode, el: Element): ReactNS.ReactPortal;
    };
    Webpack: {
      getModule(filter: BdModuleFilter, options?: BdWebpackOptions): any;
      getWithKey?(filter: BdModuleFilter, options?: BdWebpackOptions): [any, string] | undefined;
      getByKeys?(...args: any[]): any;
      getStore?(name: string): any;
      waitForModule(
        filter: BdModuleFilter,
        options?: BdWebpackOptions & { signal?: AbortSignal },
      ): Promise<any>;
      Filters: {
        byKeys(...keys: string[]): BdModuleFilter;
        byStrings(...strings: string[]): BdModuleFilter;
        byStoreName?(name: string): BdModuleFilter;
      };
    };
    Patcher: {
      after(
        caller: string,
        module: any,
        method: string,
        cb: (thisObject: any, args: any[], returnValue: any) => any,
      ): () => void;
      unpatchAll(caller: string): void;
    };
    ContextMenu: {
      patch(navId: string, cb: (tree: any, props: any) => void): () => void;
      buildItem(item: BdContextMenuItem): ReactNS.ReactElement;
    };
    DOM: {
      addStyle(id: string, css: string): void;
      removeStyle(id: string): void;
    };
    Data: {
      load(plugin: string, key: string): any;
      save(plugin: string, key: string, value: unknown): void;
      delete(plugin: string, key: string): void;
    };
    UI: {
      showToast(
        message: string,
        options?: { type?: "info" | "success" | "warning" | "error" | ""; timeout?: number },
      ): void;
      buildSettingsPanel?(options: {
        settings: BdSettingsItem[];
        onChange: (category: string | null, id: string, value: unknown) => void;
      }): ReactNS.ReactNode;
    };
    Components?: {
      Tooltip?: ReactNS.ComponentType<{
        text: string;
        position?: string;
        children: (props: Record<string, unknown>) => ReactNS.ReactNode;
      }>;
    };
    Utils: {
      findInTree(tree: any, filter: (node: any) => boolean, options?: any): any;
    };
  };

  const DiscordNative: { clipboard?: { copy(text: string): void } } | undefined;
}

export {};
