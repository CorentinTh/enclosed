export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type Dictionary<T = unknown> = Record<string, T>;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type Subtract<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
