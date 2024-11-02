import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL;

class TenantService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/tenants`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add auth token to requests
    this.api.interceptors.request.use(
      config => {
        const token = authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );
  }

  async getTenants() {
    try {
      const response = await this.api.get('/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTenantById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createTenant(tenantData) {
    try {
      const response = await this.api.post('/', tenantData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTenant(id, updateData) {
    try {
      const response = await this.api.put(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteTenant(id) {
    try {
      const response = await this.api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSubscriptionPlans() {
    try {
      const response = await this.api.get('/subscriptions');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSubscription(tenantId, planData) {
    try {
      const response = await this.api.put(`/${tenantId}/subscription`, planData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTenantMetrics(tenantId) {
    try {
      const response = await this.api.get(`/${tenantId}/metrics`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async checkFeatureAccess(tenantId, featureName) {
    try {
      const response = await this.api.get(`/${tenantId}/features/${featureName}`);
      return response.data.hasAccess;
    } catch (error) {
      return false;
    }
  }

  async getTenantSettings(tenantId) {
    try {
      const response = await this.api.get(`/${tenantId}/settings`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTenantSettings(tenantId, settings) {
    try {
      const response = await this.api.put(`/${tenantId}/settings`, settings);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const message = error.response.data.message || 'An error occurred';
      throw new Error(message);
    }
    throw error;
  }
}

const tenantService = new TenantService();
export default tenantService;