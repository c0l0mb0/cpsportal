const path = require('path');

module.exports = {
    mode: 'development',
    watch: true,

    entry: {
        cps_portal: path.resolve(__dirname, './resources/js/cps_portal_table/app.js'),
        cps_test: path.resolve(__dirname, './resources/js/cps_test/app.js'),
        cps_warehouse: path.resolve(__dirname, './resources/js/cps_warehouse/app.js'),
    },
    output: {
        path: path.resolve(__dirname, './public/js/app'),
        filename: (pathData) => {
            // Return different output paths based on the entry name
            console.log(pathData);
            if (pathData.chunk.name === 'cps_portal') {
                return 'cps_portal/[name].[contenthash].js';
            }
            if (pathData.chunk.name === 'cps_test') {
                return 'cps_test/[name].[contenthash].js';
            }
            if (pathData.chunk.name === 'cps_warehouse') {
                return 'cps_warehouse/[name].[contenthash].js';
            }
        },
        clean: true,

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
