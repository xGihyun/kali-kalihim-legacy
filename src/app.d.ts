// See https://kit.svelte.dev/docs/types#app

import type { UserAuthData, UserData, UserPersonalData } from '$lib/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			userData: UserData;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
