'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Search, Loader } from 'lucide-react';
import { api } from '@/lib/api';
import { Prompt } from '@/types';
import { PromptForm } from '@/components/admin/PromptForm';
import { AdminOnly } from '@/components/admin/AdminOnly';
import Image from 'next/image';

interface AdminPromptFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  promptText: string;
  steps: string[];
  completeSteps: string[];
  estimatedTime: string;
  usageCount?: number;
  referenceUrl: string;
  imageFile?: File | null;
}

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch prompts
  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminPrompts(1, 100);
      setPrompts(((response as any)?.data || response) as Prompt[]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch prompts';
      console.error('Failed to fetch prompts:', error);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrompt = async (formData: AdminPromptFormData) => {
    try {
      setFormLoading(true);
      if (formData.imageFile) {
        const payload = new FormData();
        payload.append('title', formData.title);
        payload.append('description', formData.description);
        payload.append('category', formData.category);
        payload.append('promptText', formData.promptText);
        payload.append('referenceUrl', formData.referenceUrl || '');
        payload.append('estimatedTime', formData.estimatedTime || '');
        payload.append('usageCount', String(formData.usageCount ?? 0));
        payload.append('tags', JSON.stringify(formData.tags || []));
        payload.append('steps', JSON.stringify(formData.steps || []));
        payload.append('completeSteps', JSON.stringify(formData.completeSteps || []));
        payload.append('image', formData.imageFile);
        await api.createPromptWithImage(payload);
      } else {
        const { imageFile, ...payload } = formData;
        await api.createPrompt(payload);
      }
      setSuccessMessage('Prompt created successfully!');
      setShowForm(false);
      await fetchPrompts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create prompt';
      alert(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    try {
      setDeleting(id);
      await api.deletePrompt(id);
      setPrompts(prompts.filter((p) => p._id !== id));
      setSuccessMessage('Prompt deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete prompt';
      alert(message);
    } finally {
      setDeleting(null);
    }
  };

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminOnly>
      <div className="min-h-screen bg-[#050520]">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-white/10 bg-[#050520]/95 backdrop-blur supports-[backdrop-filter]:bg-[#050520]/60">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Prompts Management</h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage all your AI prompts
              </p>
            </div>
            {!showForm && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all"
              >
                <Plus size={18} />
                New Prompt
              </motion.button>
            )}
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm flex items-center gap-2"
            >
              ✓ {successMessage}
            </motion.div>
          )}

          {/* Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Create New Prompt</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <PromptForm
                onSubmit={handleCreatePrompt}
                isLoading={formLoading}
              />
            </motion.div>
          )}

          {/* Search */}
          {!showForm && (
            <div className="mb-6">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-3 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Prompts Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-purple-500" />
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No prompts found</p>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Create your first prompt →
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPrompts.map((prompt) => (
                <motion.div
                  key={prompt._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur hover:border-purple-500/30 hover:bg-white/[0.08] transition-all h-full flex flex-col"
                >
                  {/* Image */}
                  {prompt.imgUrl && (
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                      <Image
                        src={prompt.imgUrl}
                        alt={prompt.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 flex flex-col p-4">
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">
                      {prompt.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2 flex-1">
                      {prompt.description}
                    </p>

                    {/* Category & Tags */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                        {prompt.category}
                      </span>
                      {prompt.tags?.[0] && (
                        <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                          {prompt.tags[0]}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="text-xs text-gray-500 mb-4">
                      Used {prompt.usageCount || 0} times
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeletePrompt(prompt._id)}
                        disabled={deleting === prompt._id}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors text-sm border border-red-500/30 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        {deleting === prompt._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminOnly>
  );
}
