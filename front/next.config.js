/* eslint @typescript-eslint/no-var-requires: 0 */
const path = require('path');
const withSass = require('@zeit/next-sass');

require('dotenv').config();

const config = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    WS_BASE_URL: process.env.WS_BASE_URL,
  },
};

const mergeEnhancer = (...plugins) => {
  const configWithPlugins = plugins.reduce((acc, plugin) => {
    return plugin(acc);
  }, config);

  return configWithPlugins;
};

module.exports = mergeEnhancer(withSass);
