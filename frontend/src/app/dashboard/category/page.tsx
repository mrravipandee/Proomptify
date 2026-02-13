'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X,
  ChevronDown,
  FolderOpen,
  Layers,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

// --- Types ---
interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<{ name: string; description: string }>({ 
    name: '', 
    description: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getCategories(1, 100); // Get all categories
      const data = Array.isArray(response)
        ? response
        : ((response as { data?: Category[] }).data ?? []);
      setCategories(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const totalCategories = categories.length;

  // --- Handlers ---
  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name, 
        description: category.description || '' 
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? This action cannot be undone.')) return;
    
    try {
      await api.deleteCategory(id);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete category';
      alert(message);
      console.error('Error deleting category:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingCategory) {
        // Update existing category
        const response = await api.updateCategory(editingCategory._id, formData);
        const updated = (response as { data?: Category }).data ?? response;
        setCategories(categories.map(c => 
          c._id === editingCategory._id ? (updated as Category) : c
        ));
      } else {
        // Create new category
        const response = await api.createCategory(formData);
        const created = (response as { data?: Category }).data ?? response;
        setCategories([created as Category, ...categories]);
      }
      
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save category';
      alert(message);
      console.error('Error saving category:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  return (
    <div className="min-h-screen relative p-6 md:p-8 space-y-8 overflow-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          {/* Ambient Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Categories</h1>
            <p className="text-gray-400 mt-1">Organize your prompt library structure.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-purple-900/20 hover:scale-105"
          >
            <Plus size={18} />
            New Category
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-1 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                <div className="bg-[#0a0a0b]/80 backdrop-blur-xl rounded-xl p-4 flex items-center gap-4 h-full border border-white/5">
                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                        <Layers size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Categories</p>
                        <p className="text-2xl font-bold text-white">{totalCategories}</p>
                    </div>
                </div>
            </div>
            <div className="p-1 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                <div className="bg-[#0a0a0b]/80 backdrop-blur-xl rounded-xl p-4 flex items-center gap-4 h-full border border-white/5">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                        <LayoutGrid size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status</p>
                        <p className="text-2xl font-bold text-white">{loading ? 'Loading...' : 'Ready'}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 border border-white/10 rounded-xl flex items-center p-1 backdrop-blur-md">
                <Search className="ml-3 text-gray-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Search categories..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border-none py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                />
            </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-xl p-4 text-center">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchCategories}
              className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Categories List */}
        {!loading && !error && (
          <div className="space-y-4">
            {categories.length === 0 ? (
              <div className="text-center py-20">
                <FolderOpen className="mx-auto mb-4 text-gray-600" size={64} />
                <p className="text-gray-400 text-lg">No categories yet</p>
                <button
                  onClick={() => handleOpenModal()}
                  className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Create Your First Category
                </button>
              </div>
            ) : (
              <AnimatePresence>
                {categories
                  .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((category) => {
                    const isExpanded = expandedCategory === category._id;

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={category._id}
                        className={`relative rounded-2xl transition-all duration-300 ${
                          isExpanded
                            ? 'bg-white/[0.03] border border-purple-500/30 shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)]'
                            : 'bg-transparent border border-white/5 hover:bg-white/[0.02] hover:border-white/10'
                        }`}
                      >
                        {/* Category Header */}
                        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-5">
                            <div
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg transition-all ${
                                isExpanded
                                  ? 'bg-purple-500/20 shadow-purple-500/10 text-purple-400'
                                  : 'bg-white/5 border border-white/5 text-gray-400'
                              }`}
                            >
                              {category.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3
                                className={`text-lg font-bold flex items-center gap-2 transition-colors ${
                                  isExpanded ? 'text-white' : 'text-gray-200'
                                }`}
                              >
                                {category.name}
                                {isExpanded && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/10">
                                    Active
                                  </span>
                                )}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-500">/{category.slug}</span>
                                {category.description && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                                    <span className="text-sm text-gray-500">{category.description}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleExpand(category._id)}
                                className={`p-2 rounded-lg transition-all ${
                                  isExpanded
                                    ? 'bg-white/10 text-white rotate-180'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <ChevronDown size={20} />
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenModal(category)}
                                  className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(category._id)}
                                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content - Coming Soon */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-5 pt-0 border-t border-white/5">
                                <div className="flex items-center gap-2 py-4">
                                  <LayoutGrid size={14} className="text-purple-400" />
                                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Prompts in this category
                                  </span>
                                </div>

                                <div className="text-center py-8">
                                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 text-sm">
                                    <LayoutGrid size={16} className="text-purple-400" />
                                    <span>Prompt management coming soon</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <FolderOpen className="text-purple-400" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                    {editingCategory ? 'Edit Category' : 'New Category'}
                    </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1.5 block uppercase tracking-wider">Category Name *</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="e.g. Marketing, Design, Development"
                  />
                  <p className="text-xs text-gray-500 mt-1">Slug will be auto-generated from the name</p>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1. 5 block uppercase tracking-wider">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none resize-none h-24"
                    placeholder="What is this category about?"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-purple-900/20 transition-colors"
                  >
                    {submitting ? 'Saving...' : 'Save Category'}
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