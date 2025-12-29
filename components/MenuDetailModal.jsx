'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { closeDetailModal, selectSelectedItem, selectShowDetailModal } from '@/store/slices/menuSlice';
import { toggleFavorite, selectIsFavorite } from '@/store/slices/favoritesSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { useState } from 'react';

const MenuDetailModal = () => {
  const dispatch = useDispatch();
  const showModal = useSelector(selectShowDetailModal);
  const item = useSelector(selectSelectedItem);
  const isFavorite = useSelector((state) => item ? selectIsFavorite(state, item.id) : false);
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const handleClose = () => {
    dispatch(closeDetailModal());
    setQuantity(1);
  };

  const handleFavorite = () => {
    dispatch(toggleFavorite(item.id));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ item, quantity }));
    handleClose();
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>

              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 md:h-full min-h-[400px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
                  />
                  {item.popular && (
                    <div className="absolute top-4 left-4 bg-secondary-500 text-white px-4 py-2 rounded-full font-bold">
                      Popular
                    </div>
                  )}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                      <span className="text-white font-bold text-2xl">Currently Unavailable</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">{item.name}</h2>
                      <p className="text-lg text-gray-500 mb-4">{item.category}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleFavorite}
                      className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Heart
                        className={`h-6 w-6 ${
                          isFavorite ? 'fill-primary-600 text-primary-600' : 'text-gray-600'
                        }`}
                      />
                    </motion.button>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">{item.description}</p>

                  <div className="flex items-center space-x-4 mb-6">
                    {item.isVeg && (
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        VEGETARIAN
                      </span>
                    )}
                    {item.popular && (
                      <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                        ⭐ Popular
                      </span>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-4xl font-bold text-primary-600">₹{item.price}</span>
                      
                      {/* Quantity Selector */}
                      {item.isAvailable && (
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={decreaseQuantity}
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="h-5 w-5" />
                          </button>
                          <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                          <button
                            onClick={increaseQuantity}
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      Total: <span className="text-xl font-bold text-primary-600">₹{item.price * quantity}</span>
                    </div>

                    {item.isAvailable ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        className="w-full py-4 bg-primary-600 text-white rounded-full font-semibold text-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Plus className="h-6 w-6" />
                        <span>Add to Cart (₹{item.price * quantity})</span>
                      </motion.button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-4 bg-gray-300 text-gray-500 rounded-full font-semibold text-lg cursor-not-allowed"
                      >
                        Currently Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MenuDetailModal;

