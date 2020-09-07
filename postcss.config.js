module.exports = {
	plugins: [
		require("postcss-calc")(),
		require("autoprefixer"),
		require("cssnano")({ preset: "default" })
	]
};
