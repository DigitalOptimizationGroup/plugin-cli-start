var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: { getAppContext: path.join(__dirname, "./src/get-build-context.ts") },
  output: {
    path: path.join(__dirname, "./scripts"),
    libraryTarget: "commonjs2"
  },
  target: "webworker",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              compilerOptions: {
                target: "ES2017",
                module: "esnext",
                moduleResolution: "node",
                removeComments: true
              }
            }
          }
        ],

        //"ts-loader",
        exclude: /node_modules/
      }
    ]
  }
};
