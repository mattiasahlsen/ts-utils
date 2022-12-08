export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T extends unknown[]
  ? DeepPartial<T[number]>[]
  : T

export type ObjectLiteral<ValueType = unknown> = Record<string, ValueType>
