/* global require, module, __dirname */

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      './styles/app.less',
      './js/index.jsx',
    ],
  },
  devServer: {
    public: 'test',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'js'),
        ],
        loader: 'babel-loader!eslint-loader',
      },
      {
        test: /\.(html|svg|ttf|png)$/,
        loader: 'file-loader?name=[name].[ext]',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.less$/,
        include: [
          path.resolve(__dirname, 'styles'),
        ],
        loader: 'style-loader!css-loader!autoprefixer-loader!less-loader',
      },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.jsx?$/,
      options: {
        eslint: {
          failOnWarning: true,
          failOnError: true,
        },
      },
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  stats: {
    colors: true,
  },
  devtool: 'source-map',
};
