// Authentication utilities
import { apiClient } from './api-client';

export interface AuthUser {
  id: string;
  email: string;
  apiKey: string;
  mt5Account?: string;
  mt5Server?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly API_KEY = 'api_key';

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await apiClient.login(credentials.email, credentials.password);
    
    if (response.success) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
      this.setApiKey(response.data.user.apiKey);
      return response.data.user;
    }
    
    throw new Error(response.error || 'Login failed');
  }

  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const response = await apiClient.register(credentials.email, credentials.password);
    
    if (response.success) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
      this.setApiKey(response.data.user.apiKey);
      return response.data.user;
    }
    
    throw new Error(response.error || 'Registration failed');
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.API_KEY);
    window.location.href = '/login';
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get API key
   */
  getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY);
  }

  /**
   * Set auth token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Set user data
   */
  private setUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Set API key
   */
  private setApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY, apiKey);
  }

  /**
   * Regenerate API key
   */
  async regenerateApiKey(): Promise<string> {
    const response = await apiClient.client.post('/api/auth/regenerate-key');
    
    if (response.data.success) {
      const newApiKey = response.data.data.apiKey;
      this.setApiKey(newApiKey);
      
      // Update user object
      const user = this.getCurrentUser();
      if (user) {
        user.apiKey = newApiKey;
        this.setUser(user);
      }
      
      return newApiKey;
    }
    
    throw new Error(response.data.error || 'Failed to regenerate API key');
  }
}

export const authService = new AuthService();
export default authService;
