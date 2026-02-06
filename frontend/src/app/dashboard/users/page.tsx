'use client';

import { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  RefreshCw, 
  Search, 
  Filter, 
  MoreVertical 
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
  avatarColor: string;
}

// --- Mock Data ---
const INITIAL_USERS: User[] = [
  { id: '1', name: 'Arjun Verma', email: 'arjun@example.com', age: 24, gender: 'Male', plan: 'Lifetime', status: 'Active', avatarColor: 'bg-blue-500' },
  { id: '2', name: 'Sarah Jenkins', email: 'sarah.j@example.com', age: 29, gender: 'Female', plan: 'Yearly', status: 'Active', avatarColor: 'bg-purple-500' },
  { id: '3', name: 'Michael Chen', email: 'm.chen@example.com', age: 35, gender: 'Male', plan: 'Free', status: 'Inactive', avatarColor: 'bg-green-500' },
  { id: '4', name: 'Priya Patel', email: 'priya@example.com', age: 22, gender: 'Female', plan: 'Yearly', status: 'Active', avatarColor: 'bg-pink-500' },
  { id: '5', name: 'David Smith', email: 'dave@example.com', age: 41, gender: 'Male', plan: 'Free', status: 'Active', avatarColor: 'bg-yellow-500' },
  { id: '6', name: 'Emma Wilson', email: 'emma@example.com', age: 27, gender: 'Female', plan: 'Lifetime', status: 'Active', avatarColor: 'bg-red-500' },
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
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">Lifetime 👑</span>;
      case 'Yearly':
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">Yearly</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">Free</span>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm">Manage your platform&apos;s user base.</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-purple-900/20">
                + Add User
            </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#0a0a0b] border border-white/5 p-4 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
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

      {/* Table Container */}
      <div className="bg-[#0a0a0b] border border-white/5 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Age</th>
                <th className="px-6 py-4 font-semibold">Gender</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  
                  {/* Name Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${user.avatarColor}`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Age */}
                  <td className="px-6 py-4 text-gray-300">
                    {user.age}
                  </td>

                  {/* Gender */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                      {user.gender}
                    </span>
                  </td>

                  {/* Plan Badge */}
                  <td className="px-6 py-4">
                    {getPlanBadge(user.plan)}
                  </td>

                  {/* Actions Buttons */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      <button 
                        title="Update Plan"
                        className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>

                      <button 
                        title="Edit User"
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button 
                        title="Delete User"
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      
                    </div>
                    {/* Mobile fallback (always visible on small screens) */}
                    <button className="md:hidden text-gray-500">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-gray-500">
                No users found matching your search.
            </div>
        )}

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-500 bg-[#0a0a0b]">
            <div>Showing 1-{filteredUsers.length} of {INITIAL_USERS.length}</div>
            <div className="flex gap-2">
                <button disabled className="px-3 py-1 rounded border border-white/10 opacity-50 cursor-not-allowed">Previous</button>
                <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 text-gray-300 transition">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}