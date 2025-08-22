import path from 'node:path'

import type { ConfigSpec } from '@/shared/types'

import { getConfigSpec } from '@/core/get-spec'

interface ConfigTree {
  spec: ConfigSpec
  extends?: ConfigTree[]
}

function resolveExternal(to: string, from: string) {
  if (to.startsWith('.')) {
    return path.resolve(path.dirname(from), to)
  }

  return import.meta.resolve(to, from).replace('file://', '')
}

function resolveConfigTree(spec: ConfigSpec): ConfigTree[] {
  if (spec.config.references?.length) {
    return spec.config.references.flatMap((ref) => {
      const resolvedRefPath = resolveExternal(ref.path, spec.absPath)
      const refConfigSpec = getConfigSpec(path.dirname(resolvedRefPath), path.basename(resolvedRefPath))
      return resolveConfigTree(refConfigSpec)
    })
  }

  const tree: ConfigTree = { spec }

  if (spec.config.extends) {
    const configExtends = [spec.config.extends].flat()
    tree.extends = []

    for (const extend of configExtends) {
      const resolvedExtendPath = resolveExternal(extend, spec.absPath)
      const extendConfigSpec = getConfigSpec(path.dirname(resolvedExtendPath), path.basename(resolvedExtendPath))
      tree.extends.push(...resolveConfigTree(extendConfigSpec))
    }
  }

  return [tree]
}

export {
  type ConfigTree,
  resolveConfigTree,
}
