const webpack = require('webpack');
const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const entryCommonPath = './public/javascripts';
var webpackConfig = {
    entry: [
       __dirname+'/src/index.js',
    ],
    output: {
        filename: 'node-mock.js',
        path: path.resolve(__dirname+'/dist'),
    },
    target:'node',
    externals: {},
    resolve: {
        extensions: [".js"],
    },
    module:{
        // loaders: [
        //     {test: /\.js$/, loader: 'babel-loader'}
        // ]
    },
    plugins:[
        new CleanWebpackPlugin(['./dist']),
    ],
    devtool: 'inline-source-map',
};

module.exports = webpackConfig;