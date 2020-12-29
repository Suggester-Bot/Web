export type Channel = {
	id: string;
	name: string;
}

export type User = {
	id: string;
	username: string;
	discriminator: string;
}

export type Role = {
	id: string;
	name: string;
	color: string;
}
