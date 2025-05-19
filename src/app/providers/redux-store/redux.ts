import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export const rootReducer = combineSlices();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppState = any;

export const rootStore = configureStore({
  reducer: rootReducer,
});

export const useAppSelector = useSelector.withTypes<AppState>();
export type AppRootState = ReturnType<typeof rootStore.getState>;
export type AppRootDispatch = typeof rootStore.dispatch;
