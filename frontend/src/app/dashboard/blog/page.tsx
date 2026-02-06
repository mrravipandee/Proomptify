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
  X,
  FileText
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
  content: string; // HTML or Markdown content
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
        publishedDate: new Date().toISOString().split('T')[0]
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
        tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map((t: string) => t.trim()) : []
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
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Management</h1>
          <p className="text-gray-400 text-sm">Create and publish content for your users.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-900/20"
        >
          <Plus size={16} />
          Create Post
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#0a0a0b] border border-white/5 p-4 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search posts..." 
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

      {/* Blog List Table */}
      <div className="bg-[#0a0a0b] border border-white/5 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Article</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Author</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                  
                  {/* Article Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 relative">
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
                        <div className="font-medium text-white line-clamp-1">{post.title}</div>
                        <div className="flex gap-2 mt-1">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-gray-400">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      post.status === 'Published' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'Published' ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                      {post.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        {post.publishedDate}
                    </div>
                  </td>

                  {/* Author */}
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {post.author}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title="Preview">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleOpenModal(post)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 hover:text-blue-300" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300" title="Delete">
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

      {/* --- CMS EDITOR MODAL --- */}
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
              className="relative w-full max-w-4xl bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <FileText className="text-purple-400" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                    {editingPost ? 'Edit Post' : 'New Article'}
                    </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Main Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <input 
                                name="title" 
                                required
                                value={formData.title} 
                                onChange={handleInputChange} 
                                className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-2xl font-bold text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                                placeholder="Enter article title..." 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Content</label>
                            <textarea 
                                name="content" 
                                required
                                value={formData.content} 
                                onChange={handleInputChange} 
                                rows={15}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-mono text-sm focus:border-purple-500 focus:outline-none resize-none leading-relaxed"
                                placeholder="# Write your story here..." 
                            />
                        </div>
                    </div>

                    {/* Right: Sidebar Settings */}
                    <div className="space-y-6">
                        
                        {/* Status Card */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                            <h3 className="text-sm font-semibold text-white">Publishing</h3>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-gray-400">Status</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-gray-400">Publish Date</label>
                                <input 
                                    type="date"
                                    name="publishedDate"
                                    value={formData.publishedDate}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none" 
                                />
                            </div>
                        </div>

                        {/* Metadata Card */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                            <h3 className="text-sm font-semibold text-white">Metadata</h3>
                            
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Excerpt</label>
                                <textarea 
                                    name="excerpt" 
                                    value={formData.excerpt} 
                                    onChange={handleInputChange} 
                                    rows={3}
                                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none resize-none"
                                    placeholder="Short summary for SEO..." 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Tags (comma separated)</label>
                                <input 
                                    name="tags" 
                                    value={formData.tags} 
                                    onChange={handleInputChange} 
                                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                                    placeholder="Tech, AI, Guide..." 
                                />
                            </div>
                        </div>

                        {/* Image Card */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                             <h3 className="text-sm font-semibold text-white">Featured Image</h3>
                             <div className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-purple-500/50 hover:bg-white/5 transition-colors cursor-pointer text-center">
                                <ImageIcon size={24} className="mb-2" />
                                <span className="text-xs">Upload Cover</span>
                             </div>
                        </div>

                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white rounded-lg font-medium shadow-lg shadow-purple-900/20"
                  >
                    {editingPost ? 'Save Changes' : 'Publish Post'}
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