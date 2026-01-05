'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectMenuItems } from '@/store/slices/menuSlice';
import { setMenuItems } from '@/store/slices/menuSlice';
import { getMenu } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MenuItemCardHorizontal from '@/components/MenuItemCardHorizontal';

export default function MenusPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const menuItems = useSelector(selectMenuItems);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const meals = await getMenu();
        
        // Map backend meal structure to frontend menu item structure
        const mappedMeals = meals.map((meal) => ({
          id: meal.id.toString(),
          name: meal.name,
          image: meal.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
          category: meal.meal_type ? meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1) : 'Meal',
          description: meal.description || '',
          price: parseFloat(meal.price) || 0,
          isAvailable: meal.is_available !== false,
          isVeg: true,
          popular: false,
        }));
        
        dispatch(setMenuItems(mappedMeals));
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        dispatch(setMenuItems([]));
      } finally {
        setLoading(false);
      }
    };

    // Fetch if menu items are not loaded
    if (menuItems.length === 0) {
      fetchMenu();
    } else {
      setLoading(false);
    }
  }, [dispatch, menuItems.length]);

  useEffect(() => {
    let items = menuItems.filter(item => item.isAvailable);

    // Apply category filter
    if (filter === 'all') {
      // Keep all items
    } else if (filter === 'popular') {
      items = items.filter(item => item.popular);
    } else if (filter === 'veg') {
      items = items.filter(item => item.isVeg);
    } else {
      items = items.filter(item => item.category === filter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    setFilteredItems(items);
  }, [filter, searchQuery, menuItems]);

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  const hasPopular = menuItems.some(item => item.popular);

  const getCategoryCount = (category) => {
    if (category === 'all') {
      return menuItems.filter(item => item.isAvailable).length;
    } else if (category === 'popular') {
      return menuItems.filter(item => item.isAvailable && item.popular).length;
    } else if (category === 'veg') {
      return menuItems.filter(item => item.isAvailable && item.isVeg).length;
    } else {
      return menuItems.filter(item => item.isAvailable && item.category === category).length;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </motion.button>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Our Complete Menu
          </h1>
          <p className="text-gray-600 text-lg">
            {filteredItems.length} items available • Mansarover, Jaipur
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </motion.div>

        <div className="flex gap-6">
          {/* Sidebar - Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block w-64 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Filters</h2>
              
              <div className="space-y-2">
                {/* All Items */}
                <button
                  onClick={() => setFilter('all')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    filter === 'all'
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>All Items</span>
                    <span className="text-sm text-gray-500">({getCategoryCount('all')})</span>
                  </div>
                </button>

                {/* Popular */}
                {hasPopular && (
                  <button
                    onClick={() => setFilter('popular')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      filter === 'popular'
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Popular</span>
                      <span className="text-sm text-gray-500">({getCategoryCount('popular')})</span>
                    </div>
                  </button>
                )}

                {/* Veg Only */}
                <button
                  onClick={() => setFilter('veg')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    filter === 'veg'
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Veg Only</span>
                    <span className="text-sm text-gray-500">({getCategoryCount('veg')})</span>
                  </div>
                </button>

                {/* Categories */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.filter(cat => cat !== 'all').map((category) => (
                      <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          filter === category
                            ? 'bg-primary-100 text-primary-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category}</span>
                          <span className="text-sm text-gray-500">({getCategoryCount(category)})</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filters - Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:hidden mb-6"
            >
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Items ({getCategoryCount('all')})</option>
                {hasPopular && <option value="popular">Popular ({getCategoryCount('popular')})</option>}
                <option value="veg">Veg Only ({getCategoryCount('veg')})</option>
                {categories.filter(cat => cat !== 'all').map((category) => (
                  <option key={category} value={category}>
                    {category} ({getCategoryCount(category)})
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Menu Items - Vertical Layout */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl">
                <p className="text-gray-500 text-lg mb-4">
                  {searchQuery ? 'No items found matching your search.' : 'No items available in this category.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <MenuItemCardHorizontal key={item.id} item={item} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
