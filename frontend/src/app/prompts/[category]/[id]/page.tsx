'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, ExternalLink, Clock, TrendingUp, Lock } from 'lucide-react';
import type { Prompt } from '@/types';
import promptsData from '@/data/prompts.json';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import UsageLimitModal from '@/components/ui/UsageLimitModal';

export default function PromptDetailPage() {
    const params = useParams();
    const router = useRouter();
    const category = params.category as string;
    const id = params.id as string;
    
    const [isCopied, setIsCopied] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const { user, token } = useAuth();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    // Find the specific prompt
    const prompt = (promptsData.prompts as Prompt[]).find(
        (p) => p.id === id && p.category === category.toLowerCase()
    );

    if (!user) {
        return (
            <div className="min-h-screen bg-[#050520] text-white flex items-center justify-center">
                <div className="text-center">
                    <Lock size={64} className="mx-auto mb-4 text-purple-500" />
                    <h1 className="text-4xl font-bold mb-4">Login Required</h1>
                    <p className="text-gray-400 mb-6">Please login to view prompts</p>
                    <Link 
                        href="/login"
                        className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (!prompt) {
        return (
            <div className="min-h-screen bg-[#050520] text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Prompt Not Found</h1>
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
            // Track usage first
            const response = await api.trackUsage(user.id, token);
            
            // Check if limit reached
            if (response.limitReached) {
                setShowLimitModal(true);
                return;
            }

            // If not limited, copy the prompt
            await navigator.clipboard.writeText(prompt.promptText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error: any) {
            console.error('Error:', error);
            
            // Check if error is about usage limit
            if (error.message && error.message.includes('limit')) {
                setShowLimitModal(true);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050520] text-white pb-20">
            <div className="container mx-auto px-4 py-8">
                
                {/* Back Button */}
                <Link 
                    href={`/prompts/${category}`}
                    className="inline-flex mt-20 items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to {category.charAt(0).toUpperCase() + category.slice(1)} prompts</span>
                </Link>

                <div className="max-w-4xl mx-auto">
                    
                    {/* Hero Image */}
                    {prompt.imgUrl && (
                        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8 border border-white/10">
                            <Image 
                                src={prompt.imgUrl}
                                alt={prompt.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

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

            {/* Usage Limit Modal */}
            <UsageLimitModal 
                isOpen={showLimitModal} 
                onClose={() => setShowLimitModal(false)} 
            />
        </div>
    );
}
