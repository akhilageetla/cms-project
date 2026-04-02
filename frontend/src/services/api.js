import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth APIs
export const authAPI = {
  signup:    (data) => api.post('/auth/signup',     data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  signin:    (data) => api.post('/auth/signin',     data),
};

// Complaint APIs
export const complaintAPI = {
  create:       (data)      => api.post('/complaints',              data),
  list:         ()           => api.get('/complaints'),
  get:          (id)         => api.get(`/complaints/${id}`),
  feedback:     (id, data)   => api.post(`/complaints/${id}/feedback`, data),
};

export default api;
