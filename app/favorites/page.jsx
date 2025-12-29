'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectFavorites } from '@/store/slices/favoritesSlice';
import { selectMenuItems } from '@/store/slices/menuSlice';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MenuItemCard from '@/components/MenuItemCard';

export default function FavoritesPage() {
  const favorites = useSelector(selectFavorites);
  const menuItems = useSelector(selectMenuItems);
  const favoriteItems = menuItems.filter(item => favorites.includes(item.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Favorites</h1>
          <p className="text-gray-600">
            {favoriteItems.length} favorite item(s)
          </p>
        </motion.div>

        {favoriteItems.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-8">Start adding items to your favorites!</p>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse Menu
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteItems.map((item, index) => (
              <div key={item.id} className="h-full">
                <MenuItemCard item={item} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
