import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  username?: string;
  avatarUrl?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // Invalid user data
        }
      }
      
      // Fetch fresh user data from backend
      const fetchUser = async () => {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969';
          const response = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (err) {
          console.error('Failed to fetch user data:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user && !!token,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
