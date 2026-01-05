'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Users, Package, ShoppingBag, TrendingUp, Edit2, Trash2, Plus, 
  X, Save, Power, PowerOff, Eye, EyeOff, AlertCircle 
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  isAuthenticated, getCurrentUser, logout,
  getDashboardStats, getAllUsers, toggleUserStatus,
  getAllMeals, addMeal, updateMeal, deleteMeal, toggleMealAvailability,
  getAllOrders, updateOrderStatus
} from '@/lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dashboard stats
  const [stats, setStats] = useState(null);
  
  // Users
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // Meals
  const [meals, setMeals] = useState([]);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [mealFormData, setMealFormData] = useState({
    name: '',
    description: '',
    meal_type: 'breakfast',
    price: '',
    image: null,
    imagePreview: null,
  });
  
  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard' && isAuthenticated()) {
      loadDashboardStats();
    } else if (activeTab === 'users' && isAuthenticated()) {
      loadUsers();
    } else if (activeTab === 'meals' && isAuthenticated()) {
      loadMeals();
    } else if (activeTab === 'orders' && isAuthenticated()) {
      loadOrders();
    }
  }, [activeTab]);

  const checkAdminAccess = () => {
    if (!isAuthenticated()) {
      router.push('/signin');
      return;
    }

    const user = getCurrentUser();
    if (user?.role !== 'admin') {
      setError('Access denied. Admin access only.');
      setTimeout(() => {
        router.push('/');
      }, 2000);
      return;
    }

    setLoading(false);
  };

  const loadDashboardStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard stats');
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const loadMeals = async () => {
    try {
      setMealsLoading(true);
      const data = await getAllMeals();
      setMeals(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load meals');
    } finally {
      setMealsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await getAllOrders();
      setOrders(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await toggleUserStatus(userId);
      setSuccess('User status updated successfully');
      await loadUsers();
    } catch (err) {
      setError(err.message || 'Failed to update user status');
    }
  };

  const handleMealSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMeal) {
        await updateMeal(editingMeal.id, mealFormData);
        setSuccess('Meal updated successfully');
      } else {
        await addMeal(mealFormData);
        setSuccess('Meal added successfully');
      }
      setShowMealForm(false);
      setEditingMeal(null);
      setMealFormData({
        name: '',
        description: '',
        meal_type: 'breakfast',
        price: '',
        image: null,
        imagePreview: null,
      });
      await loadMeals();
    } catch (err) {
      setError(err.message || 'Failed to save meal');
    }
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setMealFormData({
      name: meal.name || '',
      description: meal.description || '',
      meal_type: meal.meal_type || 'breakfast',
      price: meal.price?.toString() || '',
      image: null,
      imagePreview: meal.image_url || null,
    });
    setShowMealForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMealFormData({
        ...mealFormData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!confirm('Are you sure you want to delete this meal?')) return;
    try {
      await deleteMeal(mealId);
      setSuccess('Meal deleted successfully');
      await loadMeals();
    } catch (err) {
      setError(err.message || 'Failed to delete meal');
    }
  };

  const handleToggleMealAvailability = async (mealId) => {
    try {
      await toggleMealAvailability(mealId);
      setSuccess('Meal availability updated');
      await loadMeals();
    } catch (err) {
      setError(err.message || 'Failed to toggle meal availability');
    }
  };

  const handleUpdateOrderStatus = async (orderId, statusData) => {
    try {
      await updateOrderStatus(orderId, statusData);
      setSuccess('Order status updated successfully');
      setEditingOrder(null);
      await loadOrders();
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-purple-100 text-purple-800',
      preparing: 'bg-yellow-100 text-yellow-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && error.includes('Access denied')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h2>
            <p className="text-red-700">{error}</p>
            <p className="text-red-600 mt-4">Redirecting to home page...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'meals', label: 'Meals', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage users, meals, and orders</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => setError('')}
                className="mt-2 text-sm text-red-700 hover:underline"
              >
                Dismiss
              </button>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <p className="text-green-600">{success}</p>
              <button
                onClick={() => setSuccess('')}
                className="mt-2 text-sm text-green-700 hover:underline"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-6">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="p-6">
                {stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
                    >
                      <Users className="h-8 w-8 mb-2" />
                      <p className="text-blue-100 text-sm mb-1">Total Users</p>
                      <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
                    >
                      <ShoppingBag className="h-8 w-8 mb-2" />
                      <p className="text-green-100 text-sm mb-1">Total Orders</p>
                      <p className="text-3xl font-bold">{stats.totalOrders || 0}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white"
                    >
                      <Package className="h-8 w-8 mb-2" />
                      <p className="text-yellow-100 text-sm mb-1">Today's Orders</p>
                      <p className="text-3xl font-bold">{stats.todayOrders || 0}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
                    >
                      <TrendingUp className="h-8 w-8 mb-2" />
                      <p className="text-purple-100 text-sm mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold">₹{stats.totalRevenue?.toFixed(2) || '0.00'}</p>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="p-6">
                {usersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">City</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">{user.full_name}</td>
                            <td className="py-3 px-4">{user.phone}</td>
                            <td className="py-3 px-4">{user.email || 'N/A'}</td>
                            <td className="py-3 px-4">{user.city || 'N/A'}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                                  user.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {user.is_active ? 'Active' : 'Blocked'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleToggleUserStatus(user.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  user.is_active
                                    ? 'text-red-600 hover:bg-red-50'
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={user.is_active ? 'Block User' : 'Activate User'}
                              >
                                {user.is_active ? (
                                  <PowerOff className="h-5 w-5" />
                                ) : (
                                  <Power className="h-5 w-5" />
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Meals Tab */}
            {activeTab === 'meals' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Meal Management</h2>
                  {!showMealForm && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingMeal(null);
                        setMealFormData({
                          name: '',
                          description: '',
                          meal_type: 'breakfast',
                          price: '',
                          image: null,
                          imagePreview: null,
                        });
                        setShowMealForm(true);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add Meal</span>
                    </motion.button>
                  )}
                </div>

                {showMealForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-primary-200"
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      {editingMeal ? 'Edit Meal' : 'Add New Meal'}
                    </h3>
                    <form onSubmit={handleMealSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={mealFormData.name}
                            onChange={(e) =>
                              setMealFormData({ ...mealFormData, name: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (₹) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={mealFormData.price}
                            onChange={(e) =>
                              setMealFormData({ ...mealFormData, price: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={mealFormData.description}
                          onChange={(e) =>
                            setMealFormData({ ...mealFormData, description: e.target.value })
                          }
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meal Type *
                          </label>
                          <select
                            value={mealFormData.meal_type}
                            onChange={(e) =>
                              setMealFormData({ ...mealFormData, meal_type: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            required
                          >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="premium">Premium</option>
                            <option value="special">Special</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          />
                          {mealFormData.imagePreview && (
                            <div className="mt-3">
                              <img
                                src={mealFormData.imagePreview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg border border-gray-300"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          <Save className="h-5 w-5" />
                          <span>{editingMeal ? 'Update' : 'Add'} Meal</span>
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => {
                            setShowMealForm(false);
                            setEditingMeal(null);
                            setMealFormData({
                              name: '',
                              description: '',
                              meal_type: 'breakfast',
                              price: '',
                              image: null,
                              imagePreview: null,
                            });
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <X className="h-5 w-5" />
                          <span>Cancel</span>
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {mealsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : meals.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No meals found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {meals.map((meal) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                      >
                        {meal.image_url && (
                          <img
                            src={meal.image_url}
                            alt={meal.name}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                              <p className="text-sm text-gray-500 capitalize">{meal.meal_type}</p>
                            </div>
                            <span className="text-primary-600 font-bold">₹{meal.price}</span>
                          </div>
                          {meal.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {meal.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                meal.is_available
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {meal.is_available ? 'Available' : 'Unavailable'}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditMeal(meal)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleMealAvailability(meal.id)}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                title={meal.is_available ? 'Mark Unavailable' : 'Mark Available'}
                              >
                                {meal.is_available ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteMeal(meal.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="p-6">
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-500">Order ID</p>
                                <p className="font-semibold text-gray-900">#{order.id}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Customer</p>
                                <p className="font-semibold text-gray-900">
                                  {order.user?.full_name || 'N/A'} ({order.user?.phone || 'N/A'})
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-semibold text-gray-900">{formatDate(order.created_at)}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-500">Meal Type</p>
                                <p className="font-semibold text-gray-900 capitalize">{order.meal_type || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Quantity</p>
                                <p className="font-semibold text-gray-900">{order.quantity || 1}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Amount</p>
                                <p className="font-semibold text-gray-900">₹{order.total_amount?.toFixed(2) || '0.00'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Delivery Date</p>
                                <p className="font-semibold text-gray-900">{formatDate(order.delivery_date)}</p>
                              </div>
                            </div>
                            {order.address && (
                              <div className="mb-3">
                                <p className="text-sm text-gray-500">Delivery Address</p>
                                <p className="text-gray-900">{order.address}</p>
                              </div>
                            )}
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">Order Status</p>
                                <span
                                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                    order.order_status
                                  )}`}
                                >
                                  {getStatusText(order.order_status)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Payment Status</p>
                                <span
                                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                    order.payment_status
                                  )}`}
                                >
                                  {getStatusText(order.payment_status)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {editingOrder === order.id ? (
                              <div className="space-y-2">
                                <select
                                  value={order.order_status}
                                  onChange={(e) =>
                                    handleUpdateOrderStatus(order.id, {
                                      order_status: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 mb-2"
                                >
                                  <option value="placed">Placed</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="preparing">Preparing</option>
                                  <option value="out_for_delivery">Out for Delivery</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <select
                                  value={order.payment_status}
                                  onChange={(e) =>
                                    handleUpdateOrderStatus(order.id, {
                                      payment_status: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="paid">Paid</option>
                                  <option value="failed">Failed</option>
                                </select>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingOrder(order.id)}
                                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                                <span>Update</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
