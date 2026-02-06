'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string; // URL
  usageCount: number;
  status: 'Draft' | 'Published';
  promptText: string;
}

// --- Mock Data ---
const INITIAL_PROMPTS: Prompt[] = [
  { 
    id: '1', 
    title: 'Viral Instagram Hook', 
    description: 'Stop the scroll immediately with this psychological hook.', 
    category: 'Instagram', 
    tags: ['Viral', 'Hook'], 
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop', 
    usageCount: 1240, 
    status: 'Published',
    promptText: 'Create 5 hooks for...' 
  },
  { 
    id: '2', 
    title: 'LinkedIn Storytelling', 
    description: 'Framework to turn a boring update into a story.', 
    category: 'LinkedIn', 
    tags: ['Writing', 'Story'], 
    image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=100&h=100&fit=crop', 
    usageCount: 850, 
    status: 'Published',
    promptText: 'Rewrite this update...' 
  },
  { 
    id: '3', 
    title: 'YouTube Script Intro', 
    description: 'Perfect 30-second intro structure.', 
    category: 'YouTube', 
    tags: ['Script', 'Video'], 
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100&h=100&fit=crop', 
    usageCount: 2100, 
    status: 'Draft',
    promptText: 'Write an intro...' 
  },
];

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>(INITIAL_PROMPTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Prompt>>({
    title: '', category: 'Instagram', description: '', tags: [], promptText: '', status: 'Draft'
  });

  // --- Handlers ---

  const handleOpenModal = (prompt?: Prompt) => {
    if (prompt) {
      setEditingPrompt(prompt);
      setFormData(prompt);
    } else {
      setEditingPrompt(null);
      setFormData({ title: '', category: 'Instagram', description: '', tags: [], promptText: '', status: 'Draft', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      setPrompts(prompts.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrompt) {
      // Update Logic
      setPrompts(prompts.map(p => p.id === editingPrompt.id ? { ...p, ...formData } as Prompt : p));
    } else {
      // Create Logic
      const newPrompt: Prompt = {
        ...formData as Prompt,
        id: Math.random().toString(36).substr(2, 9),
        usageCount: 0,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop', // Mock Image
        tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map((t: string) => t.trim()) : []
      };
      setPrompts([...prompts, newPrompt]);
    }
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 space-y-6 relative h-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Prompts Library</h1>
          <p className="text-gray-400 text-sm">Create, edit, and manage your prompt collection.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-900/20"
        >
          <Plus size={16} />
          Add New Prompt
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#0a0a0b] border border-white/5 p-4 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search prompts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Prompts Table */}
      <div className="bg-[#0a0a0b] border border-white/5 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Prompt Info</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Usage</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {prompts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((prompt) => (
                <tr key={prompt.id} className="hover:bg-white/[0.02] transition-colors group">
                  
                  {/* Info Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={prompt.image} alt={prompt.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{prompt.title}</div>
                        <div className="flex gap-2 mt-1">
                          {prompt.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-gray-400">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 text-gray-300">
                     <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        {prompt.category}
                     </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      prompt.status === 'Published' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {prompt.status}
                    </span>
                  </td>

                  {/* Usage */}
                  <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                    {prompt.usageCount.toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => alert(prompt.promptText)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title="View Prompt Text">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleOpenModal(prompt)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 hover:text-blue-300" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(prompt.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <h2 className="text-xl font-bold text-white">
                  {editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Title</label>
                    <input 
                      name="title" 
                      required
                      value={formData.title} 
                      onChange={handleInputChange} 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                      placeholder="e.g. Viral Hook Generator" 
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Category</label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleInputChange} 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="YouTube">YouTube</option>
                      <option value="AI Art">AI Art</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Short Description</label>
                  <input 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                    placeholder="Briefly describe what this prompt does..." 
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Tags (comma separated)</label>
                  <input 
                    name="tags" 
                    value={formData.tags} 
                    onChange={handleInputChange} 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                    placeholder="Viral, Writing, Growth..." 
                  />
                </div>

                {/* Image Upload (Mock) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Cover Image</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-purple-500/50 hover:bg-white/5 transition-colors cursor-pointer">
                    <ImageIcon size={32} className="mb-2" />
                    <p className="text-sm">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-600 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  </div>
                </div>

                {/* Actual Prompt Text */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Prompt Content</label>
                  <textarea 
                    name="promptText" 
                    required
                    value={formData.promptText} 
                    onChange={handleInputChange} 
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="Enter the AI prompt template here..." 
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <label className="text-sm font-medium text-gray-400">Status:</label>
                  <div className="flex bg-white/5 rounded-lg p-1">
                    {(['Draft', 'Published'] as const).map((s) => (
                       <button
                         key={s}
                         type="button"
                         onClick={() => setFormData(prev => ({ ...prev, status: s }))}
                         className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                            formData.status === s ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
                         }`}
                       >
                         {s}
                       </button>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white rounded-lg font-medium shadow-lg shadow-purple-900/20"
                  >
                    {editingPrompt ? 'Save Changes' : 'Create Prompt'}
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