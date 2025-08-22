import type { TsConfigJson } from 'type-fest'

type UnknownRecord<Key extends PropertyKey = PropertyKey> = Record<Key, any>

type ConfigShape = TsConfigJson

type ConfigSpec = {
  absPath: string
  external: boolean
  config: ConfigShape
}

export {
  type ConfigShape,
  type ConfigSpec,
  type UnknownRecord,
}
