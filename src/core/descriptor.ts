import fsSync from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { type TsConfigJson } from 'type-fest'
import ts from 'typescript'

import { resolveModule, tsDiagnosticToString } from '@/shared/utils'

class ConfigDescriptor {
  private _extends: ConfigDescriptor[] | null = null
  private _references: ConfigDescriptor[] | null = null
  private _fullContent: TsConfigJson | null = null
  absPath: string
  content: TsConfigJson
  external: boolean

  constructor(searchAt: string, configName: string = 'tsconfig.json') {
    const cwd = process.cwd()
    const absSearchAt = path.resolve(cwd, searchAt)
    const absConfigPath = path.resolve(cwd, path.join(absSearchAt, configName))

    if (!fsSync.existsSync(absConfigPath)) {
      throw new Error(`Config file ${absConfigPath} not found`)
    }

    const { config, error } = ts.readConfigFile(absConfigPath, ts.sys.readFile)
    if (error) {
      throw new Error(tsDiagnosticToString(error))
    }

    this.absPath = absConfigPath
    this.content = config
    this.external = path.relative(cwd, absConfigPath).startsWith('node_modules')
  }

  static mergeContent(a: TsConfigJson, b: TsConfigJson): TsConfigJson {
    const merged = { ...a, ...b }

    if (merged.compilerOptions) {
      merged.compilerOptions = { ...(a.compilerOptions ?? {}), ...(b.compilerOptions ?? {}) }
    }

    return merged
  }

  get references() {
    if (this._references !== null) return this._references

    if (!this.content.references?.length) {
      this._references = []
      return this._references
    }

    return (this._references = this.content.references.map((ref) => {
      const resolvedRefPath = resolveModule(this.absPath, ref.path)
      const refConfig = new ConfigDescriptor(path.dirname(resolvedRefPath), path.basename(resolvedRefPath))
      return refConfig
    }))
  }

  get extends() {
    if (this._extends !== null) return this._extends

    if (!this.content.extends) {
      this._extends = []
      return this._extends
    }

    return (this._extends = [this.content.extends].flat().map((extend) => {
      const resolvedExtendPath = resolveModule(this.absPath, extend)
      const extendConfig = new ConfigDescriptor(path.dirname(resolvedExtendPath), path.basename(resolvedExtendPath))
      return extendConfig
    }))
  }

  get fullContent(): TsConfigJson {
    if (this._fullContent !== null) return this.fullContent

    if (!this.extends.length) {
      this._fullContent = this.content
      return this._fullContent
    }

    const mergedExtends = this.extends.reduce((acc, toExtend) => {
      return ConfigDescriptor.mergeContent(acc, toExtend.fullContent)
    }, this.content)

    return (this._fullContent = ConfigDescriptor.mergeContent(mergedExtends, this.content))
  }

  async write(content: TsConfigJson): Promise<void> {
    if (this.external) throw new Error('Cannot write to external config')

    const jsonContent = JSON.stringify(content, undefined, 2)

    await fs.writeFile(this.absPath, jsonContent)
  }
}

export {
  ConfigDescriptor,
}
