import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('sim_logistics_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
        return null;
      }
    }
    return null;
  });
  
  const [isLoading] = useState(false);

  const login = (username, password) => {
    // Simulate a database check
    const users = JSON.parse(localStorage.getItem('sim_logistics_users') || '[]');
    const existingUser = users.find(u => u.username === username && u.password === password);
    
    if (existingUser) {
      const userData = { username: existingUser.username };
      setUser(userData);
      localStorage.setItem('sim_logistics_user', JSON.stringify(userData));
      return { success: true };
    } else {
      return { success: false, message: '用户名或密码错误' };
    }
  };

  const register = (username, password) => {
    const users = JSON.parse(localStorage.getItem('sim_logistics_users') || '[]');
    const userExists = users.some(u => u.username === username);

    if (userExists) {
      return { success: false, message: '用户名已存在' };
    }

    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem('sim_logistics_users', JSON.stringify(users));
    
    // Auto login after register
    const userData = { username };
    setUser(userData);
    localStorage.setItem('sim_logistics_user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sim_logistics_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
