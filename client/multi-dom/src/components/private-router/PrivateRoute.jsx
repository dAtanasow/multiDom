import { Navigate } from "react-router";
import { useAuthContext } from "../../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticate } = useAuthContext();

  if (!isAuthenticate) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
