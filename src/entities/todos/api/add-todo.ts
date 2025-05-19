import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { ToDoType, ToDoTypeWithId } from "../type/todo-type";
import { db } from "../../../app/config/firebase/firebase-config";

export async function addTodo(todo: ToDoType): Promise<ToDoTypeWithId> {
  try {
    const docRef = await addDoc(collection(db, "todos"), {
      ...todo,
      createdAt: serverTimestamp(),
    });

    return {
      ...todo,
      id: docRef.id,
    };
  } catch (error) {
    console.error(" Не вдалося додати todo:", error);
    throw error;
  }
}
