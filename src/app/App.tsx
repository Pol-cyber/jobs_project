import { Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase/firebase-config";
import { useDispatch } from "react-redux";
import type { AppRootDispatch } from "./providers/redux-store/redux";
import { useEffect } from "react";
import { addUser, logoutUser } from "../entities/user/slice/user-slice";

function App() {
  const dispatch = useDispatch<AppRootDispatch>();
  const [user, loading] = useAuthState(auth);

  if (loading) {
    <div>Loading......</div>;
  }

  useEffect(() => {
    if (user) {
      dispatch(addUser({ id: user!.uid }));
    } else {
      dispatch(logoutUser());
    }
  }, [dispatch, user]);

  return (
    <div className="bg-slate-500 w-[100%] min-h-screen h-auto">
      <Outlet></Outlet>
    </div>
  );
}

export default App;
