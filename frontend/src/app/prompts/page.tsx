'use client';

import { useState, useEffect } from 'react';
import CategoryBar from "@/components/ui/Prompts/CategoryBar";
import PromptSlider from '@/components/ui/Prompts/PromptSlider';
import type { Prompt, CategoryId } from '@/types';
import { api } from '@/lib/api';

interface CategoryApiResponse {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface CategoryWithPrompts {
  _id: string;
  name: string;
  slug: string;
  description: string;
  prompts: Prompt[];
  count: number;
}

type Category = {
  _id: string;
  name: string;
  slug: string;
  count?: number;
};

interface CategoriesApiResponse {
  data: CategoryApiResponse[];
}


export default function PromptsPage() {
    const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
    const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
    const [categoriesWithPrompts, setCategoriesWithPrompts] = useState<CategoryWithPrompts[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch prompts and categories from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch all prompts
                                const promptsResponse = await api.getPrompts();
                                const rawPrompts = Array.isArray(promptsResponse)
                                    ? promptsResponse
                                    : (promptsResponse as { data?: Prompt[] }).data ?? [];
                                const prompts: Prompt[] = rawPrompts.map((prompt: Prompt) => ({
                                    ...prompt,
                                    id: prompt._id, // Map MongoDB _id to id
                                    tags: Array.isArray(prompt.tags) 
                                        ? prompt.tags 
                                        : typeof prompt.tags === 'string' 
                                            ? JSON.parse(prompt.tags) 
                                            : [], // Ensure tags is always an array
                                }));
                // Fetch all categories (with high limit to get all)
                                const categoriesResponse = await api.getCategories(1, 100);
                                const categories: CategoryApiResponse[] = Array.isArray(categoriesResponse)
                                    ? categoriesResponse
                                    : (categoriesResponse as CategoriesApiResponse).data || [];

                // Normalize prompt categories to slugs for consistent filtering
                const categorySlugMap = new Map<string, string>();
                categories.forEach((cat) => {
                    categorySlugMap.set(cat._id, cat.slug);
                    categorySlugMap.set(cat.slug.toLowerCase(), cat.slug);
                    categorySlugMap.set(cat.name.toLowerCase(), cat.slug);
                });

                const normalizedPrompts = prompts.map((prompt) => {
                    const categoryValue = (prompt.category || '').toString().toLowerCase();
                    const mappedSlug = categorySlugMap.get(categoryValue) || categorySlugMap.get(prompt.category || '') || prompt.category;
                    return {
                        ...prompt,
                        category: mappedSlug || prompt.category,
                    } as Prompt;
                });

                setAllPrompts(normalizedPrompts);

                // Build categories with their prompts
                const categoryData: CategoryWithPrompts[] = categories
                    .map((cat: CategoryApiResponse) => {
                        const categoryPrompts: Prompt[] = normalizedPrompts.filter(
                            (p: Prompt) => p.category === cat.slug
                        );
                        return {
                            _id: cat._id,
                            name: cat.name,
                            slug: cat.slug as CategoryId,
                            description: cat.description || '',
                            prompts: categoryPrompts,
                            count: categoryPrompts.length,
                        };
                    })
                    // Filter only categories with prompts > 0
                    .filter((cat : Category) => (cat.count ?? 0) > 0);

                setCategoriesWithPrompts(categoryData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#050520] text-white pb-20">
            
            {/* 1. Sticky Category Bar */}
            <CategoryBar 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
            />

            <div className="container mx-auto px-4 space-y-12 mt-8">
                
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-center">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {/* Prompts Content */}
                {!loading && !error && categoriesWithPrompts.length > 0 && (
                    <>
                        {/* 2. Featured Slider (Trending) */}
                        {activeCategory === 'all' && (
                            <section>
                                <PromptSlider 
                                    title="Trending Now" 
                                    description="Most copied prompts this week"
                                    prompts={allPrompts.slice(0, 5)}
                                    categorySlug="all"
                                />
                            </section>
                        )}

                        {/* 3. Dynamic Category Sliders */}
                        {activeCategory === 'all' ? (
                            // Show all categories when "all" is selected
                            categoriesWithPrompts.map((category) => (
                                <section key={category._id}>
                                    <PromptSlider 
                                        title={category.name}
                                        description={category.description}
                                        prompts={category.prompts}
                                        categorySlug={category.slug}
                                    />
                                </section>
                            ))
                        ) : (
                            // Show only selected category
                            categoriesWithPrompts
                                .filter(cat => cat.slug === activeCategory)
                                .map(category => (
                                    <section key={category._id}>
                                        <PromptSlider 
                                            title={category.name}
                                            description={category.description}
                                            prompts={category.prompts}
                                            categorySlug={category.slug}
                                        />
                                    </section>
                                ))
                        )}
                    </>
                )}

                {/* No Prompts State */}
                {!loading && !error && categoriesWithPrompts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No prompts available yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}