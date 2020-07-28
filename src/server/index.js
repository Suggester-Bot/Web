require("dotenv").config();

const port = process.env.PORT || 3000;

const express = require("express");

const app = express();

if (process.env.NODE_ENV === "development") {
	const webpack = require("webpack");
	const webpackDevMiddleware = require("webpack-dev-middleware");
	const webpackHotMiddleware = require("webpack-hot-middleware");
	const webpackConfig = require("../../webpack.config.js");

	const compiler = webpack(webpackConfig);

	app.use(webpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath
	}));
	app.use(webpackHotMiddleware(compiler));
}


app.use(express.static("dist"));

app.listen(port, () => console.log(`Listening on port ${port}!`));
