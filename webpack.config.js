const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Подключили к проекту плагин
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: { main: './src/index.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [{   
                    test: /\.js$/, 
                    use: { loader: 'babel-loader' },
                    exclude: /node_modules/ 
                },
                {
                    test: /\.css$/i, 
                    use: [
                        (isDev ? 'style-loader' : MiniCssExtractPlugin.loader),
                        'css-loader', 
                        'postcss-loader'
                    ] 
                },
                {
                    test: /\.(gif|png|jpe?g|ico|svg)$/i,
                    use: [
                        'file-loader?name=./images/[name].[ext]', 
                        {
                          loader: 'image-webpack-loader',
                          options: {
                              bypassOnDebug: true,
                              disable: true,
                          },
                        },
                      ],
                },
                {
                    test: /\.(eot|ttf|woff|woff2)$/,
                    loader: 'file-loader?name=./vendor/[name].[ext]'
                }
               ]
        },
        plugins: [ 
            
            new MiniCssExtractPlugin({filename: 'index.[contenthash].css'}),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                        preset: ['default'],
                },
                canPrint: true
        }),
            new HtmlWebpackPlugin({
                inject: false, 
                template: './src/index.html', 
                filename: 'index.html'
              }),
            new WebpackMd5Hash(),
            new webpack.DefinePlugin({
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'URL': JSON.stringify(isDev ? 'http://nomoreparties.co' : 'https://nomoreparties.co')
                }),
                
            new webpack.SourceMapDevToolPlugin({}),
            ],
            devtool: false,
            
};