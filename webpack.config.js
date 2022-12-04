const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const path = require("path");

module.exports = [
	{
		mode: 'development',
		entry: path.join(__dirname, './src/index.js'),
		target: 'web',
		output: {
			path: path.resolve(__dirname, "build"),
			filename: 'bundle.js'
		},
		module: {
			rules: [
				{
					test: /@?(georgesinatra).*\.(ts|js)x?$/,
					use: {
						loader: "babel-loader",
						options: {
							presets: [
								"@babel/preset-env",
								"@babel/preset-react",
								"@babel/preset-typescript",
							],
						},
					},
				},
				{
					test: /\.(tsx|jsx|js|ts)$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: [
								"@babel/preset-env",
								"@babel/preset-react",
								"@babel/preset-typescript",
							],
						},
					},
				},
				{
					test: /\.(sa|sc|c)ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{loader: "css-loader", options: {sourceMap: true}},
					],
				},
				{
					test: /\.(png|jpe?g|gif|svg|ico|pdf)$/i,
					use: [
						{
							loader: 'file-loader',
						},
					],
				},
			],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js', '.json', '.jsx'],
		},
		plugins: [
			new CopyPlugin({
				patterns: [{from: './src/assets', to: './src/assets'}]
			}),
			new MiniCssExtractPlugin({
				filename: 'css/index.css'
			}),
			new HtmlWebpackPlugin({
				template: './public/index.html',
			}),
		]
	}
]
