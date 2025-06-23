import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated, children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    if (!isAuthenticated) {
      setSearchParams({ panel: "login" }, { replace: true });
    }
  }, [isAuthenticated, setSearchParams, isInitialMount]);

  // Clear login panel when authenticated
  useEffect(() => {
    if (isAuthenticated && searchParams.has("panel")) {
      setSearchParams({}, { replace: true });
    }
  }, [isAuthenticated, searchParams, setSearchParams]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
