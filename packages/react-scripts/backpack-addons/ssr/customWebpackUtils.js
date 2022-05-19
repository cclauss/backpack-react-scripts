'use strict';

const chalk = require('chalk');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const forkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');

/**
 * We set this to true so that we always call ui.clear() - we check for a TTY
 * inside {@link MultiCompilerUi}.
 */
const isInteractive = true;

/**
 * This function overrides react-dev-utils/WebpackDevServerUtils.createCompiler.
 * The original function directly manages console output, which doesn't work
 * when running multiple compilers at once. This function accepts a
 * {@link CompilerUi} instance and sends any output messages to it.
 *
 * It is a copy-paste of the source with the following references replaced:
 *
 * - console.log() -> ui.log()
 * - clearConsole() -> ui.clear()
 * - printInstructions() -> ui.printInstructions()
 *
 * To update this function in the future when CRA changes, just copy the original
 * here and make the updates above.
 *
 * @param {CompilerUi} ui
 * @param {Object} config - The same config object passed to CRA's createCompiler
 * @returns {*} - A Webpack compiler
 */
function createCustomCompiler(
  ui,
  { appName, config, urls, useYarn, useTypeScript, webpack }
) {
  // "Compiler" is a low-level interface to webpack.
  // It lets us listen to some events and provide our own custom messages.
  let compiler;
  try {
    compiler = webpack(config);
  } catch (err) {
    ui.log(chalk.red('Failed to compile.'));
    ui.log();
    ui.log(err.message || err);
    ui.log();
    process.exit(1);
  }

  // "invalid" event fires when you have changed a file, and webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.hooks.invalid.tap('invalid', () => {
    if (isInteractive) {
      ui.clear();
    }
    ui.log('Compiling...');
  });

  let isFirstCompile = true;

  if (useTypeScript) {
    forkTsCheckerWebpackPlugin
      .getCompilerHooks(compiler)
      .waiting.tap('awaitingTypeScriptCheck', () => {
        ui.log(
          chalk.yellow(
            'Files successfully emitted, waiting for typecheck results...'
          )
        );
      });
  }

  // "done" event fires when webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.hooks.done.tap('done', async stats => {
    if (isInteractive) {
      ui.clear();
    }

    // We have switched off the default webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    // We only construct the warnings and errors for speed:
    // https://github.com/facebook/create-react-app/issues/4492#issuecomment-421959548
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
    });

    const messages = formatWebpackMessages(statsData);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    if (isSuccessful) {
      ui.log(chalk.green('Compiled successfully!'));
    }
    if (isSuccessful && (isInteractive || isFirstCompile)) {
      ui.printInstructions(appName, urls, useYarn);
    }
    isFirstCompile = false;

    // If errors exist, only show errors.
    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      ui.log(chalk.red('Failed to compile.\n'));
      ui.log(messages.errors.join('\n\n'));
      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      ui.log(chalk.yellow('Compiled with warnings.\n'));
      ui.log(messages.warnings.join('\n\n'));

      // Teach some ESLint tricks.
      ui.log(
        '\nSearch for the ' +
          chalk.underline(chalk.yellow('keywords')) +
          ' to learn more about each warning.'
      );
      ui.log(
        'To ignore, add ' +
          chalk.cyan('// eslint-disable-next-line') +
          ' to the line before.\n'
      );
    }
  });

  return compiler;
}

module.exports = {
  createCustomCompiler,
};
