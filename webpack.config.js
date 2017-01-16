const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: [
    'babel-polyfill',
    './src/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: './dist'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0', 'react'],
          },
        },
        exclude: /node_modules/,
        parser: {
          'babel': true,
        },

      },
      {
        test: /vendor\/.+\.(jsx|js)$/,
        loader: 'imports?jQuery=jquery,$=jquery,this=>window',
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
      { test: /\.svg$/,
        loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=assets/fonts/[name].[ext]'
      },
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        context: './public/',
        from: '**',
        to: './',
      },
    ])
  ],
};
