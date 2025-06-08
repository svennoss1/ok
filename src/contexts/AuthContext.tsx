import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/authService';

const API_URL = 'https://sexypraat.nl/api';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  profilePicture?: string;
  bannerImage?: string;
  bio?: string;
  balance: number;
  role: 'premium' | 'vip' | 'royal' | 'user' | 'admin' | 'creator';
  isCreator: boolean;
  isAdmin?: boolean;
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (userData: any, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Verify session on initial load
  useEffect(() => {
    const verifySession = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/auth.php?action=verifySession`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        // If we get a 401, it means there's no active session, which is fine
        if (response.status === 401) {
          setUser(null);
          setIsAuthenticated(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Session verification failed');
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setUser(data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Session verification error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
    setLoading(false);
      }
    };

    verifySession();
  }, []);
  
  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth.php?action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok && !('error' in data)) {
        setUser(data);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data));
        return { success: true, user: data };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (userData: any, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const newUser = await AuthService.register({
        username: userData.username,
        email: userData.email,
        password,
        birthDate: userData.birthDate,
        gender: userData.gender,
        firstName: userData.firstName,
        lastName: userData.lastName
      });
      
      if (newUser) {
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth.php?action=logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      // Ignore errors during logout
    } finally {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    }
  };
  
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const response = await fetch(`${API_URL}/auth.php?action=updateProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,
          ...data
        }),
      });

      const responseData = await response.json();

      if ('error' in responseData) {
        throw new Error(responseData.error);
      }

      if (responseData.user) {
        setUser(responseData.user);
        localStorage.setItem('user', JSON.stringify(responseData.user));
      return true;
      }
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      updateProfile,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}