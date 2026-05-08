type ExtensionStorageChange = {
  newValue?: unknown;
  oldValue?: unknown;
};

declare const chrome: {
  storage: {
    sync: {
      get<T extends Record<string, unknown>>(
        keys: string,
        callback: (result: T) => void
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
