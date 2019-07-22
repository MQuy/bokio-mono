const fs = require("fs");
const paths = require("./paths");
const templateContent = fs.readFileSync(paths.appHtml, "utf8");
const createWebpackConfig = require(paths.webpackBaseConfig);

const webpackConfig = createWebpackConfig({ paths, templateContent });

// modify webpack config if you need

module.exports = webpackConfig;
