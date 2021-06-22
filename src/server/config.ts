import path from "path";

const getEnvVar = function (
	name: string,
	validate: (value: string) => boolean = () => true,
	message = `The ${name} enviornment variable must be set to a valid value.`
) {
	const value = process.env[name];
	if (value && validate(value)) {
		return value;
	} else {
		throw new Error(message);
	}
};

export const ORIGIN = getEnvVar("ORIGIN");

const NODE_ENV = getEnvVar(
	"NODE_ENV",
	env => env === "production" || env === "development",
	"The NODE_ENV enviornment variable must be set to either \"production\" or \"development\""
) as "production" | "development";

export const IS_DEV = NODE_ENV === "development";

export const PORT = parseInt(getEnvVar(
	"PORT",
	port => (/^\d+$/u).test(port) && parseInt(port) >= 0 && parseInt(port) < 65536,
	"The PORT enviornment variable must be an integer in the range 0-65535"
));

export const CLIENT_DIST = path.resolve(getEnvVar("CLIENT_DIST"));
export const DISCORD_CLIENT_ID = getEnvVar("DISCORD_CLIENT_ID");
export const DISCORD_CLIENT_SECRET = getEnvVar("DISCORD_CLIENT_ID");
export const SESSION_SECRET = getEnvVar("SESSION_SECRET");
export const SESSION_MONGO_URI = getEnvVar("SESSION_MONGO_URI");
export const SESSION_MONGO_DB_NAME = getEnvVar("SESSION_MONGO_DB_NAME");
