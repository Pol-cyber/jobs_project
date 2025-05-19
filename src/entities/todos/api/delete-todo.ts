// src/features/todo/api/deleteToDo.ts
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../app/config/firebase/firebase-config";

export const deleteToDo = async (todoId: string): Promise<void> => {
  const todoRef = doc(db, "todos", todoId);
  await deleteDoc(todoRef);
};
