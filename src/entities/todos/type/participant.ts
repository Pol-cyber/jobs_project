export type Participant = {
  id: string;
  email: string;
  role: "admin" | "viewer";
};