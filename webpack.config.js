'use strict';

var DEVELOPMENT = 'development';
var PRODUCTION = 'production';

var NODE_ENV = process.env.NODE_ENV === PRODUCTION ? PRODUCTION : DEVELOPMENT;

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var precss = require('precss');
var autoprefixer = require('autoprefixer');

const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
	entry: './src/index.ts',
	output: {
		filename: 'chart-time.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'ChartTime'
	},

	watch: NODE_ENV === DEVELOPMENT,
	devtool: NODE_ENV === DEVELOPMENT ? 'inline-source-map' : false,

	resolve: {
		extensions: ['.ts']
	},
	
	module: {
		rules: [{
			test: /\.ts$/,
			loader: 'awesome-typescript-loader'
		}, {
			test: /\.ts$/,
			enforce: 'pre',
			loader: 'tslint-loader',
			options: { }
		}, {
			test: /(\.less)|(\.css)$/i,
			loader: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [{
					loader: 'css-loader'
				}, {
					loader: 'postcss-loader?sourceMap',
					options: {
						plugins: function () {
							return [
								precss(),
								autoprefixer()
							];
						}
					}
				}, {
					loader: 'less-loader'
				}],
				publicPath: './'
			})
		}]
	},

	plugins: [
		new ExtractTextPlugin({
			filename: 'chart-time.css',
			disable: false,
			allChunks: true
		}),
		new CheckerPlugin()
	].concat(NODE_ENV === PRODUCTION ? [
		//production
	] : [
		//development
	])
};