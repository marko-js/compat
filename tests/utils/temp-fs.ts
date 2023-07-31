import fs from "fs";
const tempFiles = new Set<string>();

process.once("exit", rmFiles);
process.once("SIGINT", rmFiles);
process.once("SIGTERM", rmFiles);
process.once("uncaughtException", rmFiles);
process.once("unhandledRejection", rmFiles);

export function writeTempFile(filename: string, text: string) {
  fs.writeFileSync(filename, text, "utf-8");
  tempFiles.add(filename);
}

function rmFiles() {
  for (const virtualFile of tempFiles) {
    try {
      fs.unlinkSync(virtualFile);
    } catch (_err) {
      // Ignore
    }
  }

  tempFiles.clear();
}
