'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { CategoryId } from '@/types';

// --- Internal Types ---
interface Category {
  _id: string;
  id?: CategoryId;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  label?: string;
}

interface CategoryBarProps {
  activeCategory: CategoryId;
  setActiveCategory: (id: CategoryId) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ activeCategory, setActiveCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api';
        const response = await fetch(`${apiUrl}/categories`);

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();

        // Map API response to component interface
        const mappedCategories = data.data.map((cat: Omit<Category, 'id' | 'label'>) => ({
          ...cat,
          id: cat.slug as CategoryId,
          label: cat.name,
        }));

        // Add "Trending" category at the beginning
        const trendingCategory = {
          _id: 'trending',
          id: 'all' as CategoryId,
          name: 'Trending',
          slug: 'all',
          label: 'Trending',
        };

        setCategories([trendingCategory, ...mappedCategories]);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        // Fallback to empty categories
        setCategories([
          {
            _id: 'trending',
            id: 'all' as CategoryId,
            name: 'Trending',
            slug: 'all',
            label: 'Trending',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full pt-24 py-4 bg-[#050520] border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-white/10 rounded-full w-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-24 py-4 bg-[#050520] border-b border-white/5">
      <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 min-w-max pb-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat.id as CategoryId)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <span className="relative z-10 whitespace-nowrap">
                  {cat.label || cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;