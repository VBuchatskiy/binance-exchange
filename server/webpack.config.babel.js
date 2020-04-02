// import tsconfig from './tsconfig'
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

const exclude = ['/node_modules/']

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
    mainFields: ['browser', 'module', 'main'],
    modules: [paths.entrys.root, 'node_modules'],
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@': paths.entrys.root,
      '@@': paths.entrys.src
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: exclude,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'eslint-loader'
          }]
      },
      {
        test: /\.ts$/,
        exclude: exclude,
        include: paths.entrys.src,
        use: [
          {
            loader: 'ts-loader'
          },
          {
            loader: 'babel-loader'
          },
          {
            loader: 'tslint-loader'
          }
        ]
      }

    ]
  },
  watch: true,
  watchOptions: {
    ignored: exclude
  },
  stats: {
    colors: true,
    env: true
  },
  plugins: [
    new nodemon()
  ]
}