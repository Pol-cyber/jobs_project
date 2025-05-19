import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../../app/config/firebase/firebase-config";
import type { UserType } from "../type/user-type";

export const registerUser = async (userData: UserType) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const firebaseUser = userCredential.user;

    await setDoc(doc(db, "users", firebaseUser.uid), {
      email: userData.email,
      username: userData.username,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
