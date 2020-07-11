/* eslint @typescript-eslint/no-var-requires: 0 */
const path = require('path');
require('dotenv').config();

const webpackConfig = {
  resolve: {
    alias: {
      '*': path.resolve(__dirname),
    },
  },
};

module.exports = {
  env: {
    // Reference a variable that was defined in the .env file and make it available at Build Time
    TEST_VAR: process.env.TEST_VAR,
  },
  webpack: (baseConfig) => {
    const config = baseConfig;
    config.resolve.alias = {
      ...config.resolve.alias,
      ...webpackConfig.resolve.alias,
    };
    return config;
  },
};
