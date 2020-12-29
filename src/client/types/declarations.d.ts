declare module "*.scss" {
	const classes: Record<string, string>;
	export default classes;
}

declare module "*.png" {
	const fileName: string;
	export default fileName;
}
