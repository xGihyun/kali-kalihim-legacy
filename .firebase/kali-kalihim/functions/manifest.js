export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/GTWalsheimPro-Light.ttf","fonts/GTWalsheimPro-Medium.ttf","fonts/GTWalsheimPro-Regular.ttf","fonts/GTWalsheimPro-Thin.ttf"]),
	mimeTypes: {".png":"image/png",".ttf":"font/ttf"},
	_: {
		client: {"start":"_app/immutable/entry/start.713c3fec.js","app":"_app/immutable/entry/app.7b4d6f26.js","imports":["_app/immutable/entry/start.713c3fec.js","_app/immutable/chunks/index.bc2fdfc4.js","_app/immutable/chunks/singletons.7173f463.js","_app/immutable/chunks/index.568093f0.js","_app/immutable/chunks/control.f5b05b5f.js","_app/immutable/entry/app.7b4d6f26.js","_app/immutable/chunks/index.bc2fdfc4.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js'),
			() => import('./nodes/4.js'),
			() => import('./nodes/5.js'),
			() => import('./nodes/6.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/matchmake",
				pattern: /^\/api\/matchmake\/?$/,
				params: [],
				page: null,
				endpoint: () => import('./entries/endpoints/api/matchmake/_server.ts.js')
			},
			{
				id: "/leaderboards",
				pattern: /^\/leaderboards\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(admin)/matchmake",
				pattern: /^\/matchmake\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/register",
				pattern: /^\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
