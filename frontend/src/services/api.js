import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login'
  },
  classes: '/classes',
  bookings: {
    create: '/bookings',
    byUser: (userId) => `/bookings/user/${userId}`,
    cancel: (bookingId) => `/bookings/${bookingId}/cancel`
  }
};

const api = axios.create({ baseURL: API_BASE_URL });

export default api;
