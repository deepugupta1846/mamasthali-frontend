'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Clock, MapPin, ArrowLeft, Plus, 
  Heart, Share2, Phone, MessageCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { getKitchenInfo, getMenuItems, initializeDefaultMenu } from '@/lib/storage';

export default function ServiceDetailPage({ params }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [kitchenInfo, setKitchenInfo] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeDefaultMenu();
      setKitchenInfo(getKitchenInfo());
      setMenuItems(getMenuItems());
    }
  }, []);

  if (!kitchenInfo) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  const categories = ['all', ...new Set(menuItems.map(dish => dish.category))];
  const filteredDishes = selectedCategory === 'all'
    ? menuItems.filter(item => item.isAvailable)
    : menuItems.filter(dish => dish.category === selectedCategory && dish.isAvailable);

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    alert(`${item.name} added to cart!`);
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
          <span>Back to Home</span>
        </motion.button>
      </div>

      {/* Hero Section */}
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
              src={kitchenInfo.image}
              alt={kitchenInfo.name}
              className="w-full h-full object-cover"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg"
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
                {kitchenInfo.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{kitchenInfo.cuisine}</p>
              <p className="text-gray-700 leading-relaxed">{kitchenInfo.description}</p>
            </div>

            {/* Rating and Info */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-gray-800">{kitchenInfo.rating}</span>
                <span className="text-gray-600">({kitchenInfo.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>{kitchenInfo.deliveryTime}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{kitchenInfo.address}</span>
              </div>
            </div>

            {/* Specialties */}
            {kitchenInfo.specialties && kitchenInfo.specialties.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {kitchenInfo.specialties.map((specialty, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a href={`tel:${kitchenInfo.phone}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors shadow-lg"
                >
                  <Phone className="h-5 w-5" />
                  <span>Call Now</span>
                </motion.button>
              </a>
              <a href={`https://wa.me/${kitchenInfo.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 px-6 py-4 bg-white border-2 border-primary-600 text-primary-600 rounded-full font-semibold hover:bg-primary-50 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>WhatsApp</span>
                </motion.button>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Menu Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Menu</h2>

          {/* Category Tabs */}
          {categories.length > 1 && (
            <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </div>
          )}

          {/* Dish Grid */}
          {filteredDishes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No items available in this category.</p>
              <Link href="/admin">
                <button className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700">
                  Add Menu Items
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish, index) => (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    {dish.image ? (
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                    {dish.isVeg && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        VEG
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{dish.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{dish.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">₹{dish.price}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAddToCart(dish)}
                        className="px-6 py-2 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="h-5 w-5" />
                        <span>Add</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
