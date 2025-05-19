import { doc, updateDoc } from "firebase/firestore";
import type { ToDoType } from "../type/todo-type";
import { db } from "../../../app/config/firebase/firebase-config";

export async function patchTodo(todoId: string, updates: Partial<ToDoType>) {
  const todoRef = doc(db, "todos", todoId);
  await updateDoc(todoRef, updates);
}
