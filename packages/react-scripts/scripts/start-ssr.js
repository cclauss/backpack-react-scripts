// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');
// @remove-on-eject-begin
// Do the preflight check (only happens before eject).
const verifyPackageTree = require('./utils/verifyPackageTree');
if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
  verifyPackageTree();
}
const verifyTypeScriptSetup = require('./utils/verifyTypeScriptSetup');
verifyTypeScriptSetup();
// @remove-on-eject-end

const fs = require('fs');
const webpack = require('webpack');
const {
  createCompiler,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config.ssr');

const statusFile = require('./utils/statusFile');

const useYarn = fs.existsSync(paths.yarnLockFile);

const port = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const config = configFactory('development');
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const appName = require(paths.appPackageJson).name;

const useTypeScript = fs.existsSync(paths.appTsConfig);
const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
const urls = prepareUrls(
  protocol,
  HOST,
  port,
  paths.publicUrlOrPath.slice(0, -1)
);

const createCompilerOpts = ;

const compiler = createCompiler({
  appName,
  config,
  devSocket: undefined,
  urls,
  useYarn,
  useTypeScript,
  tscCompileOnError,
  webpack,
});

statusFile.init(compiler, paths.appBuildSsr);

compiler.watch(
  {
    ignored: ['node_modules'],
  },
  (err) => {
    if (err) {
      console.log(err.message || err);
      process.exit(1);
    }

    statusFile.done(paths.appBuildSsr);
  }
);
