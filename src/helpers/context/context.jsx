import { createContext, useContext, useReducer, useMemo } from "react";
import initialState from "./innitialState";
import appReducer from "./setState";

// ---------- Create Context ----------
const AppContext = createContext(null);

// ---------- Provider ----------
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const value = useMemo(() => ({ state, ...state, dispatch }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ---------- Hook to use Context ----------
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside <AppProvider />");
  }
  return ctx;
}
