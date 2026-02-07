'use client';

import { useState, useEffect } from 'react';
import CategoryBar from "@/components/ui/Prompts/CategoryBar";
import PromptSlider from '@/components/ui/Prompts/PromptSlider';
import type { Prompt, CategoryId } from '@/types';
import { api } from '@/lib/api';

export default function PromptsPage() {
    const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
    const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch prompts from API
    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                setLoading(true);
                const prompts = await api.getPrompts();
                setAllPrompts(prompts);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch prompts');
                console.error('Error fetching prompts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrompts();
    }, []);

    // Get prompts by category for sliders
    const getPromptsByCategory = (category: string): Prompt[] => {
        return allPrompts.filter(prompt => prompt.category === category);
    };

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
                {!loading && !error && (
                    <>
                        {/* 2. Featured Slider (Optional - Shows "Trending" at top) */}
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

                        {/* 3. Instagram Slider */}
                        {activeCategory === 'all' && (
                            <section>
                                <PromptSlider 
                                    title="Instagram" 
                                    description="Hooks, reels, and stories that convert"
                                    prompts={getPromptsByCategory('instagram')}
                                    categorySlug="instagram"
                                />
                            </section>
                        )}

                        {/* 4. YouTube Slider */}
                        {activeCategory === 'all' && (
                            <section>
                                <PromptSlider 
                                    title="YouTube" 
                                    description="Scripts and thumbnails that get views"
                                    prompts={getPromptsByCategory('youtube')}
                                    categorySlug="youtube"
                                />
                            </section>
                        )}

                        {/* 5. LinkedIn Slider */}
                        {activeCategory === 'all' && (
                            <section>
                                <PromptSlider 
                                    title="LinkedIn" 
                                    description="Professional content that builds authority"
                                    prompts={getPromptsByCategory('linkedin')}
                                    categorySlug="linkedin"
                                />
                            </section>
                        )}

                        {/* 6. AI Art Slider */}
                        {activeCategory === 'all' && (
                            <section>
                                <PromptSlider 
                                    title="AI Art" 
                                    description="Stunning visuals with Midjourney & DALL-E"
                                    prompts={getPromptsByCategory('aiart')}
                                    categorySlug="aiart"
                                />
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}