'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Phone, MapPin, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getKitchenInfo } from '@/lib/storage';

export default function OrderConfirmationPage({ params }) {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [kitchenInfo, setKitchenInfo] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find((o) => o.id === params.id);
      setOrder(foundOrder);
      setKitchenInfo(getKitchenInfo());
    }
  }, [params.id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Order not found</h2>
            <Link href="/">
              <button className="px-6 py-2 bg-primary-600 text-white rounded-full mt-4">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          {/* Success Message */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-4"
            >
              <CheckCircle className="h-24 w-24 text-green-500" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg">
              Thank you for your order. We'll start preparing your meal right away.
            </p>
          </div>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order ID</h3>
                <p className="text-lg font-semibold text-gray-800">#{order.id}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.name} × {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{order.total}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="font-semibold">₹30</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-primary-600">₹{order.total + 30}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800">{order.customer.name}</p>
                      <p className="text-gray-600">{order.customer.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <p className="text-gray-600">{order.customer.phone}</p>
                  </div>
                  {order.customer.instructions && (
                    <div>
                      <p className="text-sm text-gray-500">Special Instructions:</p>
                      <p className="text-gray-600">{order.customer.instructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {kitchenInfo && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Kitchen Contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-primary-600" />
                      <a
                        href={`tel:${kitchenInfo.phone}`}
                        className="text-primary-600 font-semibold hover:underline"
                      >
                        {kitchenInfo.phone}
                      </a>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-primary-600 mt-0.5" />
                      <p className="text-gray-600">{kitchenInfo.address}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <p>
                    Order placed on {new Date(order.date).toLocaleString('en-IN', {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </motion.button>
            </Link>
            <Link href="/admin" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors"
              >
                Manage Kitchen
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

