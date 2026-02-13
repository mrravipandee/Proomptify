'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  X,
  Sparkles,
  FileText,
  Copy,
  MoreHorizontal,
  Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

// --- Types ---
interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  imgUrl?: string;
  usageCount: number;
  status?: 'draft' | 'published';
  promptText: string;
  estimatedTime?: string;
  referenceUrl?: string;
  steps?: string[];
  completeSteps?: string[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Prompt> & { image?: File; status?: 'draft' | 'published' }>({
    title: '', category: '', description: '', tags: [], promptText: '', status: 'draft', image: undefined
  });

  // Fetch prompts and categories on mount
  useEffect(() => {
    fetchPrompts();
    fetchCategories();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getPrompts();
      const rawPrompts = Array.isArray(response)
        ? response
        : (response as { data?: Array<Omit<Prompt, 'id'> & { _id?: string }> }).data ?? [];
      const data = rawPrompts.map((prompt) => ({
        ...prompt,
        id: prompt._id || '', // Map MongoDB _id to id
        tags: Array.isArray(prompt.tags) 
          ? prompt.tags 
          : typeof prompt.tags === 'string' 
            ? JSON.parse(prompt.tags) 
            : [],
      }));
      setPrompts(data);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Failed to fetch prompts:', error);
      setError(error.message || 'Failed to fetch prompts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.getCategories(1, 100);
      const data = Array.isArray(response)
        ? response
        : ((response as { data?: Category[] }).data ?? []);
      setCategories(data);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Failed to fetch categories:', error);
    }
  };

  // Derived Stats
  const stats = {
    total: prompts.length,
    published: prompts.filter(p => p.status === 'published').length,
    drafts: prompts.filter(p => p.status === 'draft').length
  };

  // --- Handlers ---
  const handleOpenModal = (prompt?: Prompt) => {
    setImagePreview(null);
    setTagInput('');
    if (prompt) {
      setEditingPrompt(prompt);
      setFormData({
        title: prompt.title,
        description: prompt.description,
        promptText: prompt.promptText,
        category: prompt.category,
        tags: prompt.tags || [],
        status: prompt.status || 'draft',
        imgUrl: prompt.imgUrl || '',
      });
      if (prompt.imgUrl) {
        setImagePreview(prompt.imgUrl);
      }
    } else {
      setEditingPrompt(null);
      const defaultCategory = categories.length > 0 ? categories[0]._id : '';
      setFormData({
        title: '',
        description: '',
        promptText: '',
        category: defaultCategory,
        tags: [],
        status: 'draft',
        imgUrl: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setImagePreview(null);
    setTagInput('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    
    try {
      await api.deletePrompt(id);
      setPrompts(prompts.filter(p => p.id !== id));
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || 'Failed to delete prompt');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.promptText || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setFormLoading(true);
      
      if (editingPrompt) {
        // Update existing prompt
        if (!editingPrompt.id) {
          alert('Error: Prompt ID not found');
          return;
        }
        
        await api.updatePrompt(editingPrompt.id, {
          title: formData.title,
          description: formData.description,
          promptText: formData.promptText,
          category: formData.category,
          tags: formData.tags,
          status: formData.status || 'draft',
        } as Partial<Prompt>);
      } else {
        // Create new prompt - use FormData for image upload
        if (!formData.image) {
          alert('Please select a cover image');
          return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append('title', formData.title!);
        uploadFormData.append('description', formData.description || '');
        uploadFormData.append('promptText', formData.promptText!);
        uploadFormData.append('category', formData.category!);
        uploadFormData.append('tags', JSON.stringify(formData.tags || []));
        uploadFormData.append('status', formData.status || 'draft');
        uploadFormData.append('image', formData.image);

        await api.createPromptWithImage(uploadFormData);
      }

      await fetchPrompts();
      handleCloseModal();
    } catch (err: undefined | unknown) {
      const error = err as Error;
      alert(error.message || 'Failed to save prompt');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen relative p-6 md:p-8 space-y-8 overflow-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Prompts Library</h1>
            <p className="text-gray-400 mt-1">Manage, edit and publish your AI prompts.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-900/20"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add New Prompt</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Sparkles size={20} /></div>
                <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold">Total Prompts</p>
                    <p className="text-xl font-bold text-white">{stats.total}</p>
                </div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><Eye size={20} /></div>
                <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold">Published</p>
                    <p className="text-xl font-bold text-white">{stats.published}</p>
                </div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400"><FileText size={20} /></div>
                <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold">Drafts</p>
                    <p className="text-xl font-bold text-white">{stats.drafts}</p>
                </div>
             </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search prompts by title, category or tag..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0b]/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder-gray-600"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Prompts Table */}
        <div className="bg-[#0a0a0b]/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl">
          {loading ? (
            <div className="p-12 flex items-center justify-center text-gray-400">
              <Loader className="animate-spin mr-2" size={20} />
              Loading prompts...
            </div>
          ) : prompts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FileText size={40} className="mx-auto mb-4 opacity-50" />
              No prompts found. Create one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Prompt Info</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Usage</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {prompts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((prompt) => (
                    <tr key={prompt.id} className="group hover:bg-white/[0.03] transition-colors duration-200">
                      
                      {/* Info Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 shadow-lg relative group-hover:border-purple-500/30 transition-all">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img 
                               src={prompt.imgUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop'} 
                               alt={prompt.title} 
                               className="w-full h-full object-cover" 
                               onError={(e) => {
                                 e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop';
                               }}
                             />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-base">{prompt.title}</div>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {prompt.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[10px] font-medium px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded-md border border-blue-500/10">{tag}</span>
                              ))}
                              {prompt.tags.length > 2 && (
                                <span className="text-[10px] font-medium px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded-md border border-blue-500/10">+{prompt.tags.length - 2}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-gray-300">
                         <span className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
                            {prompt.category}
                         </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          prompt.status === 'published' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                           <span className={`w-1.5 h-1.5 rounded-full ${prompt.status === 'published' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                          {prompt.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>

                      {/* Usage */}
                      <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                         <div className="flex items-center gap-1">
                            <Copy size={12} className="text-gray-500" />
                            {(prompt.usageCount || 0).toLocaleString()}
                         </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => alert(prompt.promptText)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="View Prompt Text">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleOpenModal(prompt)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 hover:text-blue-300 transition-colors" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(prompt.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="md:hidden flex justify-end">
                           <MoreHorizontal className="text-gray-500" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5">
                <div>
                    <h2 className="text-xl font-bold text-white">
                    {editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Fill in the details below to add to your library.</p>
                </div>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Prompt Title</label>
                    <input 
                      name="title" 
                      required
                      value={formData.title} 
                      onChange={handleInputChange} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all placeholder-gray-600"
                      placeholder="e.g. Viral Hook Generator" 
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Category</label>
                    <div className="relative">
                        <select 
                        name="category" 
                        required
                        value={formData.category || ''} 
                        onChange={handleInputChange} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none appearance-none cursor-pointer"
                        >
                        <option value="" className="bg-[#0a0a0b]">Select a category...</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id} className="bg-[#0a0a0b]">{cat.name}</option>
                        ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                             <Filter size={14} />
                        </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Short Description</label>
                  <input 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none placeholder-gray-600"
                    placeholder="Briefly describe what this prompt does..." 
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Cover Image *</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      id="image-upload"
                      className="hidden"
                      required={!editingPrompt}
                    />
                    <label 
                      htmlFor="image-upload"
                      className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer group"
                    >
                      {imagePreview ? (
                        <div className="w-full h-40 rounded-lg overflow-hidden relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white text-sm font-medium">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 bg-white/5 rounded-full mb-3 group-hover:scale-110 transition-transform">
                            <ImageIcon size={24} className="text-gray-400 group-hover:text-purple-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-300">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-600 mt-1">PNG, JPG, GIF (max. 5MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Actual Prompt Text */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center justify-between">
                      Prompt Content
                      <span className="text-xs text-purple-400 font-normal">Supports markdown</span>
                  </label>
                  <div className="relative">
                    <textarea 
                        name="promptText" 
                        required
                        value={formData.promptText} 
                        onChange={handleInputChange} 
                        rows={8}
                        className="w-full bg-[#050510] border border-white/10 rounded-xl px-4 py-3 text-gray-300 font-mono text-sm focus:border-purple-500 focus:outline-none leading-relaxed resize-none"
                        placeholder="Enter the AI prompt template here..." 
                    />
                  </div>
                </div>

                {/* Bottom Bar: Status & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-300">Tags</label>
                         <div className="space-y-2">
                           <div className="relative">
                             <input 
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagInputKeyDown}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all placeholder-gray-600"
                                placeholder="Type tag and press Enter or comma..." 
                             />
                           </div>
                           {/* Tags Display */}
                           {formData.tags && formData.tags.length > 0 && (
                             <div className="flex flex-wrap gap-2">
                               {formData.tags.map(tag => (
                                 <span 
                                   key={tag}
                                   className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium"
                                 >
                                   {tag}
                                   <button
                                     type="button"
                                     onClick={() => handleRemoveTag(tag)}
                                     className="text-blue-400 hover:text-blue-200 transition-colors"
                                   >
                                     <X size={14} />
                                   </button>
                                 </span>
                               ))}
                             </div>
                           )}
                         </div>
                    </div>
                    <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-300">Status</label>
                         <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                            {['draft', 'published'].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, status: s as 'draft' | 'published' }))}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    formData.status === s 
                                    ? 'bg-purple-600 text-white shadow-lg' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {s === 'published' ? 'Published' : 'Draft'}
                            </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-6 flex justify-end gap-3 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    disabled={formLoading}
                    className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white rounded-xl font-medium text-sm shadow-lg shadow-purple-900/20 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {formLoading ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : editingPrompt ? 'Save Changes' : 'Create Prompt'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}