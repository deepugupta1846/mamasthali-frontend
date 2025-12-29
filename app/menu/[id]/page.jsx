'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Heart } from 'lucide-react';
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
  
  // Get other menu items (excluding current) for bottom scroll
  const otherItems = menuItems.filter(item => item.id !== params.id && item.isAvailable);

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Item not found</h2>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-primary-600 text-white rounded-full"
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
    router.push('/cart');
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Menu</span>
        </motion.button>
      </div>

      {/* Item Details Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src={currentItem.image}
              alt={currentItem.name}
              className="w-full h-full object-cover"
            />
            {currentItem.popular && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute top-6 left-6 bg-secondary-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg"
              >
                Popular
              </motion.div>
            )}
            {!currentItem.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl">
                <span className="text-white font-bold text-2xl">Currently Unavailable</span>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg z-10"
            >
              <Heart
                className={`h-6 w-6 ${
                  isFavorite ? 'fill-primary-600 text-primary-600' : 'text-gray-600'
                }`}
              />
            </motion.button>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                {currentItem.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{currentItem.category}</p>
              <p className="text-gray-700 leading-relaxed text-lg">{currentItem.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              {currentItem.isVeg && (
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  VEGETARIAN
                </span>
              )}
              {currentItem.popular && (
                <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                  ⭐ Popular
                </span>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-5xl font-bold text-primary-600">₹{currentItem.price}</span>
                
                {/* Quantity Selector */}
                {currentItem.isAvailable && (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={decreaseQuantity}
                      className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="h-6 w-6" />
                    </button>
                    <span className="text-3xl font-bold w-16 text-center">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="h-6 w-6" />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-lg text-gray-600 mb-6">
                Total: <span className="text-3xl font-bold text-primary-600 ml-2">₹{currentItem.price * quantity}</span>
              </div>

              {currentItem.isAvailable ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full py-5 bg-primary-600 text-white rounded-full font-semibold text-xl hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="h-6 w-6" />
                  <span>Add to Cart (₹{currentItem.price * quantity})</span>
                </motion.button>
              ) : (
                <button
                  disabled
                  className="w-full py-5 bg-gray-300 text-gray-500 rounded-full font-semibold text-xl cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Other Menu Items - Horizontal Scroll */}
      {otherItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">More Items</h2>
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex space-x-4" style={{ width: 'max-content', paddingLeft: '1rem', paddingRight: '1rem' }}>
                {otherItems.map((item, index) => (
                  <div key={item.id} className="flex-shrink-0" style={{ width: '280px', height: '100%' }}>
                    <MenuItemCard item={item} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      <Footer />
    </div>
  );
}

