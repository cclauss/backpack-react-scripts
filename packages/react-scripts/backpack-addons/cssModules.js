"use strict";

const postcssNormalize = require("postcss-normalize");
const paths = require("../config/paths");
const appPackageJson = require(paths.appPackageJson);
const bpkReactScriptsConfig = appPackageJson["backpack-react-scripts"] || {};
const cssModulesEnabled = bpkReactScriptsConfig.cssModules !== false;

// Backpack / saddlebag node module regexes
const backpackModulesRegex = /node_modules[\\/]bpk-/;
const scopedBackpackModulesRegex = /node_modules[\\/]@skyscanner[\\/]bpk-/;

const getStyleTestRegexes = (regexType) => {
  // style files regexes, the regex values should keep up to date with webpack.config.js
  const cssRegex = /\.css$/;
  const cssModuleRegex = /\.module\.css$/;
  const sassRegex = /\.(scss|sass)$/;
  const sassModuleRegex = /\.module\.(scss|sass)$/;

  switch (regexType) {
    case "css":
      return {
        and: [cssRegex, () => !cssModulesEnabled],
        exclude: [backpackModulesRegex, scopedBackpackModulesRegex],
      };
    case "cssModule":
      return [
        cssModuleRegex,
        {
          and: [cssRegex, () => cssModulesEnabled],
        },
        {
          and: [cssRegex, backpackModulesRegex, scopedBackpackModulesRegex],
        },
      ];
    case "sass":
      return {
        and: [sassRegex, () => !cssModulesEnabled],
        exclude: [backpackModulesRegex, scopedBackpackModulesRegex],
      };
    case "sassModule":
      return [
        sassModuleRegex,
        {
          and: [sassRegex, () => cssModulesEnabled],
        },
        {
          and: [sassRegex, backpackModulesRegex, scopedBackpackModulesRegex],
        },
      ];
    default:
      throw new Error("Not implemented.");
  }
};

const modifyPostCssOption = () => {
  return {
    // Necessary for external CSS imports to work
    // https://github.com/facebook/create-react-app/issues/2677
    ident: "postcss",
    plugins: () => [
      require("postcss-flexbugs-fixes"),
      require("postcss-preset-env")({
        autoprefixer: {
          flexbox: "no-2009",
        },
        stage: 3,
      }),
      // Adds PostCSS Normalize as the reset css with default options,
      // so that it honors browserslist config in package.json
      // which in turn let's users customize the target behavior as per their needs.
      postcssNormalize(),
    ],
  };
};

const getCSSModuleLocalIdent = () => {
    return (
        require('../utils/getCSSModuleLocalIdentWithProjectName')(
            appPackageJson.name
        )
    )
}

module.exports = {
  getStyleTestRegexes,
  modifyPostCssOption,
  getCSSModuleLocalIdent
};
