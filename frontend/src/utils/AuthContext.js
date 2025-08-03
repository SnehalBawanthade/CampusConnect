import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set auth token for axios and localStorage
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  };

  // Load user data
  const loadUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Error loading user:', err);
      setUser(null);
      setAuthToken(null);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setAuthToken(res.data.token);
      await loadUser();
    } catch (err) {
      throw err; // Throw error to handle in component
    }
  };

  // Register function
  const register = async (name, email, password, role, clubName) => {
    try {
      const res = await axios.post('/api/auth/register', {
        name, email, password, role, clubName
      });
      setAuthToken(res.data.token);
      await loadUser();
    } catch (err) {
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  // Load user when token changes
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      loadUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. Export the context
export default AuthContext;