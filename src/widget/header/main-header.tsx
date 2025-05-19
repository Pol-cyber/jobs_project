import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { UiButton } from "../../shared/ui/button/ui-button";
import { logoutUser } from "../../entities/user/slice/user-slice";
import type { AppRootDispatch } from "../../app/providers/redux-store/redux";
import { auth } from "../../app/config/firebase/firebase-config";

export function MainHeader() {
  const dispatch = useDispatch<AppRootDispatch>();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutUser());
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-slate-800 text-white shadow-md">
      <h1 className="text-xl font-bold">Мій застосунок</h1>
      <UiButton onClick={handleLogout} text="Вийти" type="button"></UiButton>
    </header>
  );
}
