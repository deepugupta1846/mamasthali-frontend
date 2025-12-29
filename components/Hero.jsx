'use client';

import { motion } from 'framer-motion';
import { ArrowRight, UtensilsCrossed, Clock, Star } from 'lucide-react';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="relative mt-20 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full"
            >
              <Star className="h-4 w-4 fill-primary-600" />
              <span className="text-sm font-semibold">Trusted by 10,000+ customers</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Fresh Home Cooked
              </span>
              <br />
              <span className="text-gray-800">Meals Delivered</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 leading-relaxed"
            >
              Fresh home-cooked meals from our kitchen in Mansarover, Jaipur. 
              Order authentic North Indian thalis and delicious tiffin meals 
              delivered right to your doorstep in Jaipur.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                <span>Order Now</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-full font-semibold hover:bg-primary-50 transition-colors"
              >
                <UtensilsCrossed className="h-5 w-5" />
                <span>Explore Services</span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {[
                { label: 'Tiffin Services', value: '500+' },
                { label: 'Daily Orders', value: '5K+' },
                { label: 'Cities', value: '25+' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image/Animation */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full"></div>
                      <div>
                        <div className="font-bold text-gray-800">Mama's Special Thali</div>
                        <div className="text-sm text-gray-500">Home Kitchen</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-gradient-to-br from-orange-200 to-orange-400 rounded-xl"></div>
                    <div className="h-32 bg-gradient-to-br from-green-200 to-green-400 rounded-xl"></div>
                    <div className="h-32 bg-gradient-to-br from-red-200 to-red-400 rounded-xl"></div>
                    <div className="h-32 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-xl"></div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">30 min</span>
                    </div>
                    <div className="text-xl font-bold text-primary-600">₹150</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-4 -right-4 bg-secondary-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold"
              >
                🔥 Hot & Fresh
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    </section>
  );
};

export default Hero;

