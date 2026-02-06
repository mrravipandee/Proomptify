'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // Emoji or Icon Name
  promptCount: number;
}

interface Prompt {
  id: string;
  title: string;
  description: string;
  tags: string[];
  categoryId: string;
}

// --- Mock Data ---
const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Instagram', slug: 'instagram', description: 'Growth & Viral Hooks', icon: '📸', promptCount: 12 },
  { id: '2', name: 'LinkedIn', slug: 'linkedin', description: 'Professional Storytelling', icon: '💼', promptCount: 8 },
  { id: '3', name: 'YouTube', slug: 'youtube', description: 'Scripts & Intros', icon: '📹', promptCount: 15 },
  { id: '4', name: 'AI Art', slug: 'ai-art', description: 'Midjourney & Dall-E', icon: '🎨', promptCount: 24 },
];

const MOCK_PROMPTS: Prompt[] = [
  { id: 'p1', title: 'Viral Hook Generator', description: 'Create 5 hooks for...', tags: ['Viral'], categoryId: '1' },
  { id: 'p2', title: 'Carousel Caption', description: 'Write engaging captions...', tags: ['Growth'], categoryId: '1' },
  { id: 'p3', title: 'Reel Script', description: '30-sec script format...', tags: ['Video'], categoryId: '1' },
  { id: 'p4', title: 'Bio Optimizer', description: 'Perfect bio structure...', tags: ['Profile'], categoryId: '1' },
  { id: 'p5', title: 'Professional Update', description: 'Share a win humbly...', tags: ['Career'], categoryId: '2' },
  { id: 'p6', title: 'Networking Outreach', description: 'Cold msg template...', tags: ['Sales'], categoryId: '2' },
];

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({ name: '', slug: '', description: '', icon: '📁' });

  // --- Handlers ---

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData(category);
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', icon: '📁' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } as Category : c));
    } else {
      const newCat: Category = {
        ...formData as Category,
        id: Math.random().toString(36).substr(2, 9),
        promptCount: 0
      };
      setCategories([...categories, newCat]);
    }
    setIsModalOpen(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 text-sm">Organize your prompts into logical groups.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-900/20"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search categories..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6">
        {categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((category) => {
          const isExpanded = expandedCategory === category.id;
          const categoryPrompts = MOCK_PROMPTS.filter(p => p.categoryId === category.id);

          return (
            <motion.div 
              layout
              key={category.id}
              className={`bg-[#0a0a0b] border ${isExpanded ? 'border-purple-500/30 ring-1 ring-purple-500/20' : 'border-white/5'} rounded-xl overflow-hidden transition-all`}
            >
              {/* Category Card Header */}
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {category.name}
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-500 font-mono border border-white/5">/{category.slug}</span>
                    </h3>
                    <p className="text-sm text-gray-400">{category.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6 self-end sm:self-auto">
                    <div className="text-right">
                        <div className="text-sm font-bold text-white">{category.promptCount}</div>
                        <div className="text-xs text-gray-500">Prompts</div>
                    </div>

                    <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

                    <div className="flex items-center gap-2">
                         <button 
                            onClick={() => toggleExpand(category.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                isExpanded 
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                            }`}
                         >
                            {isExpanded ? 'Hide Prompts' : 'View Prompts'}
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                         </button>

                         <div className="flex items-center border border-white/10 rounded-lg overflow-hidden ml-2">
                             <button onClick={() => handleOpenModal(category)} className="p-2 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-r border-white/10">
                                <Edit size={14} />
                             </button>
                             <button onClick={() => handleDelete(category.id)} className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors">
                                <Trash2 size={14} />
                             </button>
                         </div>
                    </div>
                </div>
              </div>

              {/* Expandable Prompts Grid */}
              <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-white/[0.02]"
                    >
                        <div className="p-6">
                            {categoryPrompts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {categoryPrompts.map(prompt => (
                                        <div key={prompt.id} className="bg-[#0a0a0b] border border-white/10 p-4 rounded-lg hover:border-purple-500/30 transition-colors group cursor-pointer">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex gap-1">
                                                    {prompt.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded border border-white/5">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <h4 className="text-white font-medium text-sm mb-1 line-clamp-1">{prompt.title}</h4>
                                            <p className="text-gray-500 text-xs line-clamp-2">{prompt.description}</p>
                                        </div>
                                    ))}
                                    {/* Add Prompt to Category Button */}
                                    <button className="border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all min-h-[100px]">
                                        <Plus size={20} className="mb-1" />
                                        <span className="text-xs font-medium">Add to {category.name}</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    No prompts in this category yet.
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-1 block">Category Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-1 block">Slug (URL)</label>
                        <input 
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({...formData, slug: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                            placeholder="e.g. ai-art"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-1 block">Icon (Emoji)</label>
                        <input 
                            value={formData.icon}
                            onChange={(e) => setFormData({...formData, icon: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none text-center"
                            placeholder="🚀"
                        />
                    </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 mb-1 block">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none resize-none h-24"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                  >
                    Save Category
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