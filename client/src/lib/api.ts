import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () =>
    api.get('/auth/profile'),
};

export const spotAPI = {
  getSpots: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  }) => api.get('/spots', { params }),
  
  getSpot: (id: string) =>
    api.get(`/spots/${id}`),
  
  createSpot: (data: {
    title: string;
    description: string;
    images: string[];
    location: { type: 'Point'; coordinates: [number, number]; address?: string };
    category: string;
    tags: string[];
    isPublic: boolean;
  }) => api.post('/spots', data),
  
  toggleLike: (id: string) =>
    api.post(`/spots/${id}/like`),
  
  addComment: (id: string, data: { content: string; parentComment?: string }) =>
    api.post(`/spots/${id}/comments`, data),
};
export const profilesAPI = {
  getProfiles: (params?: {
    page?: number;
    limit?: number;
    city?: string;
    state?: string;
    minRent?: number;
    maxRent?: number;
    gender?: string;
    foodPreference?: string;
    duration?: string;
    sortBy?: string;
  }) => api.get('/profiles', { params }),
  
  getProfile: (id: string) =>
    api.get(`/profiles/${id}`),
    
  getSuggestions: (params?: { q?: string; type?: string }) =>
    api.get('/profiles/search/suggestions', { params }),
    
  saveProfile: (id: string) =>
    api.post(`/profiles/${id}/save`),
  createProfile: (data) => api.post('/profiles', data),
  updateProfile: (id, data) => api.put(`/profiles/${id}`, data),
  updateRoomDetails: (id, data) => api.patch(`/profiles/${id}/room-details`, data),
};

export const uploadAPI = {
  uploadImages: (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

