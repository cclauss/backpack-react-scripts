'use strict';

module.exports = (isEnvDevelopment) => {
  const paths = require('../../config/paths');
  const appPackageJson = require(paths.appPackageJson);
  const bpkReactScriptsConfig = appPackageJson['backpack-react-scripts'] || {};

  // Automatically split vendor and commons
  // https://twitter.com/wSokra/status/969633336732905474
  // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
  // splitChunks: {
  //   chunks: 'all',
  //   name: false,
  // },
  //return {}
  return {
    splitChunks: bpkReactScriptsConfig.enableAutomaticChunking
      ? {
        chunks: 'all',
        name: isEnvDevelopment,
        cacheGroups: bpkReactScriptsConfig.vendorsChunkRegex
          ? {
            vendors: {
              test: new RegExp(bpkReactScriptsConfig.vendorsChunkRegex),
            },
          }
          : {},
      }
      : {}
  }
}

//export const getSplitChunksConfig;