import type { TsConfigJson } from 'type-fest'

type UnknownRecord<Key extends PropertyKey = PropertyKey> = Record<Key, any>

type TSConfigShape = TsConfigJson | UnknownRecord<string>

export {
  type UnknownRecord,
  type TSConfigShape,
}
