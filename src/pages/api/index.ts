/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import constants, { ROUTES_CONSTANTS } from '../../config/constants';
import { showAlert } from '../alert';

const baseURL = constants.APP_URL;

console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("constants.APP_URL:", constants.APP_URL);

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// **Attach token dynamically before each request**
axiosInstance.interceptors.request.use(
  async (config: any) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// **Handle successful response**
const handleResponse = async (response: any) => {
  // showAlert(response?.data?.message, 'success'); // Optional: show success alert
  return response.data;
};

// **Handle errors globally**
const handleError = async (error: any) => {
  let errorMessage = 'An error occurred';

  if (error?.response) {
    errorMessage = error.response.data?.message || errorMessage;
    console.error('API Error Response:', {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      url: error.config?.url,
      method: error.config?.method
    });
  } else if (error?.request) {
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Check your connection or try with smaller files.';
    } else {
      errorMessage = 'No response from server. Please try again.';
    }
    console.error('API Request Error:', {
      url: error.config?.url,
      method: error.config?.method,
      timeout: error.config?.timeout,
      errorCode: error.code
    });
  } else {
    console.error('API Error Setup:', error.message);
  }

  showAlert(errorMessage, 'error');

  if (error.response?.status === 401) {
    signOut();
    setTimeout(() => {
      window.location.href = `/${ROUTES_CONSTANTS.LOGIN}`;
    }, 2000);
  }

  return Promise.reject(errorMessage);
};

// Define API functions
const apiService = {
  get: (url: string, params = {}, headers = {}) =>
    axiosInstance.get(url, { headers, params }).then(handleResponse).catch(handleError),

  post: (url: string, data = {}, config: any = {}) =>
    axiosInstance.post(url, data, config).then(handleResponse).catch(handleError),

  put: (url: string, data = {}, config: any = {}) =>
    axiosInstance.put(url, data, config).then(handleResponse).catch(handleError),

  patch: (url: string, data = {}, config: any = {}) =>
    axiosInstance.patch(url, data, config).then(handleResponse).catch(handleError),

  delete: (url: string, config: any = {}) =>
    axiosInstance.delete(url, config).then(handleResponse).catch(handleError),
};

export default apiService;
