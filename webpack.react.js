/* eslint-disable */
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const path = require('path');

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
    entry: './client/index.tsx',
    module: {
        rules: [
            {
				test: /\.tsx$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						},
					}
				],
			},
            {
                test: /\.css$/i,
                use: 'css-loader',
            }
        ],
    },
    mode: 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
});