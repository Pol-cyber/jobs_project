import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../providers/redux-store/redux";
import { userSlice } from "../../../entities/user/slice/user-slice";

export function UnlogginedUserRoute({ children }: { children: ReactNode }) {
  const userId = useAppSelector(userSlice.selectors.userId);

  return !userId ? children : <Navigate to={"/"}></Navigate>;
}
