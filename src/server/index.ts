import dotenv from "dotenv";
dotenv.config();

import express from "express";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import path from "path";

import { discordAuthMiddleware } from "./discordAuth";
import { IS_DEV, PORT, SESSION_MONGO_DB_NAME, SESSION_MONGO_URI, SESSION_SECRET } from "./config";

const app = express();

app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			"script-src": [
				"'self'",

				// Needed for the webpack eval devtools
				IS_DEV && "'unsafe-eval'",

				// Needed for the react devtools to work in firefox
				// https://bugzilla.mozilla.org/show_bug.cgi?id=1267027
				// https://github.com/facebook/react/issues/17997
				IS_DEV && "'unsafe-inline'"
			].filter(Boolean) as string[]
		}
	}
}));

app.use(expressSession({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	// TODO: configure secure cookies in production
	// cookie: { secure: !IS_DEV },
	store: MongoStore.create({
		mongoUrl: SESSION_MONGO_URI,
		dbName: SESSION_MONGO_DB_NAME
	})
}));

app.use(discordAuthMiddleware);

app.get("/api/user", (req, res) => {
	res.send(req.session.discordUser);
});

if (IS_DEV) {
	/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires,
	@typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

	const webpack = require("webpack");
	const webpackDevMiddleware = require("webpack-dev-middleware");
	const webpackHotMiddleware = require("webpack-hot-middleware");
	const webpackConfig = require("../../webpack.config.js")({}, {});

	const compiler = webpack(webpackConfig);

	app.use(webpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath
	}));
	app.use(webpackHotMiddleware(compiler));

	/* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires,
	@typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
} else {
	app.use(express.static(path.resolve(SESSION_MONGO_DB_NAME)));
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
