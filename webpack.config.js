const path = require('path');

module.exports = {
    mode: 'development',
    watch: true,

    entry: {
        cps_portal: path.resolve(__dirname, './resources/js/cps_portal_table/app.js'),
        cps_test: path.resolve(__dirname, './resources/js/cps_test/app.js'),
    },
    // output: {
    //     filename: '[name].[contenthash].js',
    //     environment: {
    //         arrowFunction: false,
    //     },
    //     clean: true,
    //     path: path.resolve(__dirname, './public/js/cps_table'),
    // },
    output: {
        path: path.resolve(__dirname, './public/js'),
        filename: (pathData) => {
            // Return different output paths based on the entry name
            console.log(pathData);
            if (pathData.chunk.name === 'cps_portal') {
                return 'cps_portal/[name].[contenthash].js'; // Output in dist/main folder
            }
            if (pathData.chunk.name === 'cps_test') {
                return 'cps_test/[name].[contenthash].js'; // Output in dist/admin folder
            }
            // return 'filename pathData error!';
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
