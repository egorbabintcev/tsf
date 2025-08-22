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

export {
  tsDiagnosticToString,
}
