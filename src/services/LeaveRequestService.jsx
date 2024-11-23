import axios from 'axios';
import authService from './authService';
import { config } from '@fortawesome/fontawesome-svg-core';

const API_URL = process.env.REACT_APP_API_URL;

class LeaveRequestService {
  constructor(tenantId) {
    this.api = axios.create({
      baseURL: `${API_URL}/leaves`,
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

  async getLeaveRequests(params = {}) {
    try {
      const response = await this.api.get('/', {
        params: params
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getLeaveRequestById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createLeaveRequest(data) {
    try {
      const response = await this.api.post('/', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateLeaveRequest(id, data) {
    try {
      const response = await this.api.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateStatus(id, status) {
    try {
      const response = await this.api.put(`/${id}/status`, {status});
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteLeaveRequest(id) {
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

export default LeaveRequestService;