'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ShoppingCart, Menu, X, User, Heart } from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectCartCount } from '@/store/slices/cartSlice';
import { isAuthenticated } from '@/lib/api';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const cartCount = useSelector(selectCartCount);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check authentication status
    setAuthenticated(isAuthenticated());
    
    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = () => {
      setAuthenticated(isAuthenticated());
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Check auth status periodically (for same-tab login/logout)
    const interval = setInterval(() => {
      setAuthenticated(isAuthenticated());
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center"
            >
              <span className="text-2xl font-bold text-white">MT</span>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Mama's Thali
              </h1>
              <p className="text-xs text-gray-500">Home Cooked Meals</p>
            </div>
          </Link>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex flex-1 max-w-2xl mx-8"
          >
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Mansarover, Jaipur, Rajasthan"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                disabled
              />
            </div>
          </motion.div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/favorites">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Heart className="h-5 w-5" />
                <span className="hidden lg:block">Favorites</span>
              </motion.button>
            </Link>

            {/* Auth Buttons / Profile Icon */}
            {authenticated ? (
              <Link href="/profile">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative hidden sm:flex items-center justify-center w-10 h-10 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </motion.button>
              </Link>
            ) : (
              <>
                <Link href="/signin">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden lg:block">Sign In</span>
                  </motion.button>
                </Link>

                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 border border-primary-600 text-primary-600 rounded-full hover:bg-primary-50 transition-colors"
                  >
                    <span className="hidden lg:block">Sign Up</span>
                  </motion.button>
                </Link>
              </>
            )}

            <Link href="/cart">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:block">Cart</span>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-4 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Mansarover, Jaipur, Rajasthan"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex flex-col space-y-2">
                <Link href="/favorites">
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg w-full">
                    <Heart className="h-5 w-5" />
                    <span>Favorites</span>
                  </button>
                </Link>
                {authenticated ? (
                  <Link href="/profile">
                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg w-full">
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href="/signin">
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg w-full">
                        <User className="h-5 w-5" />
                        <span>Sign In</span>
                      </button>
                    </Link>
                    <Link href="/signup">
                      <button className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg w-full border border-primary-600">
                        <span>Sign Up</span>
                      </button>
                    </Link>
                  </>
                )}
                <Link href="/cart">
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg w-full">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart ({cartCount})</span>
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
