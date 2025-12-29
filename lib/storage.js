// Utility functions for storing menu data in localStorage
export const getMenuItems = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('kitchen_menu');
  return stored ? JSON.parse(stored) : [];
};

export const saveMenuItems = (items) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kitchen_menu', JSON.stringify(items));
};

export const getKitchenInfo = () => {
  if (typeof window === 'undefined') {
    return {
      name: "Mama's Thali",
      cuisine: 'North Indian',
      rating: 4.8,
      reviewCount: 234,
      deliveryTime: '30 min',
      address: 'Mansarover, Jaipur, Rajasthan',
      phone: '+91 98765 43210',
      email: 'support@mamasthali.com',
      description: 'Authentic home-cooked meals from our kitchen in Mansarover, Jaipur',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      specialties: ['North Indian Thali', 'Roti & Sabzi', 'Dal Makhani'],
      isVeg: true,
      isTopRated: true,
    };
  }
  const stored = localStorage.getItem('kitchen_info');
  if (stored) {
    return JSON.parse(stored);
  }
  // Default kitchen info
  const defaultInfo = {
    name: "Mama's Thali",
    cuisine: 'North Indian',
    rating: 4.8,
    reviewCount: 234,
    deliveryTime: '30 min',
    address: 'Mansarover, Jaipur, Rajasthan',
    phone: '+91 98765 43210',
    email: 'support@mamasthali.com',
    description: 'Authentic home-cooked meals from our kitchen in Mansarover, Jaipur',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    specialties: ['North Indian Thali', 'Roti & Sabzi', 'Dal Makhani'],
    isVeg: true,
    isTopRated: true,
  };
  localStorage.setItem('kitchen_info', JSON.stringify(defaultInfo));
  return defaultInfo;
};

export const saveKitchenInfo = (info) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kitchen_info', JSON.stringify(info));
};

// Initialize default menu if empty
export const initializeDefaultMenu = () => {
  if (typeof window === 'undefined') return;
  const existing = getMenuItems();
  if (existing.length === 0) {
    const defaultMenu = [
      {
        id: Date.now().toString(),
        name: 'Complete North Indian Thali',
        description: 'Dal, Sabzi, Roti, Rice, Salad, Pickle, Sweet',
        price: 150,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop',
        category: 'Thali',
        isVeg: true,
        isAvailable: true,
      },
      {
        id: (Date.now() + 1).toString(),
        name: 'Dal Makhani with Butter Naan',
        description: 'Creamy dal makhani served with 2 butter naan',
        price: 120,
        image: 'https://images.unsplash.com/photo-1588166332193-c5ba3808159b?w=300&h=200&fit=crop',
        category: 'Main Course',
        isVeg: true,
        isAvailable: true,
      },
      {
        id: (Date.now() + 2).toString(),
        name: 'Mix Veg Pulao',
        description: 'Fragrant basmati rice with mixed vegetables',
        price: 100,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop',
        category: 'Rice',
        isVeg: true,
        isAvailable: true,
      },
    ];
    saveMenuItems(defaultMenu);
  }
};

