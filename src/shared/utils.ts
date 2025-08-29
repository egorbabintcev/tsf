import ts from 'typescript'

declare module 'typescript' {
  const optionDeclarations: CommandLineOption[]
}

export interface CommandLineOption {
  name: string
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'object'
    | 'list'
    | Map<string, number | string>
  defaultValueDescription?: string | number | boolean | ts.DiagnosticMessage
  category?: ts.DiagnosticMessage
  strictFlag?: true
  element: CommandLineOption
}

const sortedTopLevelOptions = ['files', 'include', 'exclude', 'references', 'extends', 'compilerOptions'] as const

const sortedCompilerOptions = ts.optionDeclarations.toSorted((a, b) => {
  return a.category?.message.localeCompare(b.category?.message ?? '') || a.name.localeCompare(b.name)
})

function tsDiagnosticToString(diagnostic: ts.Diagnostic) {
  const host: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: ts.sys.useCaseSensitiveFileNames
      ? (f) => f
      : (f) => f.toLowerCase(),
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
  }

  return ts.formatDiagnosticsWithColorAndContext([diagnostic], host)
}

export {
  sortedCompilerOptions,
  sortedTopLevelOptions,
  tsDiagnosticToString,
}
