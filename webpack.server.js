/* eslint-disable */
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const dotenv = require('dotenv-webpack');
const path = require('path');

const {
	NODE_ENV = 'production',
} = process.env;

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
	entry: './src/server.ts',
	mode: NODE_ENV,
	target: 'node',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'server.js',
		pathinfo: false,
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /client/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						},
					}
				],
			}
		]
	},
	externals: [nodeExternals()],
	plugins: [new dotenv()],
});
