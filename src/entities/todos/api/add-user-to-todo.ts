import { findUserByEmail } from "../../user/api/find-user-by-email";
import type { Participant } from "../type/participant";
import { getTodoById } from "./get-todo-by-id";
import { patchTodo } from "./patсh-todo";

export async function addUserToTodo(params: {
  todoId: string;
  email: string;
  role: "admin" | "viewer";
}) {
  const user = await findUserByEmail(params.email);
  if (!user) {
    alert("Такого користувача не існує")
    throw new Error("Користувача з таким email не знайдено");
  }

  const newParticipant: Participant = {
    id: user.id,
    email: params.email,
    role: params.role,
  };

  const currentTodo = await getTodoById(params.todoId);

  const exists = currentTodo.participants?.some(
    (p) => p.id === newParticipant.id
  );

  if (exists) {
    throw new Error("Цей користувач вже є учасником");
  }

  const updatedParticipants = currentTodo.participants
    ? [...currentTodo.participants, newParticipant]
    : [newParticipant];

  await patchTodo(params.todoId, { participants: updatedParticipants });

  return newParticipant;
}
