/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import constants, { ROUTES_CONSTANTS } from '../config/constants';
import { showAlert } from '../pages/alert';

const baseURL = constants.APP_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache session briefly to avoid hammering /api/auth/session on bursts
let cachedSession: any = null;
let cachedAt = 0;
const CACHE_TTL_MS = 5_000;

const getCachedSession = async () => {
  const now = Date.now();
  if (cachedSession && now - cachedAt < CACHE_TTL_MS) {
    return cachedSession;
  }
  const session = await getSession();
  cachedSession = session;
  cachedAt = now;
  return session;
};

/** Bust the session cache so the next request picks up a refreshed token. */
const bustSessionCache = () => {
  cachedSession = null;
  cachedAt = 0;
};

// Track whether a token refresh is already in flight so concurrent 401s
// don't trigger multiple refreshes (and multiple sign-outs).
let refreshPromise: Promise<any> | null = null;

// **Attach token dynamically before each request**
axiosInstance.interceptors.request.use(
  async (config: any) => {
    const session = await getCachedSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error),
);

// **Response interceptor: refresh-and-retry on 401**
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // Only attempt refresh once per request (_retry flag prevents loops)
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      // If another request is already refreshing, wait for it
      if (!refreshPromise) {
        bustSessionCache();
        // getSession() triggers the NextAuth jwt() callback which runs
        // refreshAccessToken() when the token is near/past expiry.
        refreshPromise = getSession()
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        const freshSession = await refreshPromise;

        // If the refresh succeeded and we have a valid token, retry the
        // original request with the new token.
        if (freshSession?.accessToken && !freshSession?.error) {
          bustSessionCache();
          originalRequest.headers.Authorization = `Bearer ${freshSession.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch {
        // refresh itself failed — fall through to sign-out below
      }

      // Refresh truly failed or returned an error — sign out cleanly.
      bustSessionCache();
      const session = await getSession();
      if (session?.accessToken) {
        showAlert('Session expired. Please login again.', 'error');
        signOut();
        setTimeout(() => {
          window.location.href = `/${ROUTES_CONSTANTS.LOGIN}`;
        }, 2000);
      }
    }

    return Promise.reject(error);
  },
);

// **Handle successful response**
const handleResponse = async (response: any) => {
  return response.data;
};

// **Handle non-401 errors globally**
const handleError = async (error: any) => {
  let errorMessage = 'An error occurred';

  if (error?.response) {
    errorMessage = error.response.data?.message || errorMessage;
    console.error('API Error Response:', {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      url: error.config?.url,
      method: error.config?.method,
    });
  } else if (error?.request) {
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Check your connection or try with smaller files.';
      showAlert(errorMessage, 'error');
    } else {
      errorMessage = 'No response from server. Please try again.';
      showAlert(errorMessage, 'error');
    }
    console.error('API Request Error:', {
      url: error.config?.url,
      method: error.config?.method,
      timeout: error.config?.timeout,
      errorCode: error.code,
    });
  } else {
    console.error('API Error Setup:', error.message);
  }

  // Return a plain object (not Error instance) to preserve details without triggering dev overlay
  return Promise.reject({
    message: errorMessage,
    response: error.response,
    request: error.request,
    config: error.config,
  });
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
