import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { openLoginPanel } from "../../utils/panel";

export default function PrivateRoute({ children }) {
  const { isAuthenticate } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticate) {
      openLoginPanel()
    }
  }, [isAuthenticate]);

  if (!isAuthenticate) return null;

  return children;
}
