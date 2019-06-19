const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appBuild: resolveApp("build"),
  appIndexTs: resolveApp("src/index.tsx"),
  appContext: appDirectory,
  appHtml: require.resolve("@mono/assets/index.html"),
  nodeModules: resolveApp("./node_modules"),
  appSrc: resolveApp("src"),
  packages: ["element"].map(name => resolveApp(`../../packages/${name}`)),
};
