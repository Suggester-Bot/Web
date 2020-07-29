require("dotenv").config();

const path = require("path");
const outDir = path.join(__dirname, "dist");

const { EnvironmentPlugin, HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
	entry: ["babel-polyfill", isDev && "webpack-hot-middleware/client", "./src/client/index.js"].filter(Boolean),
	mode: process.env.NODE_ENV,
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
				test: /\.css$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: { importLoaders: 1, modules: { auto: true, exportLocalsConvention: "dashesOnly" } },
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
	resolve: {
		extensions: ["*", ".js", ".jsx"]
	},
	plugins: [
		new EnvironmentPlugin(["NODE_ENV"]),
		new HotModuleReplacementPlugin(),
		new NoEmitOnErrorsPlugin(),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "src", "public", "index.html")
		}),
		isDev && new ReactRefreshWebpackPlugin(),
	].filter(Boolean)
};
