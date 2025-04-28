import { AuthContext } from "./AuthContext";
import usePersistedState from "../hooks/usePersistedState";
import { toast } from 'react-toastify';

const baseUrl = import.meta.env.VITE_API_URL

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

  const logout = async () => {
    setAuthState({ user: null, accessToken: null });

    try {
      await fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      toast.success('Успешно излязохте.');
    } catch (err) {
      console.error('Logout API error:', err);
      toast.error('Проблем при излизане.');
    } finally {
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    }
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
