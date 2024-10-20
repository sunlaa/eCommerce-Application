import * as path from 'path';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import DotenvWebpackPlugin from 'dotenv-webpack';
import { type Configuration } from 'webpack';

import * as ProdConfig from './webpack.prod.config';
import * as DevConfig from './webpack.dev.config';

const baseConfig: Configuration = {
  entry: path.resolve(__dirname, './src/index.ts'),
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|mp4|webm)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.json'],
  },
  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, './dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      favicon: path.resolve(__dirname, './src/assets/favicon.png'),
    }),
    new CleanWebpackPlugin(),
    new DotenvWebpackPlugin(),
  ],
  devServer: {
    historyApiFallback: {
      index: '/',
    },
  },
};

interface ModeEnv {
  mode: 'prod' | 'dev';
}

export default ({ mode }: ModeEnv): Configuration => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode ? ProdConfig.default : DevConfig.default;

  return merge(baseConfig, envConfig);
};
