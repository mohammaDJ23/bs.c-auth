const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv').config({
  path: path.resolve(__dirname, '../.env.development'),
});
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html', favicon: './public/app-icon_256.png' }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed),
    }),
  ],
  devServer: {
    port: process.env.PORT,
    historyApiFallback: true,
    client: {
      overlay: false,
    },
  },
  output: {
    publicPath: process.env.AUTH_APP + process.env.AUTH_PUBLIC_PATH,
  },
});
