import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;

// Token refresh threshold (5 minutes before expiration)
const REFRESH_THRESHOLD = 5 * 60 * 1000;

class AuthService {
  constructor() {
    // Initialize axios instance with default config
    console.log(API_URL);
    this.api = axios.create({
      baseURL: `${API_URL}/auth`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for token refresh
    this.api.interceptors.request.use(
      async config => {
        const token = this.getToken();
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            const expirationTime = decodedToken.exp * 1000;
            const currentTime = Date.now();

            // Check if token needs refresh
            if (expirationTime - currentTime < REFRESH_THRESHOLD) {
              const newToken = await this.refreshToken();
              if (newToken) {
                config.headers.Authorization = `Bearer ${newToken}`;
              }
            } else {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            // Token decode failed, remove invalid token
            
          }
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Add response interceptor for 401/403 errors
    this.api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, logout user
            this.logout();
            throw refreshError;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    try {
      const response = await this.api.post('/login', {
        email,
        password
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async validateToken() {
    this.addAuthHeader();
    try {
      const response = await this.api.post('/validate');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken() {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        return null;
      }

      const response = await this.api.post('/refresh-token', 
        { refreshToken },
        {
          headers: { Authorization: `Bearer ${refreshToken}` }
        }
      );

      const { accessToken } = response.data; 

      return accessToken;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      const token = this.getToken();
      if (token) {
        await this.api.post('/logout', null, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async forgotPassword(email) {
    try {
      const response = await this.api.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await this.api.post('/reset-password', 
        {
          token,
          password: newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(oldPassword, newPassword) {
    try {
      const token = this.getToken();
      const response = await this.api.post('/change-password', 
        {
          oldPassword,
          newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  getToken() {
    return Cookies.get('authToken');
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }

  // Helper method to add auth header to any request
  addAuthHeader(config = {}) {
    const token = this.getToken();
    if (token) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`
        }
      };
    }
    return config;
  }

  // Method to update user profile with auth header
  async updateProfile(profileData) {
    try {
      const response = await this.api.put('/profile', 
        profileData,
        this.addAuthHeader()
      );
      
      const updatedUser = response.data;
      return updatedUser;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Method to verify email with auth header
  async verifyEmail(verificationToken) {
    try {
      const response = await this.api.post('/verify-email', 
        { token: verificationToken },
        {
          headers: { Authorization: `Bearer ${verificationToken}` }
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Method to resend verification email with auth header
  async resendVerificationEmail() {
    try {
      const token = this.getToken();
      const response = await this.api.post('/resend-verification', null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Token expired or invalid
      if (error.response.status === 401) {
        
      }
      const message = error.response.data.message || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      return new Error('No response received from server');
    } else {
      return new Error('An unexpected error occurred');
    }
  }

  // Create an axios instance with auth header for other services to use
  createAuthorizedRequest() {
    const token = this.getToken();
    return axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
  }
}

const authService = new AuthService();
export default authService;