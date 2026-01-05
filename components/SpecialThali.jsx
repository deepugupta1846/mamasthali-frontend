'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getMealsByCategory } from '@/lib/api';

const SpecialThali = () => {
  const router = useRouter();
  const [specialMeals, setSpecialMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialMeals = async () => {
      try {
        setLoading(true);
        const meals = await getMealsByCategory('special', 4);
        
        // Map backend meal structure to frontend menu item structure
        const mappedMeals = meals.map((meal) => ({
          id: meal.id.toString(),
          name: meal.name,
          image: meal.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
          price: parseFloat(meal.price) || 0,
          description: meal.description || '',
          isAvailable: meal.is_available !== false,
        }));
        
        setSpecialMeals(mappedMeals);
      } catch (error) {
        console.error('Failed to fetch special meals:', error);
        setSpecialMeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialMeals();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (specialMeals.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Mama's Special Thali
          </h2>
          <p className="text-gray-600 text-lg">
            Our chef's special selection of delicious thalis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialMeals.map((meal, index) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => router.push(`/menu/${meal.id}`)}
              className="cursor-pointer group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <motion.img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  {!meal.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Unavailable</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {meal.name}
                  </h3>
                  
                  {meal.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                      {meal.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <span className="text-2xl font-bold text-primary-600">₹{meal.price}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialThali;

