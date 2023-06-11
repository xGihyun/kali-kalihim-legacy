// Set cookies here since Firebase's Google auth won't work on SvelteKit's form actions
export function setCookie(name: string, value: string | number | boolean, expirationDays: number) {
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + expirationDays);

	const cookieValue = value + '; expires=' + expirationDate.toUTCString() + '; path=/';
	document.cookie = name + '=' + cookieValue + ';secure=true';
}
