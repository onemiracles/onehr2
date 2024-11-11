import axios from 'axios';
import authService from './authService';
import { config } from '@fortawesome/fontawesome-svg-core';

const API_URL = process.env.REACT_APP_API_URL;

class EmployeeService {
  constructor(tenantId) {
    this.api = axios.create({
      baseURL: `${API_URL}/employees`,
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': `${tenantId}`
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

  async getEmployees() {
    try {
      const response = await this.api.get('/');
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

  async createEmployee(employeeData) {
    try {
      const response = await this.api.post('/', employeeData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateEmployee(id, updateData) {
    try {
      const response = await this.api.put(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteEmployee(id) {
    try {
      const response = await this.api.delete(`/${id}`);
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

export default EmployeeService;