import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
export const component = async () => (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.43308003.js","_app/immutable/chunks/index.bc2fdfc4.js","_app/immutable/chunks/store.81ef988c.js","_app/immutable/chunks/index.568093f0.js"];
export const stylesheets = ["_app/immutable/assets/0.d91d44e2.css"];
export const fonts = ["_app/immutable/assets/GTWalsheimPro-Regular.1cafae33.ttf","_app/immutable/assets/GTWalsheimPro-Medium.3185f9a8.ttf","_app/immutable/assets/GTWalsheimPro-Light.2dd2e18f.ttf","_app/immutable/assets/GTWalsheimPro-Thin.2858f9cf.ttf"];
