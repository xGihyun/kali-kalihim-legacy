// See https://kit.svelte.dev/docs/types#app

import type { UserData } from '$lib/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			userData: UserData;
			getUserData: Promise<UserData | null>;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
