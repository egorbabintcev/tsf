import fs from 'node:fs'

import type { ConfigTree } from '@/core/resolve-tree'
import type { UnknownRecord } from '@/shared/types'

import { sortedCompilerOptions, sortedTopLevelOptions } from '@/shared/utils'

function applyConfigFixes(tree: ConfigTree) {
  if (tree.extends) {
    for (const extend of tree.extends) {
      applyConfigFixes(extend)
    }
  }

  if (tree.spec.external) return

  const sortedConfig: UnknownRecord = { }

  for (const topLevelOption of sortedTopLevelOptions) {
    if (topLevelOption in tree.spec.config) {
      sortedConfig[topLevelOption] = tree.spec.config[topLevelOption] as any
    }
  }

  if (tree.spec.config.compilerOptions) {
    sortedConfig.compilerOptions = {}
    for (const compilerOption of sortedCompilerOptions) {
      if (compilerOption.name in tree.spec.config.compilerOptions) {
        sortedConfig.compilerOptions[compilerOption.name] = (tree.spec.config.compilerOptions as any)[compilerOption.name]
      }
    }
  }

  const newContent = JSON.stringify(sortedConfig, undefined, 2)

  fs.writeFileSync(tree.spec.absPath, newContent)
}

export {
  applyConfigFixes,
}
