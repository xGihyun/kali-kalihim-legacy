import { d as db, a as auth } from "../../../chunks/firebase.js";
import { c as currentUser } from "../../../chunks/store.js";
import { r as redirect } from "../../../chunks/index.js";
import { signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
const defaultAuthData = {
  email: "",
  username: "",
  uid: "",
  is_logged_in: false,
  is_registered: false,
  photo_url: "",
  role: ""
};
const defaultPersonalData = {
  age: -1,
  contact_number: -1,
  name: {
    first: "",
    last: ""
  },
  section: "",
  sex: ""
};
const defaultUserData = {
  auth_data: defaultAuthData,
  personal_data: defaultPersonalData
};
const actions = {
  default: async ({ cookies, locals }) => {
    if (!locals.userData.auth_data.uid) {
      return;
    }
    console.log("Resetting writable...");
    currentUser.set({
      ...defaultUserData
    });
    console.log("Logging out, deleting cookies now, and redirecting to homepage...");
    cookies.delete("session");
    const userRef = doc(db, "users", locals.userData.auth_data.uid);
    await setDoc(userRef, { auth_data: { is_logged_in: false } }, { merge: true });
    locals.userData = {
      ...defaultUserData
    };
    await signOut(auth);
    console.log("The user has been logged out, now redirecting to '/'");
    throw redirect(302, "/");
  }
};
export {
  actions
};
