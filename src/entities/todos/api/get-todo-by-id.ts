import { doc, getDoc } from "firebase/firestore";
import type { ToDoTypeWithId } from "../type/todo-type";
import { db } from "../../../app/config/firebase/firebase-config";

export async function getTodoById(todoId: string): Promise<ToDoTypeWithId> {
  const docRef = doc(db, "todos", todoId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("ToDo з таким id не знайдено");
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as ToDoTypeWithId;
}
