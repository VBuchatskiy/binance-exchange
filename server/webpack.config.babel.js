import externals from 'webpack-node-externals'
import nodemon from 'nodemon-webpack-plugin'
import { resolve } from 'path'

const paths = {
  entrys: {
    root: resolve(__dirname),
    src: resolve(__dirname, 'src'),
    server: resolve(__dirname, 'src', 'app.js')
  },
  output: resolve(__dirname, 'build')
}

export default {
  mode: 'development',
  externals: externals(),
  target: 'node',
  entry: {
    server: paths.entrys.server
  },
  output: {
    filename: '[name].js',
    path: paths.output
  },
  resolve: {
    modules: [paths.entrys.root, 'node_modules'],
    extensions: ['.js', '.json'],
    alias: {
      '@': paths.entrys.root,
      '@@': paths.entrys.src
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'eslint-loader'
          }]
      }
    ]
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  stats: {
    colors: true,
    env: true
  },
  plugins: [
    new nodemon()
  ]
}