import type { Participant } from "./participant";

export type ToDoListType = { id: number; text: string; isDone: boolean }

export type ToDoType = {
  title: string;
  description: string;
  owner: string;
  list: ToDoListType[];
  participants?: Participant[];
};


export type ToDoTypeWithId = ToDoType & { id: string};