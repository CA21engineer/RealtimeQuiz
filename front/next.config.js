/* eslint @typescript-eslint/no-var-requires: 0 */
const path = require('path');
const withSass = require('@zeit/next-sass');

require('dotenv').config();

const webpackConfig = {
  resolve: {
    alias: {
      '*': path.resolve(__dirname),
    },
  },
};

const config = {
  env: {
    // Reference a variable that was defined in the .env file and make it available at Build Time
    TEST_VAR: process.env.TEST_VAR,
  },
  webpack: (baseConfig) => {
    const newConfig = baseConfig;
    newConfig.resolve.alias = {
      ...newConfig.resolve.alias,
      ...webpackConfig.resolve.alias,
    };
    return newConfig;
  },
};

const mergeEnhancer = (...plugins) => {
  const configWithPlugins = plugins.reduce((acc, plugin) => {
    return plugin(acc);
  }, config);

  return configWithPlugins;
};

module.exports = mergeEnhancer(withSass);
