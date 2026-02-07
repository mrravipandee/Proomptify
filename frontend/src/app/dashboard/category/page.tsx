'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X,
  ChevronDown,
  FolderOpen,
  Layers,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; 
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

  // Stats
  const totalPrompts = categories.reduce((acc, curr) => acc + curr.promptCount, 0);

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
                        <p className="text-2xl font-bold text-white">{categories.length}</p>
                    </div>
                </div>
            </div>
            <div className="p-1 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                <div className="bg-[#0a0a0b]/80 backdrop-blur-xl rounded-xl p-4 flex items-center gap-4 h-full border border-white/5">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Prompts</p>
                        <p className="text-2xl font-bold text-white">{totalPrompts}</p>
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

        {/* Categories List (The "No Box" Design) */}
        <div className="space-y-4">
          <AnimatePresence>
          {categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((category) => {
            const isExpanded = expandedCategory === category.id;
            const categoryPrompts = MOCK_PROMPTS.filter(p => p.categoryId === category.id);

            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={category.id}
                className={`relative rounded-2xl transition-all duration-300 ${
                    isExpanded 
                    ? 'bg-white/[0.03] border border-purple-500/30 shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)]' 
                    : 'bg-transparent border border-white/5 hover:bg-white/[0.02] hover:border-white/10'
                }`}
              >
                {/* Expandable Header */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-all ${
                        isExpanded ? 'bg-purple-500/20 shadow-purple-500/10' : 'bg-white/5 border border-white/5'
                    }`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold flex items-center gap-2 transition-colors ${isExpanded ? 'text-white' : 'text-gray-200'}`}>
                        {category.name}
                        {isExpanded && <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/10">Active</span>}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">/{category.slug}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600" />
                          <span className="text-sm text-gray-500">{category.description}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0">
                      <div className="text-right px-4 border-r border-white/10">
                          <div className="text-lg font-bold text-white">{category.promptCount}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Prompts</div>
                      </div>

                      <div className="flex items-center gap-2">
                           <button 
                              onClick={() => toggleExpand(category.id)}
                              className={`p-2 rounded-lg transition-all ${
                                  isExpanded ? 'bg-white/10 text-white rotate-180' : 'text-gray-500 hover:text-white hover:bg-white/5'
                              }`}
                           >
                              <ChevronDown size={20} />
                           </button>

                           <div className="flex items-center gap-1">
                               <button onClick={() => handleOpenModal(category)} className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                  <Edit size={18} />
                               </button>
                               <button onClick={() => handleDelete(category.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                  <Trash2 size={18} />
                               </button>
                           </div>
                      </div>
                  </div>
                </div>

                {/* Expanded Content (The Prompts) */}
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
                                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prompts in this category</span>
                              </div>
                              
                              {categoryPrompts.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {categoryPrompts.map(prompt => (
                                          <div key={prompt.id} className="group relative bg-[#050508]/50 border border-white/5 p-4 rounded-xl hover:border-purple-500/30 transition-all cursor-pointer">
                                              {/* Hover Glow */}
                                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                                              
                                              <div className="relative z-10">
                                                <h4 className="text-gray-200 font-medium text-sm mb-1 group-hover:text-white">{prompt.title}</h4>
                                                <p className="text-gray-500 text-xs line-clamp-1">{prompt.description}</p>
                                                <div className="flex gap-1 mt-3">
                                                    {prompt.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded border border-white/5 group-hover:border-purple-500/20 group-hover:text-purple-300 transition-colors">{tag}</span>
                                                    ))}
                                                </div>
                                              </div>
                                          </div>
                                      ))}
                                      {/* Add Button */}
                                      <button className="border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all h-[100px] md:h-auto">
                                          <Plus size={16} />
                                          <span className="text-xs font-medium">Add Prompt</span>
                                      </button>
                                  </div>
                              ) : (
                                  <div className="text-center py-6 text-gray-500 text-sm italic">
                                      No prompts yet. Add one to get started.
                                  </div>
                              )}
                          </div>
                      </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </div>
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
                  <label className="text-xs text-gray-400 font-medium mb-1.5 block uppercase tracking-wider">Category Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="e.g. Marketing"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label className="text-xs text-gray-400 font-medium mb-1.5 block uppercase tracking-wider">Slug</label>
                        <input 
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({...formData, slug: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
                            placeholder="marketing"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 font-medium mb-1.5 block uppercase tracking-wider">Icon</label>
                        <input 
                            value={formData.icon}
                            onChange={(e) => setFormData({...formData, icon: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none text-center"
                            placeholder="🚀"
                        />
                    </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1.5 block uppercase tracking-wider">Description</label>
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
                    className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium text-sm shadow-lg shadow-purple-900/20"
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