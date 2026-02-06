'use client';

import { Menu, Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  
  // Format page title from pathname (e.g. /dashboard/users -> Users)
  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    const current = segments[segments.length - 1];
    if (!current || current === 'dashboard') return 'Overview';
    return current.charAt(0).toUpperCase() + current.slice(1);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#050520]/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-md"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold text-white">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar (Hidden on mobile) */}
        <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input 
                type="text" 
                placeholder="Search..." 
                className="h-9 w-64 rounded-full bg-white/5 border border-white/10 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
            />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple-500 ring-2 ring-[#050520]" />
        </button>
        
        {/* User Avatar */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border border-white/20" />
      </div>
    </header>
  );
}