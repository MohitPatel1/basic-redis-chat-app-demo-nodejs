import { API_BASE_URL } from '@/env';
import axios from 'axios';
console.log("API_BASE_URL here", API_BASE_URL);
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export default api; 