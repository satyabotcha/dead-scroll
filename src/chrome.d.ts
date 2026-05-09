type ExtensionStorageChange = {
  newValue?: unknown;
  oldValue?: unknown;
};

declare const chrome: {
  runtime: {
    getURL(path: string): string;
  };
  storage: {
    sync: {
      get<T extends Record<string, unknown>>(
        keys: string,
        callback: (result: T) => void
      ): void;
      set(items: Record<string, unknown>): void;
    };
    local: {
      get(
        keys: string | string[],
        callback: (result: Record<string, unknown>) => void
      ): void;
      set(items: Record<string, unknown>): void;
    };
    onChanged: {
      addListener(
        callback: (changes: Record<string, ExtensionStorageChange>, areaName: string) => void
      ): void;
    };
  };
};
