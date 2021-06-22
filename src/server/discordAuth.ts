import querystring from "querystring";
import { nanoid } from "nanoid";
import axios from "axios";
import type { RequestHandler } from "express";
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, ORIGIN } from "./config";

// TODO: remove `eslint-disable-next-line`s and actually fix the issues

declare module "express-session" {
	interface SessionData {
		oauthState: string;
		discordUser: {
			id: string;
			username: string;
			avatar: string;
			discriminator: string;
			// ...
			guilds: Array<{
				id: string;
				name: string;
				icon: string;
				owner: boolean;
				owner_id: string;
				// ...
			}>;
		}
	}
}

export const discordAuthMiddleware: RequestHandler = async (req, res, next) => {
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
				client_id: DISCORD_CLIENT_ID,
				scope: "identify guilds",
				redirect_uri: `${ORIGIN}${basePath}/callback`,
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
			} else if (typeof code !== "string"){
				throw new Error("Invalid OAuth2 code");
			}

			delete req.session.oauthState;

			const tokenRequest = await axios({
				method: "POST",
				url: "https://discord.com/api/v6/oauth2/token",
				data: querystring.stringify({
					client_id: DISCORD_CLIENT_ID,
					client_secret: DISCORD_CLIENT_SECRET,
					grant_type: "authorization_code",
					code,
					redirect_uri: `${ORIGIN}/auth/discord/callback`,
					scope: "identify guilds"
				}),
				headers: { "Content-Type": "application/x-www-form-urlencoded" }
			});

			/* eslint-disable-next-line */
			const token: string = tokenRequest.data.access_token;

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

			/* eslint-disable-next-line */
			req.session.discordUser = userRequest.data;
			/* eslint-disable-next-line */
			req.session.discordUser!.guilds = guildsRequest.data;

			/* eslint-disable-next-line */
			console.log(`Discord user authenticated: ${userRequest.data.id} (${userRequest.data.username}#${userRequest.data.discriminator})`);
			res.redirect("/");
		} catch (err) {
			next(err);
		}
	} else {
		// Invalid auth endpoint, redirect to log in page and go from there
		res.redirect(basePath);
	}
};
