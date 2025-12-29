'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServiceGrid from '@/components/ServiceGrid';
import Categories from '@/components/Categories';
import Footer from '@/components/Footer';
import { setMenuItems } from '@/store/slices/menuSlice';
import { defaultMenuItems } from '@/store/slices/menuSlice';
import { getMenuItems, initializeDefaultMenu, saveMenuItems } from '@/lib/storage';

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeDefaultMenu();
      const items = getMenuItems();
      if (items.length > 0) {
        dispatch(setMenuItems(items));
      } else {
        // Initialize with default items
        dispatch(setMenuItems(defaultMenuItems));
        saveMenuItems(defaultMenuItems);
      }
    }
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <Categories />
      <ServiceGrid />
      <Footer />
    </main>
  );
}
