'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PromptCard from '@/components/ui/Prompts/PromptCard';
import type { Prompt } from '@/types';
import promptsData from '@/data/prompts.json';

// Map category URL slugs to display names
const CATEGORY_MAP: Record<string, string> = {
    'instagram': 'Instagram',
    'linkedin': 'LinkedIn',
    'youtube': 'YouTube',
    'aiart': 'AI Art',
    'chatgpt': 'ChatGPT',
    'resume': 'Resume',
    'bio': 'Bio',
    'tiktok': 'TikTok',
    'twitter': 'Twitter',
};

export default function CategoryPage() {
    const params = useParams();
    const category = params.category as string;
    
    // Get category name
    const categoryName = CATEGORY_MAP[category.toLowerCase()] || 
        category.charAt(0).toUpperCase() + category.slice(1);

    // Filter prompts based on category from JSON data with proper typing
    const displayedPrompts = (promptsData.prompts as Prompt[]).filter(
        (prompt) => prompt.category === category.toLowerCase()
    );

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
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {categoryName} Prompts
                        </h2>
                        <span className="text-gray-400 text-sm">{displayedPrompts.length} results</span>
                    </div>

                    {/* The Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedPrompts.length > 0 ? (
                            displayedPrompts.map((prompt) => (
                                <PromptCard 
                                    key={prompt.id}
                                    {...prompt}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-gray-400 text-lg">No prompts found for this category.</p>
                                <Link 
                                    href="/prompts" 
                                    className="text-purple-500 hover:text-purple-400 mt-4 inline-block"
                                >
                                    Browse all prompts
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
