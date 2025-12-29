'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getMenuItems, saveMenuItems, getKitchenInfo, saveKitchenInfo } from '@/lib/storage';

export default function AdminPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [kitchenInfo, setKitchenInfo] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editingKitchen, setEditingKitchen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Thali',
    isVeg: true,
    isAvailable: true,
    image: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMenuItems(getMenuItems());
      setKitchenInfo(getKitchenInfo());
    }
  }, []);

  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price),
    };
    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    saveMenuItems(updated);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Thali',
      isVeg: true,
      isAvailable: true,
      image: '',
    });
    setShowAddForm(false);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      image: item.image,
    });
    setShowAddForm(true);
  };

  const handleUpdateItem = () => {
    const updated = menuItems.map((item) =>
      item.id === editingItem.id
        ? { ...editingItem, ...formData, price: parseFloat(formData.price) }
        : item
    );
    setMenuItems(updated);
    saveMenuItems(updated);
    setEditingItem(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Thali',
      isVeg: true,
      isAvailable: true,
      image: '',
    });
  };

  const handleDeleteItem = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updated = menuItems.filter((item) => item.id !== id);
      setMenuItems(updated);
      saveMenuItems(updated);
    }
  };

  const handleSaveKitchenInfo = () => {
    saveKitchenInfo(kitchenInfo);
    setEditingKitchen(false);
    alert('Kitchen information updated successfully!');
  };

  if (!kitchenInfo) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Your Kitchen</h1>
          <p className="text-gray-600">Add, edit, or remove menu items</p>
        </motion.div>

        {/* Kitchen Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Kitchen Information</h2>
            {!editingKitchen && (
              <button
                onClick={() => setEditingKitchen(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Edit2 className="h-5 w-5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {editingKitchen ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kitchen Name
                </label>
                <input
                  type="text"
                  value={kitchenInfo.name}
                  onChange={(e) => setKitchenInfo({ ...kitchenInfo, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={kitchenInfo.address}
                  onChange={(e) => setKitchenInfo({ ...kitchenInfo, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={kitchenInfo.phone}
                    onChange={(e) => setKitchenInfo({ ...kitchenInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={kitchenInfo.email}
                    onChange={(e) => setKitchenInfo({ ...kitchenInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={kitchenInfo.description}
                  onChange={(e) => setKitchenInfo({ ...kitchenInfo, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveKitchenInfo}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => {
                    setEditingKitchen(false);
                    setKitchenInfo(getKitchenInfo());
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
                >
                  <X className="h-5 w-5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-800">{kitchenInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-semibold text-gray-800">{kitchenInfo.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold text-gray-800">{kitchenInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-800">{kitchenInfo.email}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Menu Items</h2>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Menu Item</span>
              </button>
            )}
          </div>

          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-primary-200"
            >
              <h3 className="text-lg font-semibold mb-4">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Thali">Thali</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Rice">Rice</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="col-span-2 flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isVeg}
                      onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Vegetarian</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Available</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>{editingItem ? 'Update' : 'Add'} Item</span>
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      category: 'Thali',
                      isVeg: true,
                      isAvailable: true,
                      image: '',
                    });
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
                >
                  <X className="h-5 w-5" />
                  <span>Cancel</span>
                </button>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {menuItems.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No menu items yet. Add your first item!
              </p>
            ) : (
              menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-primary-600 font-bold">₹{item.price}</span>
                        <span className="text-sm text-gray-500">{item.category}</span>
                        {item.isVeg && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            VEG
                          </span>
                        )}
                        {!item.isAvailable && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

