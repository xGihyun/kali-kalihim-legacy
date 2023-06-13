import { d as db } from "../../../chunks/firebase.js";
import { r as redirect } from "../../../chunks/index.js";
import { doc, setDoc } from "firebase/firestore";
import { c as currentUser } from "../../../chunks/store.js";
const actions = {
  default: async ({ request, locals }) => {
    const userUid = locals.userData.auth_data.uid;
    if (!userUid) {
      return;
    }
    const data = await request.formData();
    const firstName = data.get("first-name")?.toString().trim();
    const lastName = data.get("last-name")?.toString().trim();
    const age = Number(data.get("age")?.toString());
    const sex = data.get("sex")?.toString();
    const section = data.get("section")?.toString();
    const contactNumber = Number(data.get("contact-number")?.toString().trim());
    const newPersonalData = {
      age,
      contact_number: contactNumber,
      name: {
        first: firstName || "",
        last: lastName || ""
      },
      section: section || "",
      sex: sex || ""
    };
    currentUser.update((val) => {
      return {
        auth_data: {
          ...val.auth_data,
          is_registered: true
        },
        personal_data: {
          ...val.personal_data
        }
      };
    });
    const userRef = doc(db, "users", userUid);
    await setDoc(
      userRef,
      {
        auth_data: {
          is_registered: true
        },
        personal_data: {
          ...newPersonalData
        }
      },
      { merge: true }
    );
    console.log("Now registered!");
    throw redirect(302, "/");
  }
};
export {
  actions
};
