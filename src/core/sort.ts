import type { TsConfigJson } from 'type-fest'

import ts from 'typescript'

import type { ConfigDescriptor } from '@/core/descriptor'

declare module 'typescript' {
  const optionDeclarations: {
    name: string
    category?: ts.DiagnosticMessage
  }[]
}

const sortedTopLevelOptions = ['files', 'references', 'extends', 'include', 'exclude'] as const
const sortedCompilerOptions = ts.optionDeclarations.toSorted((a, b) => {
  const catCmp = (a.category?.message ?? '').localeCompare(b.category?.message ?? '')
  return catCmp || a.name.localeCompare(b.name)
})

function sortTSConfig(descriptor: ConfigDescriptor): TsConfigJson {
  const res = {} as TsConfigJson

  for (const opt of sortedTopLevelOptions) {
    if (opt in descriptor.content) {
      res[opt] = descriptor.content[opt] as any
    }
  }

  if (descriptor.content.compilerOptions) {
    res.compilerOptions = {}
    for (const opt of sortedCompilerOptions) {
      if (opt.name in descriptor.content.compilerOptions) {
        res.compilerOptions[opt.name as keyof TsConfigJson.CompilerOptions] = descriptor.content.compilerOptions[opt.name as keyof TsConfigJson.CompilerOptions] as any
      }
    }
  }

  return res
}

export {
  sortTSConfig,
}
