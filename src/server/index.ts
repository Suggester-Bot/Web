import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;

import express from "express";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import path from "path";

import { discordAuthMiddleware } from "./discordAuth";

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
	/* eslint-disable-next-line */
	secret: process.env.SESSION_SECRET!,
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
	/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires,
	@typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

	const webpack = require("webpack");
	const webpackDevMiddleware = require("webpack-dev-middleware");
	const webpackHotMiddleware = require("webpack-hot-middleware");
	const webpackConfig = require("../../webpack.config.js")("development", {});

	const compiler = webpack(webpackConfig);

	app.use(webpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath
	}));
	app.use(webpackHotMiddleware(compiler));

	/* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires,
	@typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
} else {
	/* eslint-disable-next-line */
	app.use(express.static(path.resolve(process.env.SESSION_MONGO_DB_NAME!)));
}

app.listen(port, () => console.log(`Listening on port ${port}!`));
