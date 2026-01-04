const API_BASE_URL = '/api';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requireAuth = false, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (requireAuth) {
      const token = this.getToken();
      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async signUp(email: string, password: string, fullName: string) {
    const data = await this.request<{ user: any; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async signIn(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me', { requireAuth: true });
  }

  signOut() {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Profiles
  async getProfile() {
    return this.request<any>('/profiles/me', { requireAuth: true });
  }

  async updateProfile(data: { full_name?: string; phone?: string; company?: string; avatar_url?: string }) {
    return this.request<any>('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth: true,
    });
  }

  // Scheduled Calls
  async getScheduledCalls() {
    return this.request<any[]>('/scheduled-calls', { requireAuth: true });
  }

  async getAvailability(date: string) {
    return this.request<string[]>(`/scheduled-calls/availability/${date}`);
  }

  async createScheduledCall(data: {
    guest_name: string;
    guest_email: string;
    scheduled_date: string;
    scheduled_time: string;
    notes?: string;
  }) {
    return this.request<any>('/scheduled-calls', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true,
    });
  }

  async updateScheduledCall(id: string, data: { status: string }) {
    return this.request<any>(`/scheduled-calls/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requireAuth: true,
    });
  }

  // Contact
  async submitContact(data: { name: string; email: string; message: string }) {
    return this.request<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true,
    });
  }
}

export const api = new ApiClient();
