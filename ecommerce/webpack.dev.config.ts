import * as path from 'path';
import { type Configuration as WebpackConfiguration } from 'webpack';
import 'webpack-dev-server';

const Config: WebpackConfiguration = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, './dist'),
    },
  },
};

export default Config;
