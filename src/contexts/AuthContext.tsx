import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthUser } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  regenerateApiKey: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await authService.login({ email, password });
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, confirmPassword: string) => {
    try {
      const user = await authService.register({ email, password, confirmPassword });
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const regenerateApiKey = async () => {
    try {
      const newApiKey = await authService.regenerateApiKey();
      
      // Update user state
      if (user) {
        setUser({ ...user, apiKey: newApiKey });
      }
      
      return newApiKey;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        regenerateApiKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
