'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PromptCard from '@/components/ui/Prompts/PromptCard';
import type { Prompt } from '@/types';
import { api } from '@/lib/api';

type Category = {
    _id?: string;
    name?: string;
    slug?: string;
};

type PromptWithCategory = Omit<Prompt, 'tags' | 'category'> & {
    _id?: string;
    id?: string;
    categoryId?: string;
    category?: { _id?: string; slug?: string } | string;
    tags?: unknown;
};

export default function CategoryPage() {
    const params = useParams();
    const categoryParam = params.category as string;
    
    const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [categorySlug, setCategorySlug] = useState<string>('');
    const [categoryId, setCategoryId] = useState<string>(''); // ★ NEW: ID store karne ke liye
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!categoryParam) return;

            try {
                setLoading(true);
                
                // 1. Fetch Categories to find the ID corresponding to the Slug
                const categoriesResponse = await api.getCategories();
                const categories = ((categoriesResponse as { data?: unknown[] }).data || categoriesResponse || []) as unknown[];
                
                // Find category by slug (e.g. 'marketing') or by ID
                const foundCategory = categories
                    .map((cat) => cat as Category)
                    .find((cat) =>
                        cat.slug === categoryParam ||
                        cat._id === categoryParam ||
                        (cat.name ?? '').toLowerCase() === categoryParam.toLowerCase()
                    );
                
                if (foundCategory) {
                    setCategoryName(foundCategory.name ?? categoryParam);
                    setCategorySlug(foundCategory.slug ?? categoryParam);
                    setCategoryId(foundCategory._id ?? ''); // ★ IMPORTANT: Save the ID
                } else {
                    // Fallback
                    setCategoryName(categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1));
                    setCategorySlug(categoryParam);
                }
                
                // 2. Fetch Prompts
                // Optimization Tip: Agar backend support kare toh api.getPromptsByCategory(id) use karna behtar hai
                const promptsResponse = await api.getPrompts();
                
                // Safe parsing of prompts
                const rawPrompts = ((promptsResponse as { data?: unknown[] }).data || promptsResponse || []) as unknown[];
                const parsedPrompts = rawPrompts.map((p) => {
                    const prompt = p as PromptWithCategory;
                    const rawTags = prompt.tags;
                    const parsedTags = Array.isArray(rawTags)
                        ? rawTags
                        : typeof rawTags === 'string'
                            ? (rawTags.trim().startsWith('[') ? JSON.parse(rawTags) : [rawTags])
                            : [];

                    return {
                        ...prompt,
                        id: prompt._id || prompt.id,
                        tags: parsedTags,
                    } as Prompt;
                });

                setAllPrompts(parsedPrompts as Prompt[]);
                setError(null);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to fetch data';
                setError(message);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryParam]); // Dependency array ensures rerun on back navigation

    // ★ FIXED FILTER LOGIC
    const displayedPrompts = allPrompts.filter((prompt) => {
        // 1. Agar 'all' category hai toh sab dikhao
        if (!categorySlug || categorySlug.toLowerCase() === 'all') return true;

        // 2. Check Matching (ID vs ID   OR   Slug vs Slug)
        // Backend mein kabhi category field mein ID hoti hai, kabhi object populated hota hai
        const typedPrompt = prompt as PromptWithCategory;
        const promptCategory = typedPrompt.category;
        const promptCatId =
            typedPrompt.categoryId ||
            (typeof promptCategory === 'string' ? promptCategory : promptCategory?._id) ||
            promptCategory;
        
        return (
            promptCatId === categoryId || // Match by ID (Most Likely Case)
            promptCatId === categoryParam || // Match by Param
            typedPrompt.category === categorySlug // Match by Slug string
        );
    });

    return (
        <div className="min-h-screen bg-[#050520] text-white pb-20">
            <div className="container mx-auto px-4 py-8">
                
                {/* Back Button */}
                <Link 
                    href="/prompts" 
                    className="inline-flex mt-20 items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to all prompts</span>
                </Link>

                {/* Header Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2 capitalize">
                            {categoryName || categoryParam} Prompts
                        </h2>
                        {!loading && <span className="text-gray-400 text-sm">{displayedPrompts.length} results</span>}
                    </div>

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

                    {/* The Grid */}
                    {!loading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {displayedPrompts.length > 0 ? (
                                displayedPrompts.map((prompt) => (
                                    <PromptCard 
                                        key={prompt._id}
                                        {...prompt}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-gray-400 text-lg mb-2">No prompts found for {categoryName}.</p>
                                    <p className="text-gray-600 text-sm">Try looking in another category.</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}