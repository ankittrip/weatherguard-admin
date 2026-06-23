import axios from 'axios';

/**
 * Configured Axios instance for API communication.
 * Automatically handles the base URL and default headers.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000, // Best practice: abort requests that take longer than 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------------------------------------------------------
// Request Interceptor
// ----------------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token just before the request is sent
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request setup errors before they are sent
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------------
// Response Interceptor
// ----------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => {
    // Any status code within the 2xx range triggers this function
    return response;
  },
  (error) => {
    // Any status code outside the 2xx range triggers this function
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized: Token may be invalid or expired.');
      
      // Add logic here to automatically log the user out, for example:
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);