var webpack = require("./webpack.config.js");

module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],

        frameworks: ['jasmine'],

        files: [
            './src/index.ts',
            './tests/**/*.spec.ts'
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
            './src/index.ts': ['webpack'],
            './tests/**/*.spec.ts': ['webpack'] //, 'sourcemap'
        },

        reporters: ['progress']
    });
};