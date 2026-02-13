'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, ExternalLink, Clock, TrendingUp, Tag, Layers } from 'lucide-react';
import type { Prompt } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import UsageLimitModal from '@/components/ui/UsageLimitModal';

export default function PromptDetailPage() {
    const params = useParams();
    const router = useRouter();
    
    const categoryParam = params.category as string;
    const id = params.id as string;
    
    const [isCopied, setIsCopied] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [categoryName, setCategoryName] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, token } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.getSinglePrompt(id);
                const responseData = (response as { data?: unknown }).data ?? response;
                const promptData = responseData as Partial<Prompt> & {
                    id?: string;
                    tags?: unknown;
                    categoryId?: string;
                    category?: string;
                };
                
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

                try {
                    const catResponse = await api.getCategories();
                    const categories = ((catResponse as { data?: unknown[] }).data || catResponse || []) as Array<{ _id: string; name: string; slug: string }>;
                    
                    const foundCategory = categories.find((cat) => 
                        cat._id === promptData.categoryId || 
                        cat._id === promptData.category ||   
                        cat.slug === categoryParam           
                    );
                    
                    if (foundCategory) {
                        setCategoryName(foundCategory.name);
                    } else {
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
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, categoryParam]);

    if (!user) return null;

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
            <div className="min-h-screen bg-[#050520] text-white flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <h1 className="text-3xl font-bold mb-4">Prompt Not Found</h1>
                    <p className="text-gray-400 mb-6">{error || 'The prompt you are looking for does not exist.'}</p>
                    <Link href="/prompts" className="inline-block bg-purple-600 px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors">
                        Go to Prompts
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
            {/* Background Gradients for Mobile Ambience */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
                
                {/* Back Button - Responsive Margin & Size */}
                <Link 
                    href={`/prompts/${categoryParam}`}
                    className="inline-flex mt-4 lg:mt-20 items-center gap-2 text-gray-400 hover:text-white mb-6 md:mb-8 transition-colors group"
                >
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm md:text-base font-medium">Back to {categoryName}</span>
                </Link>

                <div className="max-w-7xl mx-auto">
                    
                    {/* Layout: Column on Mobile, Row on Desktop */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        
                        {/* Left Side - Image */}
                        {prompt.imgUrl && (
                            <div className="w-full lg:w-[420px] flex-shrink-0">
                                {/* Centered container on mobile with max-width restriction */}
                                <div className="lg:sticky lg:top-24 mx-auto max-w-[280px] md:max-w-[350px] lg:max-w-full">
                                    <div className="relative w-full aspect-[2/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/20">
                                        <Image 
                                            src={prompt.imgUrl}
                                            alt={prompt.title}
                                            fill
                                            className="object-cover"
                                            priority
                                            sizes="(max-width: 768px) 100vw, 420px"
                                        />
                                        {/* Mobile overlay gradient for readability if text overlaid (optional) */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Right Side - Content */}
                        <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex items from overflowing */}

                            {/* Title and Stats */}
                            <div className="mb-6 md:mb-8">
                                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    {prompt.title}
                                </h1>
                                <p className="text-base md:text-xl text-gray-400 mb-6 leading-relaxed">
                                    {prompt.description}
                                </p>
                                
                                {/* Meta Info Pills */}
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                                    {prompt.usageCount !== undefined && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                            <TrendingUp size={14} className="text-green-400" />
                                            <span>{prompt.usageCount.toLocaleString()} uses</span>
                                        </div>
                                    )}
                                    {prompt.estimatedTime && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                            <Clock size={14} className="text-blue-400" />
                                            <span>{prompt.estimatedTime}</span>
                                        </div>
                                    )}
                                    {/* Category Pill (Mobile Only Helper) */}
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                                        <Layers size={14} />
                                        <span>{categoryName}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Action Stack */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                {prompt.referenceUrl && (
                                    <a
                                        href={prompt.referenceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-900/30"
                                    >
                                        <ExternalLink size={18} />
                                        View Reference Video
                                    </a>
                                )}
                            </div>

                            {/* Tags */}
                            {prompt.tags && prompt.tags.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-3 text-gray-400">
                                        <Tag size={16} />
                                        <h3 className="text-sm font-semibold uppercase tracking-wider">Tags</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {prompt.tags.map((tag, i) => (
                                            <span 
                                                key={i} 
                                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs md:text-sm font-medium transition-colors cursor-default"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Prompt Box - The Star of the Show */}
                            <div className="relative mb-8 group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-500"></div>
                                <div className="relative bg-[#0A0A25] border border-white/10 rounded-2xl p-4 md:p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white">Prompt Script</h3>
                                        <button
                                            onClick={handleCopy}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-md ${
                                                isCopied
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-white text-black hover:bg-gray-200 active:scale-95'
                                            }`}
                                        >
                                            {isCopied ? (
                                                <>
                                                    <Check size={16} />
                                                    <span className="hidden sm:inline">Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={16} />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5 overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                            {prompt.promptText}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Steps - Complete Instructions */}
                            {prompt.completeSteps && prompt.completeSteps.length > 0 && (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6">
                                    <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                                        Instructions
                                    </h3>
                                    <ol className="space-y-4">
                                        {prompt.completeSteps.map((step, i) => (
                                            <li key={i} className="flex gap-4 group">
                                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                    {i + 1}
                                                </span>
                                                <span className="text-gray-300 pt-1 text-sm md:text-base">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
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