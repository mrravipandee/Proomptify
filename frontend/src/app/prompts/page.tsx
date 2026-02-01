'use client';

import { useState } from 'react';
import CategoryBar, { CategoryId } from "@/components/ui/Prompts/CategoryBar";
import PromptCard, { PromptProps } from '@/components/ui/Prompts/PromptCard';
import PromptSlider from '@/components/ui/Prompts/PromptSlider';

// --- Sample Data (You would normally fetch this from an API/DB) ---
const SAMPLE_PROMPTS: PromptProps[] = [
    {
        id: '1',
        title: 'Viral Instagram Hook',
        description: 'Stop the scroll immediately with this psychological hook designed for lifestyle and business creators.',
        tags: ['Insta', 'Viral', 'Hook'],
        promptText: 'Create 5 controversial yet professional hooks for a video about [TOPIC] that challenge common myths.',
    },
    {
        id: '2',
        title: 'LinkedIn Storytelling',
        description: 'A framework to turn a boring work update into an engaging story that drives connection.',
        tags: ['LinkedIn', 'Writing', 'Story'],
        promptText: 'Rewrite this professional update: "[UPDATE]" into a "Hero\'s Journey" format focusing on the struggle and the lesson learned.',
    },
    {
        id: '3',
        title: 'YouTube Script Intro',
        description: 'Perfect 30-second intro structure to keep retention high for tech tutorials.',
        tags: ['YouTube', 'Script', 'Retention'],
        promptText: 'Write a YouTube video intro for [TOPIC] that opens with a "What if" question and immediately promises a specific outcome.',
    },
    {
        id: '4',
        title: 'Midjourney Photorealism',
        description: 'Generate hyper-realistic portraits with correct lighting and camera settings.',
        tags: ['AI Art', 'Midjourney', 'V6'],
        promptText: '/imagine prompt: Cinematic shot of [SUBJECT], 35mm lens, f/1.8, golden hour lighting, highly detailed texture, 8k --ar 16:9 --v 6.0',
    },
    {
        id: '5',
        title: 'Cold Email Outreach',
        description: 'Get responses from CEOs with this short, value-first cold email template.',
        tags: ['Business', 'Sales', 'Email'],
        promptText: 'Write a cold email to a CEO of a [INDUSTRY] company pitching [SERVICE]. Keep it under 100 words. Focus on their pain point of [PAIN POINT].',
    }
];

export default function PromptsPage() {
    const [activeCategory, setActiveCategory] = useState<CategoryId>('all');

    // Filter prompts based on active category (Mock logic)
    // In a real app, you'd filter based on the 'category' property in your data
    const displayedPrompts = activeCategory === 'all' 
        ? SAMPLE_PROMPTS 
        : SAMPLE_PROMPTS.slice(0, 2); // Just for demo, show fewer if filtered

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
                            title="🔥 Trending Now" 
                            description="Most copied prompts this week"
                            prompts={SAMPLE_PROMPTS}
                        />
                    </section>
                )}

                {/* 3. Main Grid Layout */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {activeCategory === 'all' ? 'All Prompts' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Prompts`}
                        </h2>
                        <span className="text-gray-400 text-sm">{displayedPrompts.length} results</span>
                    </div>

                    {/* The Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedPrompts.map((prompt) => (
                            <PromptCard 
                                key={prompt.id}
                                {...prompt} // Passes all properties (title, desc, tags, etc.) automatically
                            />
                        ))}
                    </div>
                </section>

            </div>
        </div>
    )
}