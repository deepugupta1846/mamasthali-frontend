'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Heart, ShoppingCart } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectMenuItems } from '@/store/slices/menuSlice';
import { toggleFavorite, selectIsFavorite } from '@/store/slices/favoritesSlice';
import { addToCart } from '@/store/slices/cartSlice';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MenuItemCard from '@/components/MenuItemCard';

export default function MenuItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const menuItems = useSelector(selectMenuItems);
  const [quantity, setQuantity] = useState(1);
  
  const currentItem = menuItems.find(item => item.id === params.id);
  const isFavorite = useSelector((state) => currentItem ? selectIsFavorite(state, currentItem.id) : false);
  
  // Get other menu items (excluding current) for vertical scroll
  const otherItems = menuItems.filter(item => item.id !== params.id && item.isAvailable);

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Item not found</h2>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleFavorite = () => {
    dispatch(toggleFavorite(currentItem.id));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ item: currentItem, quantity }));
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const totalPrice = currentItem.price * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
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

        {/* Item Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="p-6">
            {/* Header with Image and Basic Info */}
            <div className="flex gap-6 mb-6">
              {/* Image */}
              <div className="relative flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden bg-gray-200">
                <img
                  src={currentItem.image}
                  alt={currentItem.name}
                  className="w-full h-full object-cover"
                />
                {!currentItem.isAvailable && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold text-center px-2">Unavailable</span>
                  </div>
                )}
              </div>

              {/* Name and Price */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {currentItem.name}
                    </h1>
                    <p className="text-gray-500 mb-3">{currentItem.category}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleFavorite}
                    className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        isFavorite ? 'fill-primary-600 text-primary-600' : 'text-gray-400'
                      }`}
                    />
                  </motion.button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-gray-900">₹{currentItem.price}</span>
                  {currentItem.isVeg && (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-green-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Veg</span>
                    </div>
                  )}
                  {currentItem.popular && (
                    <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-200">
                      Popular
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {currentItem.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed">{currentItem.description}</p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            {currentItem.isAvailable ? (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-medium">Quantity:</span>
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1">
                      <button
                        onClick={decreaseQuantity}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                      >
                        <Minus className="h-4 w-4 text-gray-700" />
                      </button>
                      <span className="text-lg font-bold text-gray-900 w-8 text-center">{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                      >
                        <Plus className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-2xl font-bold text-gray-900">₹{totalPrice}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="px-6 py-3 bg-primary-600 text-white rounded-full font-semibold flex items-center space-x-2 shadow-lg hover:bg-primary-700 transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-700 font-semibold">This item is currently unavailable</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* More Items - Vertical Scroll */}
        {otherItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">More from our menu</h2>
            <div className="space-y-4">
              {otherItems.map((item, index) => (
                <MenuItemCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
