import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' }
});

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('co_spotter_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('co_spotter_token');
  }
};

const stored = localStorage.getItem('co_spotter_token');
if (stored) setAuthToken(stored);
