// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Provider API - FIXED: Added missing export
export const providerAPI = {
  register: (providerData) => api.post('/providers/register', providerData),
  list: (params = {}) => api.get('/providers', { params }),
  getById: (id) => api.get(`/providers/${id}`),
};

// Booking API
export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  confirm: (bookingId) => api.put(`/bookings/${bookingId}/confirm`),
  getUserBookings: () => api.get('/bookings/user'),
  getById: (bookingId) => api.get(`/bookings/${bookingId}`),
  cancel: (bookingId) => api.put(`/bookings/${bookingId}/cancel`),
};

export default api;