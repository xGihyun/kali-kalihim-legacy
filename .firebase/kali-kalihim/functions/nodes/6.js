import * as server from '../entries/pages/register/_page.server.ts.js';

export const index = 6;
export const component = async () => (await import('../entries/pages/register/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/register/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.f286b7cf.js","_app/immutable/chunks/index.bc2fdfc4.js","_app/immutable/chunks/auth.b3955bc2.js","_app/immutable/chunks/firebase.507f3f22.js","_app/immutable/chunks/store.81ef988c.js","_app/immutable/chunks/index.568093f0.js","_app/immutable/chunks/control.f5b05b5f.js"];
export const stylesheets = [];
export const fonts = [];
