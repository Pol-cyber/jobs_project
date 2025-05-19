import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../app/config/firebase/firebase-config";

export async function findUserByEmail(email: string) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null; 
  }

  const userDoc = querySnapshot.docs[0];
  return { id: userDoc.id };
}
