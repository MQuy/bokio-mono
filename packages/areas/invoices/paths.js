const path = require("path");
const fs = require("fs");

const rootDirectory = path.join(__dirname, "../../../");
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appContext: appDirectory,
  appBuild: resolveApp("build"),
  appIndexTs: resolveApp("src/index.tsx"),
  appHtml: require.resolve("@mono/assets/index.html"),
  nodeModules: resolveApp("node_modules"),
  appSrc: resolveApp("src"),
  packages: ["elements"].map(name => path.join(rootDirectory, "packages/core", name)),
  webpackBaseConfig: path.join(rootDirectory, "config", "webpack.config.js"),
};
