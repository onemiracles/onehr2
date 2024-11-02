import axios from 'axios';
import authService from './authService';
import { config } from '@fortawesome/fontawesome-svg-core';

const API_URL = process.env.REACT_APP_API_URL;

class EmployeeService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/employees`,
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

  async getEmployees(tenantId) {
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

  async getEmployeeById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createEmployee(tenantId, employeeData) {
    try {
      const response = await this.api.post('/', employeeData, {
        headers: {
          'x-tenant-id': `${tenantId}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateEmployee(tenantId, id, updateData) {
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

  async deleteEmployee(tenantId, id) {
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

const employeeService = new EmployeeService();
export default employeeService;