import path from 'node:path'
import ts from 'typescript'

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

function resolveModule(from: string, to: string) {
  if (to.startsWith('.')) {
    return path.resolve(path.dirname(from), to)
  }

  return import.meta.resolve(to, from).replace('file://', '')
}

export {
  resolveModule,
  tsDiagnosticToString,
}
