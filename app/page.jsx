'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServiceGrid from '@/components/ServiceGrid';
import Categories from '@/components/Categories';
import SpecialThali from '@/components/SpecialThali';
import TiffinService from '@/components/TiffinService';
import AppComingSoon from '@/components/AppComingSoon';
import Footer from '@/components/Footer';
import { setMenuItems } from '@/store/slices/menuSlice';
import { getMenu } from '@/lib/api';

export default function Home() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const meals = await getMenu();
        
        // Map backend meal structure to frontend menu item structure
        const mappedMeals = meals.map((meal) => ({
          id: meal.id.toString(),
          name: meal.name,
          image: meal.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
          category: meal.meal_type ? meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1) : 'Meal',
          description: meal.description || '',
          price: parseFloat(meal.price) || 0,
          isAvailable: meal.is_available !== false, // Default to true if not specified
          isVeg: true, // Assuming all meals are vegetarian for now
          popular: false, // Can be added to backend later if needed
        }));
        
        dispatch(setMenuItems(mappedMeals));
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        // On error, set empty array (or you could use defaultMenuItems as fallback)
        dispatch(setMenuItems([]));
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <Categories />
      <SpecialThali />
      <ServiceGrid />
      <TiffinService />
      <AppComingSoon />
      <Footer />
    </main>
  );
}
