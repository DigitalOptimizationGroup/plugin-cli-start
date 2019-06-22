/*
 * Copyright Digital Optimization Group LLC
 * 2019 - present
 */
var webpack = require("webpack");
var MemoryFS = require("memory-fs");
import * as realFs from "fs";
var fs = new MemoryFS();
var path = require("path");
import uuid = require("uuid");
import * as http from "http";
const portfinder = require("portfinder");
var url = require("url");

portfinder.basePort = 9015;

const localLoggingServer = async () => {
  const port = await portfinder.getPortPromise();

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const query = url.parse(req.url, true).query || {};
      console.log(JSON.stringify(query, null, 4));
      res.writeHead(204, {
        "Content-Length": 0,
        "Content-Type": "image/gif"
      });
      res.end();
    });

    server.listen(port, () => {
      resolve(`http://localhost:${port}`);
    });

    server.on("error", () => {
      process.exit();
    });
  });
};

const webpackConfig = {
  context: "/src",
  entry: { worker: "./entry.js" },
  target: "webworker",
  module: {}
};

export const buildLocalScript = async (
  script: string,
  projectId: string
): Promise<string> => {
  const compiler = webpack(webpackConfig);

  const gifLoggerUrl = await localLoggingServer();

  fs.mkdirpSync("/src");

  fs.writeFileSync("/src/handler.js", script, "utf-8");
  fs.writeFileSync(
    "/src/buildContext.json",
    JSON.stringify({ projectId, gifLoggerUrl }),
    "utf-8"
  );

  const appContext = realFs.readFileSync(
    path.join(__dirname, "../scripts/getAppContext.js")
  );

  fs.writeFileSync("/src/getContext.js", appContext, "utf-8");

  const entry = `
import { handler } from "./handler"; // from user
import buildContext from "./buildContext.json"; // details we know like projectId
import { getContext } from "./getContext"; // create all the helpers that go in context
  
addEventListener("fetch", async (event) => {
    console.log("handler", handler);
    const context = await getContext(event, buildContext);
    event.respondWith(handler(event, context));
});
`;

  fs.writeFileSync("/src/entry.js", entry, "utf-8");

  compiler.inputFileSystem = fs;
  compiler.outputFileSystem = fs;
  compiler.resolvers.normal.fileSystem = fs;
  compiler.resolvers.context.fileSystem = fs;

  const finalScript = await new Promise<string>((res, rej) => {
    compiler.outputFileSystem = {
      // send output into the void
      mkdirp: (path: string, callback: Function) => {
        callback();
      },
      join: () => {}
    };
    compiler.run((err: any, stats: any) => {
      if (err) rej(err);
      const result = stats.compilation.assets["worker.js"].source();
      res(result);
    });
  });

  return finalScript;
};
