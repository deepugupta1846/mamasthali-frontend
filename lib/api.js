// API utility functions for authentication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Login user with phone and password
 */
export const login = async (phone, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token in localStorage
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register new user
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Get current user token from localStorage
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Logout user
 */
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return getAuthToken() !== null;
};

/**
 * Get authenticated user profile from API
 */
export const getProfile = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Get user's order history
 */
export const getMyOrders = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/my-order`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }

    return data.data;
  } catch (error) {
    console.error('Get orders error:', error);
    throw error;
  }
};

/**
 * Get public menu (available meals)
 */
export const getMenu = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/meal`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch menu');
    }

    return data.data;
  } catch (error) {
    console.error('Get menu error:', error);
    throw error;
  }
};

/**
 * Admin API Functions
 */

/**
 * Get admin dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard stats');
    }

    return data.data;
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    throw error;
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return data.data;
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

/**
 * Toggle user status (admin only)
 */
export const toggleUserStatus = async (userId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/user/${userId}/toggle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to toggle user status');
    }

    return data;
  } catch (error) {
    console.error('Toggle user status error:', error);
    throw error;
  }
};

/**
 * Get all meals (admin only - all meals including unavailable)
 */
export const getAllMeals = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/meal/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch meals');
    }

    return data.data;
  } catch (error) {
    console.error('Get all meals error:', error);
    throw error;
  }
};

/**
 * Add meal (admin only)
 */
export const addMeal = async (mealData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', mealData.name);
    formData.append('meal_type', mealData.meal_type);
    formData.append('price', mealData.price);
    if (mealData.description) {
      formData.append('description', mealData.description);
    }
    if (mealData.image && mealData.image instanceof File) {
      formData.append('image', mealData.image);
    }

    const response = await fetch(`${API_BASE_URL}/admin/meal/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type header - browser will set it with boundary for FormData
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add meal');
    }

    return data.data;
  } catch (error) {
    console.error('Add meal error:', error);
    throw error;
  }
};

/**
 * Update meal (admin only)
 */
export const updateMeal = async (mealId, mealData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', mealData.name);
    formData.append('meal_type', mealData.meal_type);
    formData.append('price', mealData.price);
    if (mealData.description) {
      formData.append('description', mealData.description);
    }
    if (mealData.image && mealData.image instanceof File) {
      formData.append('image', mealData.image);
    }

    const response = await fetch(`${API_BASE_URL}/admin/meal/${mealId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type header - browser will set it with boundary for FormData
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update meal');
    }

    return data;
  } catch (error) {
    console.error('Update meal error:', error);
    throw error;
  }
};

/**
 * Delete meal (admin only)
 */
export const deleteMeal = async (mealId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/meal/${mealId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete meal');
    }

    return data;
  } catch (error) {
    console.error('Delete meal error:', error);
    throw error;
  }
};

/**
 * Toggle meal availability (admin only)
 */
export const toggleMealAvailability = async (mealId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/meal/${mealId}/toggle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to toggle meal availability');
    }

    return data;
  } catch (error) {
    console.error('Toggle meal availability error:', error);
    throw error;
  }
};

/**
 * Get all orders (admin only)
 */
export const getAllOrders = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/order/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }

    return data.data;
  } catch (error) {
    console.error('Get all orders error:', error);
    throw error;
  }
};

/**
 * Update order status (admin only)
 */
export const updateOrderStatus = async (orderId, orderData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/order/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update order');
    }

    return data;
  } catch (error) {
    console.error('Update order status error:', error);
    throw error;
  }
};

