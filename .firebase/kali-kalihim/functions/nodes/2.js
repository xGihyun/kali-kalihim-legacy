import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
export const component = async () => (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.c3b5c50d.js","_app/immutable/chunks/index.bc2fdfc4.js","_app/immutable/chunks/auth.b3955bc2.js","_app/immutable/chunks/firebase.507f3f22.js","_app/immutable/chunks/store.81ef988c.js","_app/immutable/chunks/index.568093f0.js"];
export const stylesheets = [];
export const fonts = [];
