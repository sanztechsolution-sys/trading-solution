import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://trading-solution.onrender.com';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const apiKey = localStorage.getItem('apiKey');
        if (apiKey) {
          config.headers['X-API-Key'] = apiKey;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('apiKey');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/api/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string) {
    const response = await this.client.post('/api/auth/register', { email, password });
    return response.data;
  }

  // Webhook endpoints
  async getWebhooks() {
    const response = await this.client.get('/api/webhooks');
    return response.data;
  }

  async createWebhook(name: string) {
    const response = await this.client.post('/api/webhooks', { name });
    return response.data;
  }

  async updateWebhook(id: string, data: any) {
    const response = await this.client.put(`/api/webhooks/${id}`, data);
    return response.data;
  }

  async deleteWebhook(id: string) {
    const response = await this.client.delete(`/api/webhooks/${id}`);
    return response.data;
  }

  // Trade endpoints
  async getTrades(filters?: any) {
    const response = await this.client.get('/api/trades', { params: filters });
    return response.data;
  }

  async getTradeById(id: string) {
    const response = await this.client.get(`/api/trades/${id}`);
    return response.data;
  }

  async closeTrade(id: string) {
    const response = await this.client.post(`/api/trades/${id}/close`);
    return response.data;
  }

  // Stats endpoints
  async getDashboardStats() {
    const response = await this.client.get('/api/stats/dashboard');
    return response.data;
  }

  // Settings endpoints
  async getSettings() {
    const response = await this.client.get('/api/settings');
    return response.data;
  }

  async updateSettings(data: any) {
    const response = await this.client.put('/api/settings', data);
    return response.data;
  }

  // Logs endpoints
  async getLogs(filters?: any) {
    const response = await this.client.get('/api/logs', { params: filters });
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
