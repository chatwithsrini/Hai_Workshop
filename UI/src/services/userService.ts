import axios from '../utils/axios.utils';
import { LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post('/auth/signup', credentials);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  validateSession: async (): Promise<AuthResponse> => {
    try {
      const response = await axios.get('/auth/validate');
      return response.data;
    } catch (error) {
      console.error('Session validation error:', error);
      throw error;
    }
  }
};
