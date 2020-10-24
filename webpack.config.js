const path = require("path");
const outDir = path.join(__dirname, "dist");

const { EnvironmentPlugin, HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = env => {
	const isDev = env === "development";

	return {
		entry: ["babel-polyfill", isDev && "webpack-hot-middleware/client", "./src/client/index.js"].filter(Boolean),
		mode: isDev ? "development" : "production",
		output: {
			path: outDir,
			publicPath: "/",
		},
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: [
								"@babel/preset-env",
								"@babel/preset-react"
							],
							plugins: [
								"@babel/plugin-proposal-class-properties",
								isDev && require.resolve("react-refresh/babel")
							].filter(Boolean)
						}
					}
				},
				{
					test: /\.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: "css-loader",
							options: { importLoaders: 2, modules: {
								auto: /(?<!\.(?:global|min))\.s?css$/,
								exportLocalsConvention: "dashesOnly",
								localIdentName: "[local]-[hash:base64:10]"
							} },
						},
						"postcss-loader",
						"sass-loader"
					]
				},
				{
					test: /\.css$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: "css-loader",
							options: { importLoaders: 1 },
						},
						"postcss-loader"
					]
				},
				{
					test: /\.(?:png|woff|woff2|eot|ttf|svg)$/,
					use: { loader: "file-loader" }

				}
			]
		},
		resolve: { extensions: ["*", ".js", ".jsx"] },
		plugins: [
			new EnvironmentPlugin({
				NODE_ENV: isDev ? "development" : "production",
			}),
			new HotModuleReplacementPlugin(),
			new NoEmitOnErrorsPlugin(),

			new CleanWebpackPlugin(),
			new HtmlWebpackPlugin({
				template: path.join(__dirname, "src", "client", "index.html")
			}),
			new MiniCssExtractPlugin({
				filename: "[name].css",
				chunkFilename: "[id].css",
			}),
			isDev && new ReactRefreshWebpackPlugin(),
		].filter(Boolean)
	};
};
