import { w as writable } from "./index2.js";
const currentUser = writable({
  auth_data: {
    email: "",
    username: "",
    uid: "",
    is_logged_in: false,
    is_registered: false,
    photo_url: "",
    role: ""
  },
  personal_data: {
    age: -1,
    contact_number: -1,
    name: {
      first: "",
      last: ""
    },
    section: "",
    sex: ""
  }
});
export {
  currentUser as c
};
