import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { openLoginPanel } from "../../utils/panel";
import { useLocation, useNavigate } from "react-router";

export default function PrivateRoute({ children }) {
  const { isAuthenticate } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticate) {
      const params = new URLSearchParams(location.search);
      if (params.get("panel") !== "login") {
        navigate("/?panel=login", { replace: true });
      } else {
        openLoginPanel();
      }
    }
  }, [isAuthenticate, navigate, location]);

  if (!isAuthenticate) return null;

  return children;
}
