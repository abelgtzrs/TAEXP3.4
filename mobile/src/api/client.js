import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // silent
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Normalize error
    const message = err?.response?.data?.message || err.message || "Network Error";
    return Promise.reject({
      status: err?.response?.status,
      message,
      data: err?.response?.data,
    });
  }
);
