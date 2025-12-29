'use client';

import { motion } from 'framer-motion';
import { Utensils, Coffee, IceCream, Pizza, Salad, Beef } from 'lucide-react';

const categories = [
  { id: 1, name: 'North Indian', icon: Utensils, color: 'from-orange-400 to-red-500', count: 120 },
  { id: 2, name: 'South Indian', icon: Coffee, color: 'from-yellow-400 to-orange-500', count: 95 },
  { id: 3, name: 'Gujarati', icon: Salad, color: 'from-green-400 to-emerald-500', count: 78 },
  { id: 4, name: 'Punjabi', icon: Pizza, color: 'from-red-400 to-pink-500', count: 150 },
  { id: 5, name: 'Bengali', icon: IceCream, color: 'from-blue-400 to-purple-500', count: 85 },
  { id: 6, name: 'Maharashtrian', icon: Beef, color: 'from-purple-400 to-indigo-500', count: 92 },
];

const Categories = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Explore by Cuisine
          </h2>
          <p className="text-gray-600 text-lg">
            Discover tiffin services by your favorite cuisine type
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="cursor-pointer group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-white`}
                  >
                    <Icon className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-center font-semibold text-gray-800 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-center text-sm text-gray-500">
                    {category.count} services
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;

