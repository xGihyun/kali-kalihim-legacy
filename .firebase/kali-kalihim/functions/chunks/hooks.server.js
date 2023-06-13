import { d as db } from "./firebase.js";
import { r as redirect } from "./index.js";
import { doc, getDoc } from "firebase/firestore";
async function handle({ event, resolve }) {
  const session = event.cookies.get("session");
  if (event.url.pathname !== "/" && !session) {
    console.log("Access Denied");
    throw redirect(307, "/");
  }
  if (!session)
    return await resolve(event);
  const userRef = doc(db, "users", session);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    event.locals.userData = data;
    console.log(event.locals.userData);
  }
  return await resolve(event);
}
export {
  handle
};
