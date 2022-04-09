import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import { Configuration } from 'webpack';


const config: Configuration = {
    mode: 'development',
    context: resolve(__dirname, 'src'),
    entry: './system/index.ts',
    target: 'electron-main',
    output: {
        path: resolve(__dirname, 'dist', 'system'),
        filename: '[name].build.js',
        clean: true,
    },
    module: {
        rules: [{ test: /\.ts?$/, use: 'ts-loader', exclude: '/node_modules/' }],
    },
    resolve: {
        extensions: ['.ts'],
    }
};

export default config;