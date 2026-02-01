'use client';

import { useState } from 'react';
import CategoryBar from "@/components/ui/Prompts/CategoryBar";
import PromptSlider from '@/components/ui/Prompts/PromptSlider';
import type { Prompt, CategoryId } from '@/types';
import promptsData from '@/data/prompts.json';

// Use prompts from JSON file with proper typing
const ALL_PROMPTS = promptsData.prompts as Prompt[];

export default function PromptsPage() {
    const [activeCategory, setActiveCategory] = useState<CategoryId>('all');

    // Get prompts by category for sliders
    const getPromptsByCategory = (category: string): Prompt[] => {
        return ALL_PROMPTS.filter(prompt => prompt.category === category);
    };

    return (
        <div className="min-h-screen bg-[#050520] text-white pb-20">
            
            {/* 1. Sticky Category Bar */}
            <CategoryBar 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
            />

            <div className="container mx-auto px-4 space-y-12 mt-8">
                
                {/* 2. Featured Slider (Optional - Shows "Trending" at top) */}
                {activeCategory === 'all' && (
                    <section>
                        <PromptSlider 
                            title="Trending Now" 
                            description="Most copied prompts this week"
                            prompts={ALL_PROMPTS.slice(0, 5)}
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
            </div>
        </div>
    )
}