var path = require('path');
var webpack = require('webpack');

var config = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        './static/app.js'
    ],
    output: {
        path: path.join(__dirname, 'static/dist'),
        filename: 'bundle.js',
        publicPath: '/static/dist/'
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/
            }
        ]
    }
};

module.exports = config;
