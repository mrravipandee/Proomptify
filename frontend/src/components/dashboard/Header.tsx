'use client';

import { 
  Menu, 
  Bell, 
  Search, 
  ChevronDown, 
  User as UserIcon,
  LogOut,
  Settings
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Helper to format page title
  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    const current = segments[segments.length - 1];
    if (!current || current === 'dashboard') return 'Overview';
    // Remove hyphens and capitalize
    return current.replace('-', ' ').charAt(0).toUpperCase() + current.replace('-', ' ').slice(1);
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-[#050520]/80 px-6 backdrop-blur-xl transition-all">
      
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div>
           <h2 className="text-lg font-bold text-white tracking-tight">
             {getPageTitle()}
           </h2>
           <p className="hidden md:block text-xs text-gray-500">
             Manage your store settings
           </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Search Bar */}
        <div className={`hidden md:flex relative transition-all duration-300 ${isSearchFocused ? 'w-80' : 'w-64'}`}>
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isSearchFocused ? 'text-purple-400' : 'text-gray-500'}`} />
            <input 
                type="text" 
                placeholder="Search anything..." 
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full h-10 rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
            />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors group">
          <Bell size={20} className="group-hover:scale-110 transition-transform" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-purple-500 ring-2 ring-[#050520]">
             <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
          </span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10 hidden md:block"></div>
        
        {/* User Profile Menu */}
        <div className="relative">
            <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
            >
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[1px]">
                    <div className="h-full w-full rounded-full bg-[#050520] flex items-center justify-center">
                        <span className="text-xs font-bold text-white">AD</span>
                    </div>
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white leading-none">Admin User</p>
                    <p className="text-[10px] text-gray-400 mt-1">Super Admin</p>
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isProfileOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#0a0a0b] p-2 shadow-xl shadow-black/50 backdrop-blur-xl z-20"
                        >
                            <div className="px-3 py-2 border-b border-white/5 mb-1">
                                <p className="text-sm text-white font-medium">Signed in as</p>
                                <p className="text-xs text-gray-400 truncate">admin@prompthub.com</p>
                            </div>
                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                                <UserIcon size={16} /> Profile
                            </button>
                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                                <Settings size={16} /> Settings
                            </button>
                            <div className="my-1 border-t border-white/5" />
                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                <LogOut size={16} /> Sign out
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>

      </div>
    </header>
  );
}