import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(() => {
    // Only show loading if we have a token but haven't loaded user into localStorage yet
    return !!localStorage.getItem('token') && !localStorage.getItem('user');
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      try {
        localStorage.setItem('user', JSON.stringify(userData));
      } catch {
        // storage quota safety
      }
    } else {
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/me')
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUserState(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password, password_confirmation) => {
    const res = await api.post('/register', { name, email, password, password_confirmation });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try { await api.post('/logout'); } catch { /* ignore */ }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserState(null);
  };

  const isAdmin = user?.is_admin === 1 || user?.is_admin === true;

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, isAdmin, loading, loginModalOpen, setLoginModalOpen, registerModalOpen, setRegisterModalOpen, forgotPasswordModalOpen, setForgotPasswordModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
