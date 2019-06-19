const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const paths = require("./paths");
const templateContent = fs.readFileSync(paths.appHtml, "utf8");

module.exports = {
  devtool: "source-map",
  entry: {
    app: paths.appIndexTs,
  },
  output: {
    path: paths.appBuild,
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
  },

  devServer: {
    writeToDisk: true,
    liveReload: false,
    stats: {
      colors: true,
      entrypoints: true,
      assets: false,
      modules: false,
      children: false,
      hash: false,
      moduleTrace: false,
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        include: [paths.appSrc, ...paths.packages],
        options: { projectReferences: true },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [new HtmlWebpackPlugin({ templateContent, inject: "body" })],
};
