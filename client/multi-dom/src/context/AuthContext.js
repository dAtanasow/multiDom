import { AuthContext } from "./AuthContext";
import usePersistedState from "../hooks/usePersistedState";

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = usePersistedState("auth", {
    user: null,
    accessToken: null,
  });

  const changeAuthState = (newState) => {
    if (typeof newState !== 'object' || newState === null) {
      console.error('changeAuthState expects an object!');
      return;
    }

    setAuthState((oldState) => ({
      ...oldState,
      ...newState,
    }));
  };

  const logout = () => {
    setAuthState({ user: null, accessToken: null });

    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch((err) => console.error('Logout API error:', err));

    window.location.href = '/login';
  };

  const contextData = {
    userId: authState?.user?._id || null,
    email: authState?.user?.email || null,
    username: authState?.user?.username || null,
    phone: authState?.user?.phone || null,
    accessToken: authState ? authState.accessToken : null,
    isAuthenticate: !!authState?.user,
    role: authState?.user?.role || 'user',
    changeAuthState,
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}
