'use client';

import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { selectIsFavorite } from '@/store/slices/favoritesSlice';
import { addToCart } from '@/store/slices/cartSlice';

const MenuItemCard = ({ item, index }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isFavorite = useSelector((state) => selectIsFavorite(state, item.id));

  const handleCardClick = () => {
    router.push(`/menu/${item.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item.id));
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (item.isAvailable) {
      dispatch(addToCart({ item, quantity: 1 }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={handleCardClick}
      className="group cursor-pointer h-full"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <motion.img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          {item.popular && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-4 left-4 bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-bold"
            >
              Popular
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? 'fill-primary-600 text-primary-600' : 'text-gray-600'
              }`}
            />
          </motion.button>
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Unavailable</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{item.category}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{item.description}</p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <div>
              <span className="text-2xl font-bold text-primary-600">₹{item.price}</span>
            </div>
            <div className="flex items-center space-x-2">
              {item.isVeg && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  VEG
                </span>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCartClick}
                disabled={!item.isAvailable}
                className={`p-2 rounded-full transition-colors ${
                  item.isAvailable
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Plus className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
