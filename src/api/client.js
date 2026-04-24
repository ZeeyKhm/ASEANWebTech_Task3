import axios from 'axios';

const API_BASE_URL = 'https://demomost.ru/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (name, email, password, passwordConfirmation) =>
    client.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),

  login: (email, password) =>
    client.post('/auth/login', { email, password }),

  logout: () =>
    client.post('/auth/logout'),

  me: () =>
    client.get('/auth/me'),
};

// Post endpoints
export const postsAPI = {
  getAll: (params) =>
    client.get('/posts', { params }),

  create: (message, latitude, longitude) =>
    client.post('/posts', {
      message,
      latitude,
      longitude,
    }),

  getOne: (postId) =>
    client.get(`/posts/${postId}`),

  delete: (postId) =>
    client.delete(`/posts/${postId}`),
};

// Comment endpoints
export const commentsAPI = {
  getByPost: (postId, params) =>
    client.get(`/posts/${postId}/comments`, { params }),

  create: (postId, message) =>
    client.post(`/posts/${postId}/comments`, { message }),

  delete: (commentId) =>
    client.delete(`/comments/${commentId}`),
};

// Reaction endpoints
export const reactionsAPI = {
  set: (postId, type) =>
    client.put(`/posts/${postId}/reaction`, { type }),

  remove: (postId) =>
    client.delete(`/posts/${postId}/reaction`),
};

export default client;
