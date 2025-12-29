'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectMenuItems } from '@/store/slices/menuSlice';
import MenuItemCard from './MenuItemCard';

const ServiceGrid = () => {
  const menuItems = useSelector(selectMenuItems);
  const [filter, setFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredItems(menuItems.filter(item => item.isAvailable));
    } else if (filter === 'popular') {
      setFilteredItems(menuItems.filter(item => item.isAvailable && item.popular));
    } else if (filter === 'veg') {
      setFilteredItems(menuItems.filter(item => item.isAvailable && item.isVeg));
    } else {
      setFilteredItems(menuItems.filter(item => item.isAvailable && item.category === filter));
    }
  }, [filter, menuItems]);

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  const hasPopular = menuItems.some(item => item.popular);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Our Menu
            </h2>
            <p className="text-gray-600">
              {filteredItems.length} items available • Mansarover, Jaipur
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="outline-none text-gray-700 font-medium cursor-pointer"
              >
                <option value="all">All Items</option>
                {hasPopular && <option value="popular">Popular</option>}
                <option value="veg">Veg Only</option>
                {categories.filter(cat => cat !== 'all').map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No items available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div key={item.id} className="h-full">
                <MenuItemCard item={item} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceGrid;
