/** @type {import('tailwindcss').Config} */
module.exports = {
	// 1. Apply the dark mode class setting:
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 2. Append the path for the Skeleton NPM package and files:
		require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			fontFamily: {
				'gt-walsheim-pro-medium': ['gt-walsheim-pro-medium', 'sans-serif'],
				'gt-walsheim-pro-light': ['gt-walsheim-pro-light', 'sans-serif'],
				'gt-walsheim-pro-thin': ['gt-walsheim-pro-thin', 'sans-serif'],
				'inter': ['inter', 'sans-serif'],
				'inter-bold': ['inter-bold', 'sans-serif'],
			},
      boxShadow: {
        "nav": "rgba(0, 0, 0, 0.6) 0px 5px 10px",
        "profile": "rgba(0, 0, 0, 0.25) 0px 5px 10px",
        "lighter": "rgba(0, 0, 0, 0.1) 0px 5px 10px",
        "green": "rgba(0, 255, 0, 0.75) 0px 20px 35px 5px",
			},
			padding: {
				"main": "5%",
			}
		}
	},
	plugins: [
		// 3. Append the Skeleton plugin to the end of this list
		require('@tailwindcss/forms'),
		...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
	]
};
