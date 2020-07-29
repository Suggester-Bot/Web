const querystring = require("querystring");
const { nanoid } = require("nanoid");
const axios = require("axios");

const discordAuthMiddleware = async (req, res, next) => {
	const basePath = "/auth/discord";

	if (req.session.discordUser) {
		if (req.path.startsWith(basePath)) {
			// Auth request while logged in, redirect to home page
			res.redirect("/");
		} else {
			// Normal request while logged in, don't do anything
			next();
			return;
		}
	}

	if (!req.path.startsWith(basePath)) {
		// Normal request while not logged in, redirect to log in page
		res.redirect(basePath);
	} else if (req.path === basePath) {
		// Login request
		const state = nanoid();
		req.session.oauthState = state;

		res.redirect(
			`https://discord.com/api/v6/oauth2/authorize?${querystring.stringify({
				client_id: process.env.DISCORD_CLIENT_ID,
				scope: "identify guilds",
				redirect_uri: `${process.env.ORIGIN}${basePath}/callback`,
				state,
				prompt: "none",
				response_type: "code"
			})}`
		);
	} else if (req.path === `${basePath}/callback`) {
		// Discord OAuth2 callback
		try {
			const { state, code } = req.query;
			if (state !== req.session.oauthState) {
				throw new Error("Invalid OAuth2 state");
			}

			delete req.session.oauthState;

			const tokenRequest = await axios({
				method: "POST",
				url: "https://discord.com/api/v6/oauth2/token",
				data: querystring.stringify({
					client_id: process.env.DISCORD_CLIENT_ID,
					client_secret: process.env.DISCORD_CLIENT_SECRET,
					grant_type: "authorization_code",
					code,
					redirect_uri: `${process.env.ORIGIN}/auth/discord/callback`,
					scope: "identify guilds"
				}),
				headers: { "Content-Type": "application/x-www-form-urlencoded" }
			});

			const token = tokenRequest.data.access_token;

			const userRequest = await axios({
				method: "GET",
				url: "https://discord.com/api/v6/users/@me",
				headers: { Authorization: `Bearer ${token}` }
			});

			const guildsRequest = await axios({
				method: "GET",
				url: "https://discord.com/api/v6/users/@me/guilds",
				headers: { Authorization: `Bearer ${token}` }
			});

			req.session.discordUser = userRequest.data;
			req.session.discordUser.guilds = guildsRequest.data;

			console.log(`Discord user authenticated: ${userRequest.data.id} (${userRequest.data.username}#${userRequest.data.discriminator})`);
			res.redirect("/");
		} catch (err) {
			next(err);
		}
	} else {
		// Invalid auth endpoint, redirect to log in page and go from there
		req.redirect(basePath);
	}
};

module.exports = discordAuthMiddleware;
