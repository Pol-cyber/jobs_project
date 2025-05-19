import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import type { UserType, UserTypeWithId } from "../type/user-type";
import { auth, db } from "../../../app/config/firebase/firebase-config";

export const loginUser = async (userData : Pick<UserType, "email" | "password">) : Promise<UserTypeWithId | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserTypeWithId;
      return {...userData};
    } else {
      return null;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
};