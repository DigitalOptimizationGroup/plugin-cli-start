/*
 * Copyright Digital Optimization Group LLC
 * 2019 - present
 */
import { Command, flags } from "@oclif/command";
var path = require("path");
const logSymbols = require("log-symbols");
import * as Cloudworker from "@dollarshaveclub/cloudworker";
import { buildLocalScript } from "../build-local-script";
import { getProjectId } from "../get-project-id";
import * as fs from "fs";
import { configstore } from "../configstore";
import { askForScriptPath } from "../ask-for-script-path";

export default class Start extends Command {
  static description = `run a local server for development`;

  static examples = [
    `$ dog start

# Start on a custom port
$ dog start --port 3001

# Point to a non-standard script location
$ dog start --script ./my-script.js
`
  ];

  public static flags = {
    port: flags.integer({
      char: "p"
    }),
    script: flags.string({
      char: "s"
    })
  };

  static args = [];

  public async run() {
    const { args, flags } = this.parse(Start);
    const projectId = getProjectId();

    var appTypeId: string = configstore.get("appType");

    var script: string = "";
    var scriptPath: string = "./.dog/index.js";
    if (appTypeId === "rawWorker") {
      if (flags.script !== undefined) {
        scriptPath = flags.script;
        script = fs.readFileSync(flags.script, "utf8");
      } else if (configstore.get("scriptPath")) {
        scriptPath = configstore.get("scriptPath");
        script = fs.readFileSync(configstore.get("scriptPath"), "utf8");
      } else {
        scriptPath = await askForScriptPath();
        this.log();
        script = fs.readFileSync(scriptPath, "utf8");
      }
    } else {
      script = fs.readFileSync(scriptPath, "utf8");
    }

    let server: any;
    try {
      const localScript = await buildLocalScript(script, projectId);

      const port = flags.port || 3000;
      server = new Cloudworker(localScript, { debug: true }).listen(port);
      console.log(`Listening on ${port}`);

      process.on("uncaughtException", (err: any) => {
        if (err.code === "EADDRINUSE") {
          this.log(`
  ${logSymbols.error} Port ${err.port} is in use
      
  Please use the --port flag to set a different port:
      
  dog start --port ${err.port + 1}
      `);
        } else {
          this.log("Error, try again.");
        }
        process.exit();
      });
    } catch (e) {
      console.log(e);
      this.log(
        logSymbols.error,
        "Error running development server. Please try again."
      );
    }

    function shutdown() {
      console.log("\nShutting down...");
      server.close(terminate);
    }

    function terminate() {
      console.log("Goodbye!");
      process.exit(0);
    }

    process.on("SIGINT", () => {
      shutdown();
    });

    process.on("SIGTERM", () => {
      shutdown();
    });
  }
}
