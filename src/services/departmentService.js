import axios from 'axios';
import authService from './authService';
import { config } from '@fortawesome/fontawesome-svg-core';

const API_URL = process.env.REACT_APP_API_URL;

class DepartmentService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/departments`,
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

  async getDepartments(tenantId) {
    try {
      const response = await this.api.get('/', {
        headers: {
          'x-tenant-id': `${tenantId}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDepartmentById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createDepartment(tenantId, data) {
    try {
      const response = await this.api.post('/', data, {
        headers: {
          'x-tenant-id': `${tenantId}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateDepartment(tenantId, id, updateData) {
    try {
      const response = await this.api.put(`/${id}`, updateData, {
        headers: {
          'x-tenant-id': `${tenantId}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteDepartment(tenantId, id) {
    try {
      const response = await this.api.delete(`/${id}`, {
        headers: {
          'x-tenant-id': `${tenantId}`
        }
      });
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

const departmentService = new DepartmentService();
export default departmentService;