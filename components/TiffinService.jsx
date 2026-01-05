'use client';

import { motion } from 'framer-motion';
import { Clock, Utensils, CheckCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TiffinService = () => {
  const router = useRouter();

  const features = [
    {
      icon: Clock,
      title: 'Fresh Daily',
      description: 'Prepared fresh every morning with love and care',
    },
    {
      icon: Utensils,
      title: 'Home Cooked',
      description: 'Authentic home-style cooking just like mom makes',
    },
    {
      icon: CheckCircle,
      title: 'Hygienic',
      description: '100% hygienic and clean kitchen practices',
    },
  ];

  const plans = [
    {
      name: 'Daily Tiffin',
      price: '₹120',
      period: 'per day',
      features: ['Lunch & Dinner', '2 Rotis + Sabzi + Dal + Rice', 'Pickup Available'],
    },
    {
      name: 'Monthly Tiffin',
      price: '₹3,000',
      period: 'per month',
      features: ['All 30 Days', 'Lunch & Dinner', 'Special Discount', 'Free Delivery'],
      popular: true,
    },
    {
      name: 'Weekly Tiffin',
      price: '₹800',
      period: 'per week',
      features: ['7 Days Plan', 'Lunch & Dinner', 'Flexible Timing'],
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tiffin Service
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enjoy delicious home-cooked meals delivered to your doorstep. 
            Choose from daily, weekly, or monthly plans.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${
                plan.popular
                  ? 'border-primary-500 ring-4 ring-primary-100'
                  : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="bg-primary-600 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary-600">{plan.price}</span>
                  <span className="text-gray-500 ml-2">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/menus')}
                  className={`w-full py-3 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <span>Order Now</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-600 mb-4">
            Have questions? Call us at <span className="font-semibold text-primary-600">+91 XXXXX XXXXX</span>
          </p>
          <p className="text-sm text-gray-500">
            Service available in Mansarover, Jaipur • Minimum order: ₹100
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TiffinService;

