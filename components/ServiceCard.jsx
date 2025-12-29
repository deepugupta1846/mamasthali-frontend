'use client';

import { motion } from 'framer-motion';
import { Star, Clock, MapPin, Heart, Tag } from 'lucide-react';
import Link from 'next/link';

const ServiceCard = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Link href="/service/kitchen">
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
            {service.discount && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-4 left-4 bg-secondary-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-bold"
              >
                <Tag className="h-4 w-4" />
                <span>{service.discount}% OFF</span>
              </motion.div>
            )}
            {service.isTopRated && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
              >
                Top Rated
              </motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart className="h-5 w-5 text-gray-600 hover:text-primary-600" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{service.cuisine}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-800">{service.rating}</span>
                <span className="text-sm text-gray-500">({service.reviewCount})</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{service.deliveryTime}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{service.distance}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {service.specialties.slice(0, 3).map((specialty, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <span className="text-2xl font-bold text-primary-600">₹{service.price}</span>
                <span className="text-sm text-gray-500">/meal</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-semibold hover:bg-primary-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                View Menu
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;

