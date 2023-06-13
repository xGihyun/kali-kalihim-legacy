import { c as create_ssr_component, i as getContext, e as escape, h as add_attribute, k as subscribe, n as noop } from "../../chunks/index3.js";
import "../../chunks/firebase.js";
import "firebase/auth";
import "firebase/firestore";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let user;
  let $user, $$unsubscribe_user = noop, $$subscribe_user = () => ($$unsubscribe_user(), $$unsubscribe_user = subscribe(user, ($$value) => $user = $$value), user);
  $$subscribe_user(user = getContext("user"));
  $$unsubscribe_user();
  return `<div class="flex h-full flex-col items-center justify-center">${$user.auth_data.is_logged_in && $user.auth_data.is_registered ? `<div>Hello ${escape($user.auth_data.username)}</div>` : `${$user.auth_data.is_logged_in && !$user.auth_data.is_registered ? `<div class="p-4 variant-filled-surface rounded-md"><form method="post" action="?/register"><label class="label"><span>First Name</span>
					<input class="input" type="text" placeholder="eg. Ayaka" name="first-name" required></label>

				<label class="label"><span>Last Name</span>
					<input class="input" type="text" placeholder="eg. Kamisato" name="last-name" required></label>

				<label class="label"><span>Age</span>
					<input class="input" type="text" placeholder="eg. 18" name="age" required></label>

				<label class="label"><span>Sex</span>
					<select class="input" size="1" value="male" name="sex" required><option value="male">Male</option><option value="female">Female</option></select></label>

				<label class="label"><span>Section</span>
					<select class="input" size="1" value="section-1" name="section" required><option value="section-1">Section 1</option><option value="section-2">Section 2</option><option value="section-3">Section 3</option><option value="section-4">Section 4</option><option value="section-5">Section 5</option></select></label>

				<label class="label"><span>Email</span>
					<input class="input opacity-50" type="email" placeholder="Aa" name="email"${add_attribute("value", `${$user.auth_data.email}`, 0)} readonly></label>

				<label class="label"><span>Contact No.</span>
					<input class="input" type="tel" placeholder="eg. 09123456789" name="contact-number" required></label>

				<button class="variant-filled-primary rounded-md p-2">Register</button></form></div>` : `${!$user.auth_data.is_logged_in && !$user.auth_data.is_registered ? `<h1 class="font-gt-walsheim-pro-medium text-center text-9xl uppercase select-none mb-10">Kali Kalihim
		</h1>
		<button class="rounded-lg border-[1px] border-white p-2 flex items-center gap-5 select-none"><span class="text-xl">Sign in with Google</span></button>` : ``}`}`}</div>`;
});
export {
  Page as default
};
