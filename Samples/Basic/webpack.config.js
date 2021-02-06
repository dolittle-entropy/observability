/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = () => ({
    mode: 'development',
    entry: './index.tsx',
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        plugins: [new TsconfigPathsPlugin({
            configFile: 'tsconfig.json',
        })],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    configFile: 'tsconfig.json',
                },
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    output: {
        path: __dirname+'/Build',
        filename: 'bundle.js',
        pathinfo: false,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
    ],
    optimization: {
        minimize: false,
    },
    performance: {
        hints: false,
    },
    devServer: {
        host: '0.0.0.0',
        proxy: {
            '/api/prom/': {
                target: 'http://localhost:8090',
                headers:  { 'X-Scope-OrgId': 'system' },
            },
            '/loki/api/': {
                target: 'http://localhost:8091',
                headers:  { 'X-Scope-OrgId': 'system' },
            },
            '/loki/api/v1/tail': {
                target: 'http://localhost:8092',
                headers:  { 'X-Scope-OrgId': 'system' },
                ws: true,
            },
        }
    },
    devtool: false,
});
