import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import { Configuration } from 'webpack';


const config: Configuration = {
    mode: 'development',
    context: resolve(__dirname, 'src'),
    entry: {
        render: './render/index.tsx',
    },
    target: 'electron-renderer',
    output: {
        path: resolve(__dirname, 'dist', 'render'),
        filename: '[name].[hash].build.js',
        clean: true,
    },
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'babel-loader', exclude: '/node_modules/' },
            { test: /\.jsx?$/, use: 'babel-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Snu',
        }),
    ],
    devtool: 'source-map'
};

export default config;