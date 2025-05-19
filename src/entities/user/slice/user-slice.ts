import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"
import { rootReducer } from "../../../app/providers/redux-store/redux";
import type { UserTypeWithId } from "../type/user-type";

type UserSubset = Pick<UserTypeWithId, "id">;

const initialUser: UserSubset = {
  id: undefined
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialUser,
  selectors: {
    userId: state => state.id,
  },
  reducers: {
    logoutUser(state) {
      state.id = undefined;
    },
    addUser(state, action: PayloadAction<UserSubset>) {
      state.id = action.payload.id;
    },
  },
}).injectInto(rootReducer);

export const { addUser, logoutUser } = userSlice.actions;