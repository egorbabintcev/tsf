import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

import type { TSConfigShape } from '@/shared/types'

import { tsDiagnosticToString } from '@/shared/utils'

interface ConfigTree {
  absPath: string
  external: boolean
  config: TSConfigShape
  extends?: ConfigTree[]
}

function resolveExtend(to: string, from: string) {
  if (to.startsWith('.')) {
    return path.resolve(path.dirname(from), to)
  } else {
    return import.meta.resolve(to, from).replace('file://', '')
  }
}

function createConfigTree(searchAt: string, configName: string = 'tsconfig.json') {
  const cwd = process.cwd()
  const absSearchAt = path.resolve(cwd, searchAt)
  const absConfigPath = path.resolve(cwd, path.join(absSearchAt, configName))

  if (!fs.existsSync(absConfigPath)) {
    throw new Error(`Config file ${absConfigPath} not found`)
  }

  const { config, error } = ts.readConfigFile(absConfigPath, ts.sys.readFile)
  if (error) {
    throw new Error(tsDiagnosticToString(error))
  }

  const tree: ConfigTree = {
    absPath: absConfigPath,
    config: config,
    external: path.relative(cwd, absConfigPath).startsWith('node_modules'),
  }

  if (config.extends) {
    const configExtends = [config.extends].flat()
    tree.extends = []

    for (const extend of configExtends) {
      const resolvedExtendPath = resolveExtend(extend, absConfigPath)
      tree.extends.push(createConfigTree(path.dirname(resolvedExtendPath), path.basename(resolvedExtendPath)))
    }
  }

  return tree
}

export {
  type ConfigTree,
  createConfigTree,
}
