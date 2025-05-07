// get logged in user's info 
const API_URL = 'https://fitness-app-backend-si9o.onrender.com/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const fetchWithErrorHandling = async (url, options = {}) => {
  const fullUrl = `${API_URL}${url}`;
  console.log('Making request to:', fullUrl);
  console.log('Request options:', {
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body ? JSON.parse(options.body) : undefined
  });
  
  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'include'
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json().catch(() => ({ message: 'Failed to parse response' }));
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      url: fullUrl,
      status: error.status
    });
    throw error;
  }
};

export const getMe = (token) => {
  return fetchWithErrorHandling('/api/user/me', {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (userData) => {
  console.log('Creating user with data:', { ...userData, password: '[REDACTED]' });
  return fetchWithErrorHandling('/api/user', {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData) => {
  return fetchWithErrorHandling('/api/user/login', {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const createCardio = (cardioData, token) => {
  return fetchWithErrorHandling('/api/exercise/cardio', {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cardioData)
  });
};

export const createResistance = (resistanceData, token) => {
  return fetchWithErrorHandling('/api/exercise/resistance', {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(resistanceData)
  });
};

export const getCardioById = (cardioId, token) => {
  return fetchWithErrorHandling(`/api/exercise/cardio/${cardioId}`, {
    headers: {
      authorization: `Bearer ${token}`,
    }
  });
};

export const getResistanceById = (resistanceId, token) => {
  return fetchWithErrorHandling(`/api/exercise/resistance/${resistanceId}`, {
    headers: {
      authorization: `Bearer ${token}`,
    }
  });
};

export const deleteCardio = (cardioId, token) => {
  return fetchWithErrorHandling(`/api/exercise/cardio/${cardioId}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    }
  });
};

export const deleteResistance = (resistanceId, token) => {
  return fetchWithErrorHandling(`/api/exercise/resistance/${resistanceId}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    }
  });
};