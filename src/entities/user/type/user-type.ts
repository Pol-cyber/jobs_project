export type UserType = {
    email: string,
    username: string,
    password: string
}


export type UserTypeWithId = UserType & {
  id: string | undefined;
};