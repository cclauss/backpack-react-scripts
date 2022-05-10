'use strict';

const paths = require('../config/paths');
const appPackageJson = require(paths.appPackageJson);
const bpkReactScriptsConfig = appPackageJson['backpack-react-scripts'] || {};

const chunksAndGroups = {
  chunks: 'all',
  cacheGroups: bpkReactScriptsConfig.vendorsChunkRegex
    ? {
        defaultVendors: {
          test: new RegExp(bpkReactScriptsConfig.vendorsChunkRegex),
        },
      }
    : {},
};

module.exports = (isEnvDevelopment) => {
  // Automatically split vendor and commons
  // https://twitter.com/wSokra/status/969633336732905474
  // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
  if(!bpkReactScriptsConfig.enableAutomaticChunking){
    return {
      splitChunks: {},
    };
  }
  
  if(isEnvDevelopment) {
    return {
      splitChunks: {
        ...chunksAndGroups,
      },
    };
  }
  
  return {
    splitChunks: {
      ...chunksAndGroups,
      name: false,
    },
  };
};
