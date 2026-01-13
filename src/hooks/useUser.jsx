import { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import axiosConfig from '../util/axiosConfig.jsx';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';

export const useUser = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useUser must be used within <AppContextProvider>');

  const { user, setUser, clearUser, authLoading, setAuthLoading } = ctx;
  const navigate = useNavigate();

  // ✅ prevents double request in React 18 StrictMode + normal rerenders
  const started = useRef(false);

  useEffect(() => {
    // ✅ if user already exists, auth is done
    if (user) {
      setAuthLoading(false);
      return;
    }

    // ✅ starting auth check
    setAuthLoading(true);

    const token = localStorage.getItem('token');

    // ✅ no token -> go login (and allow future runs)
    if (!token) {
      started.current = false;
      clearUser();
      setAuthLoading(false);
      navigate('/login', { replace: true });
      return;
    }

    // ✅ prevent duplicate calls
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        const res = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);
        if (res?.data) setUser(res.data);
      } catch (e) {
        const status = e?.response?.status;

        // ✅ only logout on real auth failures
        if (status === 401 || status === 403) {
          localStorage.removeItem('token');
          started.current = false;
          clearUser();
          navigate('/login', { replace: true });
          return;
        }

        // ✅ network/5xx: don't logout
        console.error('GET_USER_INFO failed (non-auth):', e);
      } finally {
        setAuthLoading(false);
      }
    })();
  }, [user, setUser, clearUser, navigate, setAuthLoading]);

  return { user, authLoading };
};
