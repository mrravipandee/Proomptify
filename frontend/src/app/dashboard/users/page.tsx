'use client';

import { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  RefreshCw, 
  Search, 
  Filter, 
  MoreVertical,
  Download,
  ShieldCheck,
  UserPlus,
  Users as UsersIcon
} from 'lucide-react';

// --- Types ---
type PlanType = 'Free' | 'Yearly' | 'Lifetime';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  plan: PlanType;
  status: 'Active' | 'Inactive';
  avatarGradient: string; // Changed to gradient for better visuals
}

// --- Mock Data ---
const INITIAL_USERS: User[] = [
  { id: '1', name: 'Arjun Verma', email: 'arjun@example.com', age: 24, gender: 'Male', plan: 'Lifetime', status: 'Active', avatarGradient: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Sarah Jenkins', email: 'sarah.j@example.com', age: 29, gender: 'Female', plan: 'Yearly', status: 'Active', avatarGradient: 'from-purple-500 to-pink-500' },
  { id: '3', name: 'Michael Chen', email: 'm.chen@example.com', age: 35, gender: 'Male', plan: 'Free', status: 'Inactive', avatarGradient: 'from-emerald-500 to-green-500' },
  { id: '4', name: 'Priya Patel', email: 'priya@example.com', age: 22, gender: 'Female', plan: 'Yearly', status: 'Active', avatarGradient: 'from-orange-500 to-red-500' },
  { id: '5', name: 'David Smith', email: 'dave@example.com', age: 41, gender: 'Male', plan: 'Free', status: 'Active', avatarGradient: 'from-yellow-500 to-amber-500' },
  { id: '6', name: 'Emma Wilson', email: 'emma@example.com', age: 27, gender: 'Female', plan: 'Lifetime', status: 'Active', avatarGradient: 'from-indigo-500 to-blue-600' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logic
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper for Plan Badges
  const getPlanBadge = (plan: PlanType) => {
    switch (plan) {
      case 'Lifetime':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_-4px_rgba(245,158,11,0.3)]">
            <ShieldCheck size={12} /> Lifetime
          </span>
        );
      case 'Yearly':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
            Yearly
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
            Free
          </span>
        );
    }
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
            <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
            <p className="text-gray-400 mt-1">View, manage, and organize your platform members.</p>
          </div>
          <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors backdrop-blur-md">
                  <Download size={16} /> Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-900/20">
                  <UserPlus size={16} /> Add User
              </button>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
                { label: 'Total Users', val: '12,345', color: 'text-white' },
                { label: 'Active Now', val: '1,234', color: 'text-green-400' },
                { label: 'New Today', val: '+45', color: 'text-purple-400' }
            ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">{stat.label}</p>
                        <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.val}</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                        <UsersIcon size={18} />
                    </div>
                </div>
            ))}
        </div>

        {/* Toolbar (Search & Filter) */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search users by name, email or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0b]/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder-gray-600"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* The Table */}
        <div className="bg-[#0a0a0b]/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              
              {/* Table Header */}
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">User Profile</th>
                  <th className="px-6 py-4 font-semibold">Age / Gender</th>
                  <th className="px-6 py-4 font-semibold">Subscription</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.03] transition-colors duration-200">
                    
                    {/* Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br ${user.avatarGradient} ring-2 ring-[#050520]`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Age/Gender */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">{user.age} yrs</div>
                      <div className="text-xs text-gray-500">{user.gender}</div>
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      {getPlanBadge(user.plan)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${
                            user.status === 'Active' 
                                ? 'bg-green-500/5 text-green-400 border-green-500/20' 
                                : 'bg-red-500/5 text-red-400 border-red-500/20'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-400' : 'bg-red-400'}`} />
                            {user.status}
                        </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        
                        <button 
                          title="Change Plan"
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                        >
                          <RefreshCw size={16} />
                        </button>

                        <button 
                          title="Edit Details"
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Edit size={16} />
                        </button>

                        <button 
                          title="Delete Account"
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        
                      </div>
                      {/* Mobile menu trigger */}
                      <button className="md:hidden text-gray-500">
                          <MoreVertical size={20} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-600 mb-4">
                     <Search size={32} />
                  </div>
                  <h3 className="text-white font-medium mb-1">No users found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
              </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-sm bg-white/[0.01]">
              <div className="text-gray-500">Showing 1-{filteredUsers.length} of {INITIAL_USERS.length}</div>
              <div className="flex gap-2">
                  <button disabled className="px-3 py-1.5 rounded-lg border border-white/10 text-gray-600 cursor-not-allowed">Previous</button>
                  <button className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 transition">Next</button>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
}