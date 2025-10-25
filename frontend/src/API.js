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
