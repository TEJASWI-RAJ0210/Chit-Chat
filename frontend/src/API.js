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

//friend apis
export const searchUser = async (username) => {
  try {
    return await api.get(`/friends/search/${username}`);
  }
  catch (error){
    throw new Error(
      error.response?.data?.message || "failed to search"
    );
  }

};

export const sendFriendRequest = async (receiverId) => {
  try {
    return await api.post(`/friends/request/${receiverId}`);
  }catch (error){
    throw new Error(
      error.response?.data?.message || "failed to send request"
    );
  }
};

export const acceptFriendRequest = async (senderId) => {
  try {
    return await api.post(`/friends/accept/${senderId}`);
  }catch (error){
    throw new Error(
      error.response?.data?.message || "failed to accept request"
    );
  }
};

export const rejectFriendRequest = async (senderId) => {
  try {
    return await api.post(`/friends/reject/${senderId}`);
  }catch (error){
    throw new Error(
      error.response?.data?.message || "failed to reject request"
    );
  }
};

export const getFriendRequests = async () => {
  try {
    return await api.get('/friends/requests');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'failed to fetch requests');
  }
};

export const getChats = async (userId) => {
  try {
    return await api.get(`/chat/${userId}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "failed to fetch chats"
    );
  }
};

export const createChat = async (friendId) => {
  try {
    const userId = localStorage.getItem('userId');
    return await api.post('/chat', { userId1: userId, userId2: friendId });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'failed to create chat');
  }
}

export const getMessages = async (chatId) => {
  try {
    return await api.get(`/messages/${chatId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'failed to fetch messages');
  } 
}

export const sendMessage = async (chatId, text) => {
  try {
    return await api.post("/messages", {
      chatID: chatId,
      senderID: localStorage.getItem("userId"),
      text
    });
  } catch (error) {
    console.error(error.response?.data);
    throw new Error("Error sending message");
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

export const analyzeSentiment = async (message) => {
  try {
    const response = await api.post('/ai/sentiment', { message });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
}

export default api;