import { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import axiosConfig from '../util/axiosConfig.jsx';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';

export const useUser = () => {
  const { user, setUser, clearUser } = useContext(AppContext);
  const navigate = useNavigate();
  const started = useRef(false);

  useEffect(() => {
    if (user) return;
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        const res = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);
        if (res.data) setUser(res.data);
      } catch (e) {
        clearUser();
        navigate('/login');
      }
    })();
  }, [user, setUser, clearUser, navigate]);
};
