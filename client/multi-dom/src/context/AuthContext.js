import { createContext, useContext } from "react";

export const AuthContext = createContext({
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  accessToken: "",
  userId: "",
  isAuthenticate: false,
  changeAuthState: () => null,
  logout: () => null,
})

export function useAuthContext() {
  return useContext(AuthContext);
}