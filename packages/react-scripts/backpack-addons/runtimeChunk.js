'use strict';

const paths = require('../config/paths');
const appPackageJson = require(paths.appPackageJson);
const bpkReactScriptsConfig = appPackageJson['backpack-react-scripts'] || {};

function runtimeChunk(buildType) {
  if (buildType === 'ssr') {
    return {
      runtimeChunk: false,
    }
  }

  return { 
    runtimeChunk: bpkReactScriptsConfig.enableAutomaticChunking
    ? {
      name: entrypoint => `runtime-${entrypoint.name}`,
    }
    : false
  }
}

module.exports = runtimeChunk;