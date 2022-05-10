'use strict';

const paths = require('../config/paths');
const appPackageJson = require(paths.appPackageJson);
const bpkReactScriptsConfig = appPackageJson['backpack-react-scripts'] || {};

module.exports = isEnvDevelopment => {
  // Automatically split vendor and commons
  // https://twitter.com/wSokra/status/969633336732905474
  // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
  return {
    splitChunks: bpkReactScriptsConfig.enableAutomaticChunking
      ? isEnvDevelopment
        ? {
            chunks: 'all',
            cacheGroups: bpkReactScriptsConfig.vendorsChunkRegex
              ? {
                  defaultVendors: {
                    test: new RegExp(bpkReactScriptsConfig.vendorsChunkRegex),
                  },
                }
              : {},
          }
        : {
            chunks: 'all',
            name: false,
            cacheGroups: bpkReactScriptsConfig.vendorsChunkRegex
              ? {
                  defaultVendors: {
                    test: new RegExp(bpkReactScriptsConfig.vendorsChunkRegex),
                  },
                }
              : {},
          }
      : {},
  };
};
