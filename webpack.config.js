const path = require("path");

const { ProgressPlugin, HotModuleReplacementPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const clientDist = path.join(__dirname, "client", "dist");

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "development") {
	console.log("The NODE_ENV enviornment variable must be set to either \"production\" or \"development\"");
}

const isDev = process.env.NODE_ENV === "development";

const postcssOptions = {
	plugins: [
		["autoprefixer", {}],
		!isDev && ["cssnano", { preset: "default" }]
	].filter(Boolean)
};

module.exports = {
	entry: ["babel-polyfill", isDev && "webpack-hot-middleware/client", "./src/client/index.tsx"].filter(Boolean),
	context: __dirname,
	resolve: { extensions: [".tsx", ".ts", ".js", ".jsx", ".json"] },
	mode: isDev ? "development" : "production",
	output: {
		path: clientDist,
		publicPath: "/",
	},
	devtool: isDev ? "eval-source-map" : false,
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							["@babel/preset-env", { useBuiltIns: "usage", corejs: "3.15.0", browserslistEnv: isDev ? "development" : "production" }],
							["@babel/preset-react", { runtime: "automatic", development: isDev }],
							"@babel/preset-typescript"
						],
						plugins: isDev ? ["react-refresh/babel"] : []
					}
				}
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							importLoaders: 2,
							modules: {
								auto: /(?<!\.(?:global|min))\.s?css$/,
								exportLocalsConvention: "dashesOnly",
								localIdentName: "[local]-[hash:base64:10]"
							}
						},
					},
					{
						loader: "postcss-loader",
						options: { postcssOptions }
					},
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
					{
						loader: "postcss-loader",
						options: { postcssOptions }
					}
				]
			},
			{
				test: /\.(?:png|woff|woff2|eot|ttf|svg)$/,
				use: { loader: "file-loader" }
			}
		]
	},
	plugins: [
		new ProgressPlugin(),
		new ForkTsCheckerWebpackPlugin({ eslint: { files: "./src/client/**/*.{ts,tsx,js,jsx}" } }),
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
