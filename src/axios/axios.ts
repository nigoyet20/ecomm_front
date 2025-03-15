import axios from 'axios';

const axoiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 5000,
});

axoiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const sessionId = localStorage.getItem('sessionId');
  const csrfToken = localStorage.getItem('csrf');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (sessionId) {
    config.headers['x-session-id'] = sessionId;
  }

  if (csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axoiosInstance;
