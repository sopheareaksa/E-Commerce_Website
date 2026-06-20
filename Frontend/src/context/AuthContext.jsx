import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => !!localStorage.getItem('token'));
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/me')
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
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
    try { await api.post('/logout'); } catch { /* ignore logout errors */ }
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = user?.is_admin === 1 || user?.is_admin === true;

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, isAdmin, loading, loginModalOpen, setLoginModalOpen, registerModalOpen, setRegisterModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
