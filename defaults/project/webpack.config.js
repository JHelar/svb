const path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const baseConfig = {
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        modules: [
            path.resolve(__dirname, './dist'), 'node_modules'
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                },
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                  'style-loader',
                  'css-loader'
                ]
              }
        ]
    },
    plugins: [
        new UglifyJsPlugin(),
        new VueLoaderPlugin()
    ],
    mode: process.env.NODE_ENV || 'development'
};

const main = {
	...baseConfig,
	entry: {
        main: `./src/client/main.js`
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './dist/client')
    }
}

// Return Array of Configurations.
module.exports = [
    main
];