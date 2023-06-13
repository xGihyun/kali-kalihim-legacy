import { d as db } from "../../../../chunks/firebase.js";
import { collection, getDocs } from "firebase/firestore";
const GET = async () => {
  const userCollection = collection(db, "users");
  const allUsers = await getDocs(userCollection);
  const totalUsers = allUsers.size;
  const randomIndices = getRandomIndices(totalUsers, 2);
  const randomUsers = [];
  for (const index of randomIndices) {
    const userSnapshot = allUsers.docs[index];
    const userData = userSnapshot.data();
    randomUsers.push(userData);
  }
  const randomUsersString = JSON.stringify(randomUsers);
  return new Response(randomUsersString, { headers: { "Content-Type": "application/json" } });
};
function getRandomIndices(totalUsers, limit) {
  const indices = [];
  while (indices.length < limit) {
    const randomIndex = Math.floor(Math.random() * totalUsers);
    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }
  return indices;
}
export {
  GET
};
