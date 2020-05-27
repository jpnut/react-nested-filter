const multi = require('@rollup/plugin-multi-entry');
const path = require('path');
const sass = require('rollup-plugin-sass');

// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    config.input = [config.input, path.resolve('src', 'styles.scss')];

    config.plugins.push(multi());
    config.plugins.push(sass({ output: path.resolve('dist', 'styles.css') }));

    return config; // always return a config.
  },
};
