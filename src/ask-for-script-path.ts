import { cli } from "cli-ux";
import * as fs from "fs";
const logSymbols = require("log-symbols");

export const askForScriptPath = async (): Promise<string> => {
  console.log();

  const scriptPath = await cli.prompt(
    "Enter the relative path to your raw script file"
  );
  if (!fs.existsSync(scriptPath)) {
    console.log();
    console.log(logSymbols.error, `The file: ${scriptPath} does not exist.`);
    return askForScriptPath();
  }
  return scriptPath;
};
