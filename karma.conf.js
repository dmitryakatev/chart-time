var webpack = require("./webpack.config.js");

module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],

        frameworks: ['jasmine'],

        files: [
            './src/ChartTime.ts',
            './src/**/*.spec.ts'
        ],
        
        mime: {
            'text/x-typescript': ['ts'],
            'text/plain' : ['mytxt']
        },

        webpack: {
            devtool: 'inline-source-map',
            resolve: webpack.resolve,
            module: webpack.module,
            plugins: webpack.plugins
        },

        preprocessors: {
            './src/ChartTime.ts': ['webpack'],
            './src/**/*.spec.ts': ['webpack'] //, 'sourcemap'
        },

        reporters: ['progress']
    });
};