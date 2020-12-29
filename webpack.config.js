const path = require("path");
const outDir = path.join(__dirname, "dist");

const { EnvironmentPlugin, HotModuleReplacementPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = env => {
	const isDev = env === "development";

	return {
		resolve: { extensions: [".tsx", ".ts", ".js", ".jsx", ".json"] },
		entry: ["babel-polyfill", isDev && "webpack-hot-middleware/client", "./src/client/index.tsx"].filter(Boolean),
		mode: isDev ? "development" : "production",
		output: {
			path: outDir,
			publicPath: "/",
		},
		module: {
			rules: [
				{
					test: /\.[jt]sx?$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: [
								"@babel/preset-env",
								["@babel/preset-react", { runtime: "automatic", development: isDev }],
								"@babel/preset-typescript"
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
		plugins: [
			new ForkTsCheckerWebpackPlugin(),
			new EnvironmentPlugin({
				NODE_ENV: isDev ? "development" : "production",
			}),
			new HotModuleReplacementPlugin(),
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
