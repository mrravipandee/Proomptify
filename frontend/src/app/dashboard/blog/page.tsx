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
  Calendar,
  FileText,
  BarChart3,
  Sparkles,
  Globe,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  tags: string[];
  coverImage: string;
  status: 'Draft' | 'Published';
  publishedDate: string;
  views: number; // Added for stats
  content: string; 
}

// --- Mock Data ---
const INITIAL_POSTS: BlogPost[] = [
  { 
    id: '1', 
    title: 'How to Write Viral Hooks', 
    excerpt: 'The psychological triggers behind the most successful social media posts of 2024.', 
    author: 'Admin',
    tags: ['Marketing', 'Viral'], 
    coverImage: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=100&h=100&fit=crop', 
    status: 'Published',
    publishedDate: '2024-02-15',
    views: 12500,
    content: 'Full article content here...'
  },
  { 
    id: '2', 
    title: 'The Future of AI Prompts', 
    excerpt: 'Why prompt engineering is becoming the most valuable skill for creators.', 
    author: 'Sarah J.',
    tags: ['AI', 'Tech'], 
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&h=100&fit=crop', 
    status: 'Draft',
    publishedDate: '2024-02-20',
    views: 0,
    content: 'Full article content here...'
  },
  { 
    id: '3', 
    title: '5 Tools Every Creator Needs', 
    excerpt: 'A curated list of software that will save you 10+ hours a week.', 
    author: 'Admin',
    tags: ['Productivity', 'Tools'], 
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop', 
    status: 'Published',
    publishedDate: '2024-01-10',
    views: 8400,
    content: 'Full article content here...'
  },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '', excerpt: '', tags: [], content: '', status: 'Draft', coverImage: ''
  });

  // Derived Stats
  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'Published').length,
    totalViews: posts.reduce((acc, curr) => acc + (curr.views || 0), 0)
  };

  // --- Handlers ---
  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData(post);
    } else {
      setEditingPost(null);
      setFormData({ 
        title: '', 
        excerpt: '', 
        tags: [], 
        content: '', 
        status: 'Draft', 
        coverImage: '',
        author: 'Admin',
        publishedDate: new Date().toISOString().split('T')[0],
        views: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this post? This action cannot be undone.')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...formData } as BlogPost : p));
    } else {
      const newPost: BlogPost = {
        ...formData as BlogPost,
        id: Math.random().toString(36).substr(2, 9),
        tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map((t: string) => t.trim()) : [],
        views: 0
      };
      setPosts([newPost, ...posts]);
    }
    setIsModalOpen(false);
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Blog CMS</h1>
            <p className="text-gray-400 mt-1">Manage articles, SEO metadata, and publishing status.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-900/20"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Write Article</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><FileText size={20} /></div>
                <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold">Total Articles</p>
                    <p className="text-xl font-bold text-white">{stats.total}</p>
                </div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><Globe size={20} /></div>
                <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold">Published</p>
                    <p className="text-xl font-bold text-white">{stats.published}</p>
                </div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><BarChart3 size={20} /></div>
                <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold">Total Reads</p>
                    <p className="text-xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                </div>
             </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search articles by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0b]/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder-gray-600"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Blog List Table */}
        <div className="bg-[#0a0a0b]/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Article</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Stats</th>
                  <th className="px-6 py-4 font-semibold">Author</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((post) => (
                  <tr key={post.id} className="group hover:bg-white/[0.03] transition-colors duration-200">
                    
                    {/* Article Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 relative group-hover:border-purple-500/30 transition-all">
                           {post.coverImage ? (
                             /* eslint-disable-next-line @next/next/no-img-element */
                             <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-600">
                               <ImageIcon size={20} />
                             </div>
                           )}
                        </div>
                        <div>
                          <div className="font-semibold text-white line-clamp-1">{post.title}</div>
                          <div className="flex gap-2 mt-1.5">
                            {post.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-gray-400">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        post.status === 'Published' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'Published' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                        {post.status}
                      </span>
                    </td>

                    {/* Stats (Views/Date) */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                          <span className="text-sm text-white font-medium flex items-center gap-1.5">
                            <Eye size={12} className="text-gray-500" /> 
                            {post.views?.toLocaleString() || 0}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={10} />
                            {post.publishedDate}
                          </span>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="px-6 py-4 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-[10px] flex items-center justify-center text-white font-bold">
                                {post.author.charAt(0)}
                             </div>
                             {post.author}
                        </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Preview">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleOpenModal(post)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 hover:text-blue-300 transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300 transition-colors" title="Delete">
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
        </div>
      </div>

      {/* --- CMS EDITOR MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Sparkles className="text-purple-400" size={18} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">
                        {editingPost ? 'Edit Post' : 'New Article'}
                        </h2>
                        <p className="text-xs text-gray-400">Content Editor</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit} // Using simple submit for demo
                        className="px-6 py-2 bg-white text-black hover:bg-gray-200 rounded-lg text-sm font-bold transition-colors"
                    >
                        Save Draft
                    </button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col md:flex-row">
                
                {/* Left: Main Editor */}
                <div className="flex-1 overflow-y-auto p-8 border-r border-white/5">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="space-y-2">
                            <input 
                                name="title" 
                                required
                                value={formData.title} 
                                onChange={handleInputChange} 
                                className="w-full bg-transparent border-none px-0 py-2 text-4xl font-bold text-white placeholder-gray-600 focus:outline-none focus:ring-0"
                                placeholder="Article Title..." 
                            />
                        </div>

                        <div className="space-y-2 h-full">
                            <textarea 
                                name="content" 
                                required
                                value={formData.content} 
                                onChange={handleInputChange} 
                                className="w-full h-[60vh] bg-transparent border-none p-0 text-gray-300 font-serif text-lg leading-relaxed focus:outline-none focus:ring-0 resize-none placeholder-gray-700"
                                placeholder="Tell your story..." 
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Sidebar Settings */}
                <div className="w-full md:w-80 bg-[#050508] p-6 space-y-8 overflow-y-auto border-l border-white/5">
                    
                    {/* Status Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Publishing</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-400 mb-1.5 block">Status</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="Draft" className="bg-[#0a0a0b]">Draft</option>
                                    <option value="Published" className="bg-[#0a0a0b]">Published</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 mb-1.5 block">Publish Date</label>
                                <input 
                                    type="date"
                                    name="publishedDate"
                                    value={formData.publishedDate}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/10" />

                    {/* Metadata Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">SEO & Metadata</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-400 mb-1.5 block">Excerpt</label>
                                <textarea 
                                    name="excerpt" 
                                    value={formData.excerpt} 
                                    onChange={handleInputChange} 
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-purple-500 focus:outline-none resize-none"
                                    placeholder="Write a short summary..." 
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 mb-1.5 block">Tags</label>
                                <input 
                                    name="tags" 
                                    value={formData.tags} 
                                    onChange={handleInputChange} 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                                    placeholder="Tech, Guide..." 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/10" />

                    {/* Image Section */}
                    <div className="space-y-4">
                         <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Featured Image</h3>
                         <div className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-purple-500/50 hover:bg-white/5 transition-colors cursor-pointer text-center group">
                            <ImageIcon size={20} className="mb-2 group-hover:text-purple-400 transition-colors" />
                            <span className="text-xs">Drop image here</span>
                         </div>
                    </div>

                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}