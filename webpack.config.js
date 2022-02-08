const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {DefinePlugin}  = require('webpack');

module.exports = (env, argv) => {
    const isDev = argv.mode === 'development';
    return {
        entry: {
            index: isDev ? './example/index.ts' : './src/index.ts'
        },
        output: {
            library: {
                name: 'ConsoleASCII',
                type: 'umd'
            },
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        devtool: 'source-map',
        devServer: {
            static: './dist'
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: {
                        loader: 'ts-loader',
                        options: {configFile: isDev ? 'tsconfig.json' : 'tsconfig.build.json'},
                    },
                    exclude: /node_modules/,
                },
            ]
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        plugins: [
            new HtmlWebpackPlugin({
                // template: path.resolve(__dirname, 'index.html'),
                // scriptLoading: 'blocking'
                title: 'console-ascii'
            }),
            new DefinePlugin({
                DEBUG: isDev
            })
        ]
    };
};