'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, updateQuantity, removeFromCart, clearCart } from '@/store/slices/cartSlice';
import { getKitchenInfo } from '@/lib/storage';
import GoogleMapAddressPicker from '@/components/GoogleMapAddressPicker';
import { placeOrder, getProfile, updateProfile, isAuthenticated } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    instructions: '',
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load user profile if authenticated
    if (isAuthenticated()) {
      loadUserProfile();
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await getProfile();
      setCustomerInfo({
        name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        pincode: profile.pincode || '',
        instructions: '',
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated()) {
      alert('Please login to place an order');
      router.push('/signin');
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      setError('Please fill in all required fields (Name, Phone, Address)');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsPlacingOrder(true);
    setError('');

    try {
      // Calculate total including delivery charge
      const deliveryCharge = 30;
      const subtotal = total;
      const finalTotal = subtotal + deliveryCharge;

      // For now, create one order with all items
      // If items have different meal types, we'll use the first item's type
      // In future, you can modify to create multiple orders if needed
      const firstItem = cartItems[0];
      let mealType = firstItem.category?.toLowerCase() || 'lunch';
      
      // Validate meal type matches enum values
      const validMealTypes = ['breakfast', 'lunch', 'dinner', 'premium', 'special'];
      if (!validMealTypes.includes(mealType)) {
        mealType = 'lunch';
      }

      // Calculate total quantity
      const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

      const orderData = {
        meal_type: mealType,
        quantity: totalQuantity,
        delivery_date: new Date().toISOString().split('T')[0], // Today's date
        delivery_time: '12:00 PM',
        address: customerInfo.address,
        total_amount: finalTotal,
        order_type: 'single',
        instructions: customerInfo.instructions,
      };

      // Place order
      const result = await placeOrder(orderData);

      // Update user profile with address if authenticated
      if (isAuthenticated() && customerInfo.address) {
        try {
          await updateProfile({
            full_name: customerInfo.name,
            address: customerInfo.address,
            city: customerInfo.city || '',
            pincode: customerInfo.pincode || '',
          });
        } catch (profileError) {
          console.error('Failed to update profile:', profileError);
          // Don't block order placement if profile update fails
        }
      }

      // Clear cart
      dispatch(clearCart());

      // Redirect to order confirmation
      router.push(`/order-confirmation/${result.data?.id || 'success'}`);
    } catch (err) {
      console.error('Failed to place order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse Menu
              </motion.button>
            </Link>
          </motion.div>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Cart</h1>
          <p className="text-gray-600">{cartItems.length} item(s) in your cart</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <div className="flex items-center space-x-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{item.price}
                      </span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors ml-4"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-600">
                        Subtotal: ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Checkout Section */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-md p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h2>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Customer Information Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <GoogleMapAddressPicker
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    placeholder="Start typing your delivery address..."
                    label="Delivery Address"
                    required
                    onPlaceSelect={(place) => {
                      setSelectedPlace(place);
                      // Extract city and pincode from address components
                      if (place.address_components) {
                        let city = '';
                        let pincode = '';
                        place.address_components.forEach((component) => {
                          if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
                            city = component.long_name;
                          }
                          if (component.types.includes('postal_code')) {
                            pincode = component.long_name;
                          }
                        });
                        if (city) setCustomerInfo((prev) => ({ ...prev, city }));
                        if (pincode) setCustomerInfo((prev) => ({ ...prev, pincode }));
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={customerInfo.instructions}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, instructions: e.target.value })}
                    placeholder="Any special instructions for delivery"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{total}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="font-semibold">₹30</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-primary-600">₹{total + 30}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: isPlacingOrder ? 1 : 1.02 }}
                whileTap={{ scale: isPlacingOrder ? 1 : 0.98 }}
                onClick={handleCheckout}
                disabled={isPlacingOrder}
                className="w-full py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>

              <p className="text-xs text-gray-500 text-center mt-4">
                * Delivery available in Mansarover, Jaipur area
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
