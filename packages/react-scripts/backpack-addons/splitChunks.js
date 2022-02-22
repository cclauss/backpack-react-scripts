'use strict';

const paths = require('../config/paths');
const appPackageJson = require(paths.appPackageJson);
const bpkReactScriptsConfig = appPackageJson['backpack-react-scripts'] || {};

module.exports = (isEnvDevelopment) => {
  return {
    splitChunks: bpkReactScriptsConfig.enableAutomaticChunking
    ? {
      chunks: 'all',
      name: isEnvDevelopment,
      cacheGroups: bpkReactScriptsConfig.vendorsChunkRegex
        ? {
            vendors: {
              test: new RegExp(bpkReactScriptsConfig.vendorsChunkRegex),
              name: 'vendor'
            },
          }
        : {},
      }
    : {}
  }
};