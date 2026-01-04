'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, MapPin, Building, Package, Edit2, Save, X, LogOut } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getProfile, updateProfile, getMyOrders, logout, isAuthenticated } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    city: '',
    pincode: '',
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/signin');
      return;
    }

    loadProfile();
    loadOrders();
  }, [router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await getProfile();
      setUser(profile);
      setFormData({
        full_name: profile.full_name || '',
        address: profile.address || '',
        city: profile.city || '',
        pincode: profile.pincode || '',
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      if (err.message?.includes('Not authenticated') || err.message?.includes('Invalid token')) {
        logout();
        router.push('/signin');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const orderList = await getMyOrders();
      setOrders(orderList || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      await loadProfile(); // Reload profile to get updated data
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        address: user.address || '',
        city: user.city || '',
        pincode: user.pincode || '',
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      placed: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-purple-100 text-purple-800',
      preparing: 'bg-yellow-100 text-yellow-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your profile information and view order history</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information Card */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  {!isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </motion.button>
                  )}
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">{success}</p>
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 pt-4 pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Pincode */}
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                      >
                        <Save className="h-5 w-5" />
                        <span>Save Changes</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={handleCancel}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        <X className="h-5 w-5" />
                        <span>Cancel</span>
                      </motion.button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Full Name */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-lg font-semibold text-gray-900">{user.full_name || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <Phone className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="text-lg font-semibold text-gray-900">{user.phone || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Email */}
                    {user.email && (
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <Mail className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                        </div>
                      </div>
                    )}

                    {/* Address */}
                    {user.address && (
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-lg font-semibold text-gray-900">{user.address}</p>
                        </div>
                      </div>
                    )}

                    {/* City & Pincode */}
                    {(user.city || user.pincode) && (
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <Building className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">City & Pincode</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {user.city || 'N/A'} {user.pincode ? `- ${user.pincode}` : ''}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar - Quick Actions */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 mb-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </motion.button>
              </motion.div>

              {/* Order Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="text-2xl font-bold text-primary-600">{orders.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pending</span>
                    <span className="text-lg font-semibold text-yellow-600">
                      {orders.filter((o) => o.order_status === 'placed' || o.order_status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Delivered</span>
                    <span className="text-lg font-semibold text-green-600">
                      {orders.filter((o) => o.order_status === 'delivered').length}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Order History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Package className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No orders found</p>
                <p className="text-gray-500">Start ordering to see your order history here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
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
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-semibold text-gray-900">{formatDate(order.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Delivery Date</p>
                            <p className="font-semibold text-gray-900">{formatDate(order.delivery_date)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Meal Type</p>
                            <p className="font-semibold text-gray-900">{order.meal_type ? order.meal_type.charAt(0).toUpperCase() + order.meal_type.slice(1) : 'N/A'}</p>
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
                            <p className="text-sm text-gray-500">Payment</p>
                            <p className="font-semibold text-gray-900">{order.payment_status ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) : 'N/A'}</p>
                          </div>
                        </div>
                        {order.address && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-500">Delivery Address</p>
                            <p className="text-gray-900">{order.address}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                            order.order_status
                          )}`}
                        >
                          {getStatusText(order.order_status)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

