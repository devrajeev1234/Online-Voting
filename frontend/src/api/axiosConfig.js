// Axios configuration for API requests
import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: '/api', // Proxy to backend via Vite
  withCredentials: true, // Include cookies for session management
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;



