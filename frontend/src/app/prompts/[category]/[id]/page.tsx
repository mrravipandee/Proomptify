'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, ExternalLink, Clock, TrendingUp } from 'lucide-react';
import type { Prompt } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import UsageLimitModal from '@/components/ui/UsageLimitModal';

export default function PromptDetailPage() {
    const params = useParams();
    const router = useRouter();
    
    // params.category might be an ID or a slug, depending on your URL structure
    const categoryParam = params.category as string;
    const id = params.id as string;
    
    const [isCopied, setIsCopied] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [categoryName, setCategoryName] = useState<string>(''); // Stores the human-readable name
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, token } = useAuth();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    // Fetch the specific prompt AND categories to get the name
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. Fetch the Prompt
                const response = await api.getSinglePrompt(id);
                const responseData = (response as { data?: unknown }).data ?? response;
                const promptData = responseData as Partial<Prompt> & {
                    id?: string;
                    tags?: unknown;
                    categoryId?: string;
                    category?: string;
                };
                
                // Parse tags safely
                const parsedTags = Array.isArray(promptData.tags)
                    ? promptData.tags
                    : typeof promptData.tags === 'string'
                        ? JSON.parse(promptData.tags)
                        : [];

                const mappedPrompt: Prompt = {
                    _id: promptData._id || promptData.id || '',
                    title: promptData.title || '',
                    description: promptData.description || '',
                    promptText: promptData.promptText || '',
                    category: promptData.category || '',
                    imgUrl: promptData.imgUrl,
                    steps: promptData.steps,
                    completeSteps: promptData.completeSteps,
                    estimatedTime: promptData.estimatedTime,
                    usageCount: promptData.usageCount,
                    referenceUrl: promptData.referenceUrl ?? null,
                    status: promptData.status,
                    createdAt: promptData.createdAt,
                    updatedAt: promptData.updatedAt,
                    tags: parsedTags,
                };
                setPrompt(mappedPrompt);

                // 2. Fetch Categories to find the Name
                try {
                    const catResponse = await api.getCategories();
                    const categories = ((catResponse as { data?: unknown[] }).data || catResponse || []) as Array<{ _id: string; name: string; slug: string }>;
                    
                    // Logic: Find the category object that matches the prompt's categoryId
                    const foundCategory = categories.find((cat) => 
                        cat._id === promptData.categoryId ||  // Match by ID in prompt
                        cat._id === promptData.category ||    // Sometimes it's directly on category
                        cat.slug === categoryParam            // Match by URL param
                    );
                    
                    if (foundCategory) {
                        setCategoryName(foundCategory.name);
                    } else {
                        // Fallback: If param looks like an ID (long string), show "Back" or "Category"
                        // Otherwise, capitalize the slug
                        const isId = categoryParam.length > 20 && /\d/.test(categoryParam);
                        setCategoryName(isId ? 'Category' : categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1));
                    }
                } catch (catErr) {
                    console.error("Error fetching categories:", catErr);
                    setCategoryName("Category");
                }

                setError(null);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to fetch prompt';
                setError(message);
                console.error('Error fetching prompt:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, categoryParam]);

    if (!user) return null; // Or your loading/login UI

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050520] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading prompt...</p>
                </div>
            </div>
        );
    }

    if (error || !prompt) {
        return (
            <div className="min-h-screen bg-[#050520] text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Prompt Not Found</h1>
                    <p className="text-gray-400 mb-6">{error || 'The prompt you are looking for does not exist.'}</p>
                    <Link href="/prompts" className="text-purple-500 hover:text-purple-400">
                        ← Back to Prompts
                    </Link>
                </div>
            </div>
        );
    }

    const handleCopy = async () => {
        if (!user || !token) {
            router.push('/login');
            return;
        }

        try {
            await api.trackUsage(id);
            await navigator.clipboard.writeText(prompt.promptText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error: unknown) {
            if (error instanceof Error && error.message) {
                if (error.message.includes('FREE_LIMIT_REACHED') || 
                    error.message.includes('limit') || 
                    error.message.includes('403')) {
                    setShowLimitModal(true);
                    return;
                }
            }
            console.error('Error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#050520] text-white pb-20">
            <div className="container mx-auto px-4 py-8">
                
                {/* Back Button - Updated to show Name */}
                <Link 
                    href={`/prompts/${categoryParam}`}
                    className="inline-flex mt-20 items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to {categoryName} prompts</span>
                </Link>

                <div className="max-w-7xl mx-auto">
                    
                    {/* Two Column Layout */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* Left Side - Tall Vertical Image */}
                        {prompt.imgUrl && (
                            <div className="lg:w-[400px] flex-shrink-0">
                                <div className="sticky top-24">
                                    <div className="relative w-full aspect-[2/5] rounded-2xl overflow-hidden border border-white/10">
                                        <Image 
                                            src={prompt.imgUrl}
                                            alt={prompt.title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Right Side - Content */}
                        <div className="flex-1">

                            {/* Title and Stats */}
                            <div className="mb-6">
                                <h1 className="text-4xl font-bold mb-4">{prompt.title}</h1>
                                <p className="text-xl text-gray-400 mb-6">{prompt.description}</p>
                                
                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                    {prompt.usageCount && (
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={16} />
                                            <span>{prompt.usageCount.toLocaleString()} uses</span>
                                        </div>
                                    )}
                                    {prompt.estimatedTime && (
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>{prompt.estimatedTime}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Video Link Button */}
                            {prompt.referenceUrl && (
                                <div className="mb-8">
                                    <a
                                        href={prompt.referenceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
                                    >
                                        <ExternalLink size={18} />
                                        View Reference Video
                                    </a>
                                </div>
                            )}

                            {/* Tags */}
                            {prompt.tags && prompt.tags.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-3">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {prompt.tags.map((tag, i) => (
                                            <span 
                                                key={i} 
                                                className="px-4 py-2 rounded-lg bg-white/10 text-gray-300 border border-white/10 text-sm font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Steps - Complete Instructions */}
                            {prompt.completeSteps && prompt.completeSteps.length > 0 && (
                                <div className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold mb-4">How to Use This Prompt</h3>
                                    <ol className="space-y-3">
                                        {prompt.completeSteps.map((step, i) => (
                                            <li key={i} className="flex gap-4">
                                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-sm">
                                                    {i + 1}
                                                </span>
                                                <span className="text-gray-300 pt-1">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            {/* Prompt Text */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Prompt</h3>
                                    <button
                                        onClick={handleCopy}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                            isCopied
                                                ? 'bg-green-500 text-white'
                                                : 'bg-white text-black hover:bg-gray-200'
                                        }`}
                                    >
                                        {isCopied ? (
                                            <>
                                                <Check size={16} />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300 leading-relaxed bg-black/30 p-4 rounded-lg border border-white/5">
                                    {prompt.promptText}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UsageLimitModal 
                isOpen={showLimitModal} 
                onClose={() => setShowLimitModal(false)} 
            />
        </div>
    );
}