'use client';

import { motion } from 'framer-motion';
import { Smartphone, Mail, Bell } from 'lucide-react';

const AppComingSoon = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6"
            >
              <Smartphone className="h-10 w-10" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Android App Coming Soon!
            </h2>
            <p className="text-xl text-white/90 mb-6 leading-relaxed">
              Get ready for a seamless ordering experience. Our Android app will make it even easier to order your favorite meals and manage your tiffin subscriptions.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Get Notified</h3>
                  <p className="text-white/80 text-sm">Be the first to know when we launch</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Early Access</h3>
                  <p className="text-white/80 text-sm">Sign up for exclusive early access</p>
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border-2 border-white/30">
                <p className="font-semibold">Notify Me When Available</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center md:justify-end"
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
              <div className="relative w-64 h-[500px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                {/* Phone Frame */}
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
                  
                  {/* Screen Content */}
                  <div className="h-full bg-gradient-to-br from-primary-50 to-white p-6 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-6">
                      <span className="text-4xl font-bold text-white">MT</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Mama's Thali</h3>
                    <p className="text-gray-600 text-center mb-8">Coming Soon</p>
                    <div className="w-full bg-white rounded-xl p-4 shadow-lg">
                      <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppComingSoon;

