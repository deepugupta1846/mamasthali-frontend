import { createSlice } from '@reduxjs/toolkit';
import { getMenuItems, saveMenuItems, initializeDefaultMenu } from '@/lib/storage';

// Initialize default menu if empty
if (typeof window !== 'undefined') {
  initializeDefaultMenu();
}

// Default menu items - 20-25 items as requested
export const defaultMenuItems = [
  {
    id: '1',
    name: 'Normal Thali',
    description: 'Dal, Sabzi, Roti, Rice, Salad, Pickle, Sweet',
    price: 120,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    category: 'Thali',
    isVeg: true,
    isAvailable: true,
    popular: true,
  },
  {
    id: '2',
    name: 'Special Thali',
    description: 'Dal Makhani, Paneer Sabzi, Butter Naan, Rice, Salad, Pickle, Sweet, Raita',
    price: 180,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    category: 'Thali',
    isVeg: true,
    isAvailable: true,
    popular: true,
  },
  {
    id: '3',
    name: 'Premium Thali',
    description: 'Dal Makhani, Mix Veg, Paneer Butter Masala, Garlic Naan, Jeera Rice, Salad, Pickle, Sweet, Raita, Papad',
    price: 250,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop',
    category: 'Thali',
    isVeg: true,
    isAvailable: true,
    popular: true,
  },
  {
    id: '4',
    name: 'Special Paratha',
    description: 'Stuffed paratha with your choice of filling (Aloo, Paneer, Gobi, Mix)',
    price: 80,
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d19d?w=400&h=300&fit=crop',
    category: 'Paratha',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Aloo Fried Roti',
    description: 'Crispy fried roti stuffed with spiced aloo',
    price: 70,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    category: 'Paratha',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Paneer Paratha',
    description: 'Soft paratha stuffed with spiced paneer',
    price: 90,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'Paratha',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '7',
    name: 'Gobi Paratha',
    description: 'Paratha stuffed with spiced cauliflower',
    price: 75,
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop',
    category: 'Paratha',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '8',
    name: 'Dal Makhani with Roti',
    description: 'Creamy dal makhani served with 2 butter roti',
    price: 110,
    image: 'https://images.unsplash.com/photo-1588166332193-c5ba3808159b?w=400&h=300&fit=crop',
    category: 'Main Course',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '9',
    name: 'Paneer Butter Masala with Naan',
    description: 'Rich paneer curry with 2 butter naan',
    price: 140,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
    category: 'Main Course',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '10',
    name: 'Chole Bhature',
    description: 'Spicy chickpeas with fluffy bhature',
    price: 100,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    category: 'Main Course',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '11',
    name: 'Mix Veg Pulao',
    description: 'Fragrant basmati rice with mixed vegetables',
    price: 90,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    category: 'Rice',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '12',
    name: 'Jeera Rice with Dal',
    description: 'Cumin rice served with yellow dal',
    price: 85,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
    category: 'Rice',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '13',
    name: 'Vegetable Biryani',
    description: 'Fragrant biryani with mixed vegetables and spices',
    price: 130,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop',
    category: 'Rice',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '14',
    name: 'Rajma Chawal',
    description: 'Red kidney beans curry with steamed rice',
    price: 95,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    category: 'Rice',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '15',
    name: 'Poha',
    description: 'Flattened rice cooked with onions, spices, and peanuts',
    price: 60,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'Breakfast',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '16',
    name: 'Upma',
    description: 'Semolina cooked with vegetables and spices',
    price: 55,
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop',
    category: 'Breakfast',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '17',
    name: 'Aloo Paratha with Curd',
    description: 'Aloo stuffed paratha served with fresh curd',
    price: 85,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    category: 'Breakfast',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '18',
    name: 'Samosa (2 pcs)',
    description: 'Crispy samosas with spiced potato filling',
    price: 40,
    image: 'https://images.unsplash.com/photo-1588166332193-c5ba3808159b?w=400&h=300&fit=crop',
    category: 'Snacks',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '19',
    name: 'Dhokla',
    description: 'Soft steamed dhokla with green chutney',
    price: 50,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
    category: 'Snacks',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '20',
    name: 'Pav Bhaji',
    description: 'Spicy mixed vegetable curry with buttered pav',
    price: 110,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    category: 'Snacks',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '21',
    name: 'Kachori (2 pcs)',
    description: 'Crispy kachoris with dal or aloo filling',
    price: 45,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'Snacks',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '22',
    name: 'Gulab Jamun (2 pcs)',
    description: 'Sweet milk dumplings in sugar syrup',
    price: 60,
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop',
    category: 'Dessert',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '23',
    name: 'Rasgulla (3 pcs)',
    description: 'Soft cottage cheese balls in sugar syrup',
    price: 50,
    image: 'https://images.unsplash.com/photo-1588166332193-c5ba3808159b?w=400&h=300&fit=crop',
    category: 'Dessert',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '24',
    name: 'Kheer',
    description: 'Sweet rice pudding with nuts and cardamom',
    price: 55,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
    category: 'Dessert',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '25',
    name: 'Lassi',
    description: 'Sweet or salty yogurt drink',
    price: 40,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    category: 'Beverage',
    isVeg: true,
    isAvailable: true,
  },
];

export const loadMenuFromStorage = () => {
  if (typeof window !== 'undefined') {
    const saved = getMenuItems();
    return saved.length > 0 ? saved : defaultMenuItems;
  }
  return defaultMenuItems;
};

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: loadMenuFromStorage(),
    selectedItem: null,
    showDetailModal: false,
  },
  reducers: {
    setMenuItems: (state, action) => {
      state.items = action.payload;
      if (typeof window !== 'undefined') {
        saveMenuItems(action.payload);
      }
    },
    addMenuItem: (state, action) => {
      state.items.push(action.payload);
      if (typeof window !== 'undefined') {
        saveMenuItems(state.items);
      }
    },
    updateMenuItem: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        if (typeof window !== 'undefined') {
          saveMenuItems(state.items);
        }
      }
    },
    deleteMenuItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (typeof window !== 'undefined') {
        saveMenuItems(state.items);
      }
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
      state.showDetailModal = true;
    },
    closeDetailModal: (state) => {
      state.showDetailModal = false;
      state.selectedItem = null;
    },
  },
});

export const {
  setMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  setSelectedItem,
  closeDetailModal,
} = menuSlice.actions;

export const selectMenuItems = (state) => state.menu.items;
export const selectSelectedItem = (state) => state.menu.selectedItem;
export const selectShowDetailModal = (state) => state.menu.showDetailModal;
export const selectMenuItemsByCategory = (state, category) =>
  category === 'all'
    ? state.menu.items
    : state.menu.items.filter((item) => item.category === category);

export default menuSlice.reducer;

