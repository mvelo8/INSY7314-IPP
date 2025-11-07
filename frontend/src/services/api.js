// src/services/api.js

// Determine API Base URL based on environment
// Option 1: Use Vite proxy (recommended for development)
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     (import.meta.env.VITE_HTTPS === 'true' 
                       ? 'https://localhost:5001/api' 
                       : 'http://localhost:5000/api');

console.log('🔗 API Base URL:', API_BASE_URL);

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Helper function for fetch with credentials
const secureFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include', // Important for HTTPS with cookies/sessions
    mode: 'cors', // Enable CORS
  });
};

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await secureFetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await secureFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await secureFetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await secureFetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  refreshToken: async () => {
    const response = await secureFetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Transactions API calls
export const transactionAPI = {
  create: async (transactionData) => {
    const response = await secureFetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(transactionData),
    });
    return handleResponse(response);
  },

  getMyTransactions: async () => {
    const response = await secureFetch(`${API_BASE_URL}/transactions/my`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAll: async () => {
    const response = await secureFetch(`${API_BASE_URL}/transactions`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await secureFetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateStatus: async (id, status, adminNotes = '') => {
    const response = await secureFetch(`${API_BASE_URL}/transactions/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, adminNotes }),
    });
    return handleResponse(response);
  },
};

// Admin API calls
export const adminAPI = {
  // Dashboard Statistics
  getDashboardStats: async () => {
    const response = await secureFetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // User Management
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await secureFetch(`${API_BASE_URL}/admin/users?${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getUserById: async (id) => {
    const response = await secureFetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createUser: async (userData) => {
    const response = await secureFetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  updateUserRole: async (userId, role) => {
    const response = await secureFetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    return handleResponse(response);
  },

  deleteUser: async (userId) => {
    const response = await secureFetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Transaction Management
  getAllTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await secureFetch(`${API_BASE_URL}/admin/transactions?${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getTransactionById: async (id) => {
    const response = await secureFetch(`${API_BASE_URL}/admin/transactions/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateTransactionStatus: async (transactionId, status, adminNotes = '') => {
    const response = await secureFetch(`${API_BASE_URL}/admin/transactions/${transactionId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, adminNotes }),
    });
    return handleResponse(response);
  },

  // Reports and Analytics
  getReports: async (reportType, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await secureFetch(`${API_BASE_URL}/admin/reports/${reportType}?${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  exportData: async (format, dataType, params = {}) => {
    const queryString = new URLSearchParams({ ...params, dataType }).toString();
    const response = await secureFetch(`${API_BASE_URL}/admin/export/${format}?${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // System Management
  getSystemLogs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await secureFetch(`${API_BASE_URL}/admin/system/logs?${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  clearCache: async (cacheType) => {
    const response = await secureFetch(`${API_BASE_URL}/admin/system/cache`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ cacheType }),
    });
    return handleResponse(response);
  },
};

// Employee API calls (for employee role)
export const employeeAPI = {
  getAssignedTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await secureFetch(`${API_BASE_URL}/employee/transactions?${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateTransaction: async (transactionId, updateData) => {
    const response = await secureFetch(`${API_BASE_URL}/employee/transactions/${transactionId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  },

  getCustomerTransactions: async (customerId) => {
    const response = await secureFetch(`${API_BASE_URL}/employee/customers/${customerId}/transactions`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// User API calls (for profile management)
export const userAPI = {
  updateProfile: async (userData) => {
    const response = await secureFetch(`${API_BASE_URL}/auth/update/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  changePassword: async (passwordData) => {
    const response = await secureFetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });
    return handleResponse(response);
  },

  deleteAccount: async () => {
    const response = await secureFetch(`${API_BASE_URL}/auth/delete-account`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Utility functions
export const apiUtils = {
  // File upload helper
  uploadFile: async (file, endpoint) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await secureFetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeaders().Authorization,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Download file helper
  downloadFile: async (url, filename) => {
    const response = await secureFetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  // API health check
  healthCheck: async () => {
    const response = await secureFetch(`${API_BASE_URL.replace('/api', '')}/test`);
    return handleResponse(response);
  },

  // Get server status
  getServerStatus: async () => {
    const response = await secureFetch(`${API_BASE_URL}/admin/system/status`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Global fetch interceptor for automatic token handling
const originalFetch = window.fetch;
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

window.fetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Add auth token to all requests
  if (token && options.headers && !options.headers.Authorization) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  try {
    let response = await originalFetch(url, options);
    
    // Handle 401 Unauthorized (token expired)
    if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
      
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const refreshResponse = await authAPI.refreshToken();
          
          if (refreshResponse.token) {
            localStorage.setItem('token', refreshResponse.token);
            isRefreshing = false;
            onRefreshed(refreshResponse.token);
            
            // Retry original request with new token
            if (options.headers) {
              options.headers.Authorization = `Bearer ${refreshResponse.token}`;
            }
            response = await originalFetch(url, options);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          isRefreshing = false;
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw refreshError;
        }
      } else {
        // Wait for token refresh to complete
        const newToken = await new Promise(resolve => {
          addRefreshSubscriber(resolve);
        });
        
        if (options.headers) {
          options.headers.Authorization = `Bearer ${newToken}`;
        }
        response = await originalFetch(url, options);
      }
    }
    
    return response;
  } catch (error) {
    console.error('🚨 API Request failed:', error);
    throw error;
  }
};

// Export default object with all APIs
export default {
  auth: authAPI,
  transactions: transactionAPI,
  admin: adminAPI,
  employee: employeeAPI,
  user: userAPI,
  utils: apiUtils,
};