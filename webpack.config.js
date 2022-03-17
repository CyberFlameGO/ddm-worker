const path = require('path');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: path.join(__dirname, 'src', 'index.ts'),
  output: {
    filename: 'worker.js',
    path: path.join(__dirname, 'build'),
  },
  devtool: module.exports.mode === 'development' && 'inline-source-map',
  mode: ['prod', 'production'].includes(process.env.NODE_ENV)
    ? 'production'
    : 'development',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
};
