require("dotenv").config();

const port = process.env.PORT || 3000;

const express = require("express");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);
const helmet = require("helmet");

const discordAuthMiddleware = require("./discordAuth.js");

const app = express();
app.use(helmet());

app.use(expressSession({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	// TODO: configure secure cookies in production
	// cookie: { secure: process.env.NODE_ENV === "production" },
	store: new MongoStore({ url: process.env.SESSION_MONGO_URI })
}));

app.use(discordAuthMiddleware);

if (process.env.NODE_ENV === "development") {
	const webpack = require("webpack");
	const webpackDevMiddleware = require("webpack-dev-middleware");
	const webpackHotMiddleware = require("webpack-hot-middleware");
	const webpackConfig = require("../../webpack.config.js")();

	const compiler = webpack(webpackConfig);

	app.use(webpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath
	}));
	app.use(webpackHotMiddleware(compiler));
}

app.get("/api/user", (req, res) => {
	res.send(req.session.discordUser);
});

app.use(express.static("dist"));

app.listen(port, () => console.log(`Listening on port ${port}!`));
