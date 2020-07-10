const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const HtmlPlugin = require('html-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');

const workboxPlugin = require('workbox-webpack-plugin');

module.exports = (_, argv) => {
  const isDevelopment = argv.mode !== 'production';
  const isProduction = argv.mode === 'production';

  return {
    mode: argv.mode || 'development',

    entry: {
      index: './src/index.js',
      room: './src/room.js',
    },

    plugins: [
      new HtmlPlugin({
        chunks: ['index'],
        filename: 'index.html',
        template: './src/pages/index.html',
      }),
      new HtmlPlugin({
        chunks: ['room'],
        filename: 'room.html',
        template: './src/pages/room.html',
      }),
      new webpack.ProgressPlugin(),
      new MiniCssExtractPlugin({ filename: 'main.[chunkhash].css' }),
      new workboxPlugin.GenerateSW({
        swDest: 'sw.js',
        clientsClaim: true,
        skipWaiting: false,
      }),
    ],

    module: {
      rules: [
        {
          test: /.(js|jsx)$/,
          include: [path.resolve(__dirname, 'src')],
          loader: 'babel-loader',
        },
        {
          test: /.(scss|css)$/,

          use: [
            isProduction && {
              loader: MiniCssExtractPlugin.loader,
            },
            isDevelopment && {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',

              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',

              options: {
                sourceMap: true,
              },
            },
          ].filter(Boolean),
        },
      ],
    },

    optimization: {
      minimizer: [new TerserPlugin()],

      splitChunks: {
        cacheGroups: {
          vendors: {
            priority: -10,
            test: /[\\/]node_modules[\\/]/,
          },
        },

        chunks: 'async',
        minChunks: 1,
        minSize: 30000,
        name: true,
      },
    },
  };
};
