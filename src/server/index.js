require("dotenv").config();

const port = process.env.PORT || 3000;

const express = require("express");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");

const discordAuthMiddleware = require("./discordAuth.js");

const isDev = process.env.NODE_ENV === "development";

const app = express();
app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			baseUri: ["'self'"],
			blockAllMixedContent: [],
			imgSrc: ["'self'", "'data:'"],
			objectSrc: ["'none'"],
			scriptSrc: ["'self'"].concat(isDev ? ["'unsafe-inline'", "'unsafe-eval'"] : []),
			scriptSrcAttr: ["'none'"],
			styleSrc: ["'self'"]
		}
	}
}));

app.use(expressSession({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	// TODO: configure secure cookies in production
	// cookie: { secure: process.env.NODE_ENV === "production" },
	store: MongoStore.create({
		mongoUrl: process.env.SESSION_MONGO_URI,
		dbName: process.env.SESSION_MONGO_DB_NAME
	})
}));

app.use(discordAuthMiddleware);

app.get("/api/user", (req, res) => {
	res.send(req.session.discordUser);
});

if (process.env.NODE_ENV === "development") {
	const webpack = require("webpack");
	const webpackDevMiddleware = require("webpack-dev-middleware");
	const webpackHotMiddleware = require("webpack-hot-middleware");
	const webpackConfig = require("../../webpack.config.js")("development", {});

	const compiler = webpack(webpackConfig);

	app.use(webpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath
	}));
	app.use(webpackHotMiddleware(compiler));
} else {
	app.use(express.static("dist"));
}

app.listen(port, () => console.log(`Listening on port ${port}!`));
