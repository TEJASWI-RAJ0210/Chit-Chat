import axios from 'axios';
import { API_URL } from './config/config.js';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response; // return full axios response (status, data)
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const signin = async (userData) => {
  try {
    const response = await api.post('/auth/signin', userData);
    return response; // return full axios response
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};
/* Check username availability */
export const checkUsernameAvailability = async (username) => {
  try {
    return await api.post("/auth/check-username", { username });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Username check failed"
    );
  }
};

/* Set username */
export const setUsername = async (userId, username) => {
  try {
    return await api.post("/auth/set-username", {
      userId,
      username,
    });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Set username failed"
    );
  }
};

// Automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;