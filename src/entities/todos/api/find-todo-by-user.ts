import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../app/config/firebase/firebase-config";
import type { ToDoTypeWithId } from "../type/todo-type";

export const findToDoByUser = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const userEmail = userData.email;

      const todosQuery = query(
        collection(db, "todos"),
        where("owner", "==", userId)
      );
      const querySnapshot = await getDocs(todosQuery);
      const todos: ToDoTypeWithId[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        todos.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          owner: data.owner,
          list: data.list,
        });
      });

      const todosQueryViewer = query(
        collection(db, "todos"),
        where("participants", "array-contains", {
          id: userId,
          email: userEmail,
          role: "viewer",
        })
      );

      const todosQueryAdmin = query(
        collection(db, "todos"),
        where("participants", "array-contains", {
          id: userId,
          email: userEmail,
          role: "admin",
        })
      );

      const querySnapshotViewer = await getDocs(todosQueryViewer);
      querySnapshotViewer.forEach((doc) => {
        const data = doc.data();
        todos.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          owner: data.owner,
          list: data.list,
          participants: data.participants,
        });
      });

      const querySnapshotAdmin = await getDocs(todosQueryAdmin);
      querySnapshotAdmin.forEach((doc) => {
        const data = doc.data();
        todos.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          owner: data.owner,
          list: data.list,
          participants: data.participants,
        });
      });

      return todos;
    } else {
      return []
    }
  } catch (error) {
    throw new Error("Error fetching todos: " + error);
  }
};
