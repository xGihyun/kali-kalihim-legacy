import { g as get_store_value, c as create_ssr_component, a as compute_rest_props, e as escape, b as spread, d as escape_attribute_value, f as escape_object, h as add_attribute, i as getContext, j as validate_store, k as subscribe, v as validate_component, s as setContext } from "../../chunks/index3.js";
import { c as currentUser } from "../../chunks/store.js";
import { w as writable } from "../../chunks/index2.js";
const themeSkeleton = "";
const skeleton = "";
const app = "";
const stores = {};
function localStorageStore(key, initialValue, options) {
  options?.serializer ?? JSON;
  options?.storage ?? "local";
  if (!stores[key]) {
    const store = writable(initialValue, (set2) => {
    });
    const { subscribe: subscribe2, set } = store;
    stores[key] = {
      set(value) {
        set(value);
      },
      update(updater) {
        const value = updater(get_store_value(store));
        set(value);
      },
      subscribe: subscribe2
    };
  }
  return stores[key];
}
localStorageStore("modeOsPrefers", false);
localStorageStore("modeUserPrefers", void 0);
localStorageStore("modeCurrent", false);
const Avatar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classesBase;
  let $$restProps = compute_rest_props($$props, [
    "initials",
    "fill",
    "src",
    "fallback",
    "action",
    "actionParams",
    "background",
    "width",
    "border",
    "rounded",
    "shadow",
    "cursor"
  ]);
  let { initials = "AB" } = $$props;
  let { fill = "fill-token" } = $$props;
  let { src = "" } = $$props;
  let { fallback = "" } = $$props;
  let { action = () => {
  } } = $$props;
  let { actionParams = "" } = $$props;
  let { background = "bg-surface-400-500-token" } = $$props;
  let { width = "w-16" } = $$props;
  let { border = "" } = $$props;
  let { rounded = "rounded-full" } = $$props;
  let { shadow = "" } = $$props;
  let { cursor = "" } = $$props;
  let cBase = "flex aspect-square text-surface-50 font-semibold justify-center items-center overflow-hidden isolate";
  let cImage = "w-full h-full object-cover";
  function prunedRestProps() {
    delete $$restProps.class;
    return $$restProps;
  }
  if ($$props.initials === void 0 && $$bindings.initials && initials !== void 0)
    $$bindings.initials(initials);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  if ($$props.src === void 0 && $$bindings.src && src !== void 0)
    $$bindings.src(src);
  if ($$props.fallback === void 0 && $$bindings.fallback && fallback !== void 0)
    $$bindings.fallback(fallback);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.actionParams === void 0 && $$bindings.actionParams && actionParams !== void 0)
    $$bindings.actionParams(actionParams);
  if ($$props.background === void 0 && $$bindings.background && background !== void 0)
    $$bindings.background(background);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.border === void 0 && $$bindings.border && border !== void 0)
    $$bindings.border(border);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.shadow === void 0 && $$bindings.shadow && shadow !== void 0)
    $$bindings.shadow(shadow);
  if ($$props.cursor === void 0 && $$bindings.cursor && cursor !== void 0)
    $$bindings.cursor(cursor);
  classesBase = `${cBase} ${background} ${width} ${border} ${rounded} ${shadow} ${cursor} ${$$props.class ?? ""}`;
  return `<figure class="${"avatar " + escape(classesBase, true)}" data-testid="avatar">${src ? `<img${spread(
    [
      {
        class: "avatar-image " + escape(cImage, true)
      },
      {
        style: escape_attribute_value($$props.style ?? "")
      },
      { src: escape_attribute_value(src) },
      {
        alt: escape_attribute_value($$props.alt || "")
      },
      escape_object(prunedRestProps())
    ],
    {}
  )}>` : `<svg class="avatar-initials w-full h-full" viewBox="0 0 512 512"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-weight="bold"${add_attribute("font-size", 150, 0)} class="${"avatar-text " + escape(fill, true)}">${escape(String(initials).substring(0, 2).toUpperCase())}</text></svg>`}</figure>`;
});
const ProgressBar_svelte_svelte_type_style_lang = "";
const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  const user = getContext("user");
  validate_store(user, "user");
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_user();
  return `${$user.auth_data.is_logged_in && $user.auth_data.is_registered ? `<nav class="flex fixed h-20 w-full shrink-0 items-center justify-between gap-5 border-b-[1px] border-neutral-800 px-20 py-5"><a href="/" class="font-gt-walsheim-pro-medium text-4xl uppercase">Kali Kalihim</a>
		<div class="flex gap-5"><a class="variant-filled-secondary rounded-md p-2" type="button" href="/leaderboards">Leaderboards</a>
			<a class="variant-filled-secondary rounded-md p-2" type="button" href="/matchmake">Matchmake</a>
			<form method="post" action="/logout"><button class="variant-filled-primary rounded-md p-2">Log Out</button></form>
			<a href="/profile">${validate_component(Avatar, "Avatar").$$render(
    $$result,
    {
      src: $user.auth_data.photo_url || "",
      width: "w-10"
    },
    {},
    {}
  )}</a></div></nav>` : ``}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  setContext("user", currentUser);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  {
    currentUser.set({
      auth_data: {
        email: data.user?.auth_data.email || "",
        is_logged_in: data.user?.auth_data.is_logged_in || false,
        is_registered: data.user?.auth_data.is_registered || false,
        photo_url: data.user?.auth_data.photo_url || "",
        uid: data.user?.auth_data.uid || "",
        username: data.user?.auth_data.username || "",
        role: data.user?.auth_data.role || ""
      },
      personal_data: {
        age: data.user?.personal_data.age || -1,
        contact_number: data.user?.personal_data.contact_number || -1,
        name: {
          first: data.user?.personal_data.name.first || "",
          last: data.user?.personal_data.name.last || ""
        },
        section: data.user?.personal_data.section || "",
        sex: data.user?.personal_data.sex || ""
      }
    });
  }
  return `${validate_component(Navbar, "Navbar").$$render($$result, {}, {}, {})}
<main class="h-screen">${slots.default ? slots.default({}) : ``}</main>`;
});
export {
  Layout as default
};
