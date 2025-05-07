// get logged in user's info 
const API_URL = 'https://fitness-app-2.onrender.com';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

const fetchWithErrorHandling = async (url, options = {}) => {
  const fullUrl = `${API_URL}${url}`;
  console.log('Making request to:', fullUrl);
  
  try {
    const response = await fetch(fullUrl, {
      ...options,
      mode: 'cors',
      credentials: 'include',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
      console.error('API Error:', errorData);
      throw new Error(errorData.message || 'Something went wrong');
    }

    return response;
  } catch (error) {
    console.error('Fetch Error:', error);
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