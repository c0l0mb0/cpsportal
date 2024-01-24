const path = require('path');

module.exports = {
    mode: 'development',
    watch: true,

    entry: {
        cps_portal: path.resolve(__dirname, './resources/js/cps_portal_table/app.js'),
    },
    output: {
        filename: '[name].[contenthash].js',
        environment: {
            arrowFunction: false,
        },
        clean: true,
        path: path.resolve(__dirname, './public/js/cps_table'),
    },
    module: {
        rules: [
            {
                // test: /\.js$/,
                // loader: 'babel-loader',
                // exclude: /node_modules/,
                // options: {babelrc: true}
            }
        ]
    }

};
