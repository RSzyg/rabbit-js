import ts from "typescript";
// import fs from "fs";
// import path from "path";

/**
 *
 * @param {string[]} fileNames
 * @param {ts.CompilerOptions} options
 */
function compile(fileNames, options) {
  let program = ts.createProgram(fileNames, options);
  let emitResult = program.emit();

  const preEmitDiagnostics = ts.getPreEmitDiagnostics(program);
  const emitResultDiagnostics = emitResult.diagnostics;

  const allDiagnostics = [...preEmitDiagnostics, ...emitResultDiagnostics];
  const diagnosticsSet = new Set(allDiagnostics);

  diagnosticsSet.forEach((diagnostic) => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName}:${line + 1}:${character + 1}: ${message}`
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      );
    }
  });

  let exitCode = emitResult.emitSkipped ? 1 : 0;
  console.log(`Process exiting with code '${exitCode}'.`);
  process.exit(exitCode);
}

/** @type {string[]} */
const fileNames = process.argv.slice(2);
// for (let i = 0; i < fileNames.length; i++) {
//   if (fs.statSync(fileNames[i], { throwIfNoEntry: false })?.isDirectory()) {
//     fileNames[i] = path.resolve(fileNames[i], "index.ts");
//   }
//   // fileName is not a directory
//   // fileName is not exist
//   else if (!/.*\.tsx?$/.test(fileNames[i])) {
//     fileNames[i] += ".ts";
//   }
// }

compile(fileNames, {
  strict: true,
  noEmitOnError: true,
  noImplicitAny: true,
  /** @type {ts.ScriptTarget.ES2015} */
  target: 2,
  /** @type {ts.ModuleKind.CommonJS} */
  // module: 1,
  /** @type {ts.ModuleResolutionKind.NodeJs} */
  moduleResolution: 2,
  outDir: "./public/dist",
});
