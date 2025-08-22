import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

import type { ConfigShape } from '@/shared/types'

import { tsDiagnosticToString } from '@/shared/utils'

interface ConfigSpec {
  absPath: string
  external: boolean
  config: ConfigShape
}

function getConfigSpec(searchAt: string, configName: string = 'tsconfig.json', cwd: string = process.cwd()): ConfigSpec {
  const absSearchAt = path.resolve(cwd, searchAt)
  const absConfigPath = path.resolve(cwd, path.join(absSearchAt, configName))

  if (!fs.existsSync(absConfigPath)) {
    throw new Error(`Config file ${absConfigPath} not found`)
  }

  const { config, error } = ts.readConfigFile(absConfigPath, ts.sys.readFile)
  if (error) {
    throw new Error(tsDiagnosticToString(error))
  }

  return {
    absPath: absConfigPath,
    config,
    external: path.relative(cwd, absConfigPath).startsWith('node_modules'),
  }
}

export {
  type ConfigSpec,
  getConfigSpec,
}
