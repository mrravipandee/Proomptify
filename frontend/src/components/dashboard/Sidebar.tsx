'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BookOpen, 
  Layers, 
  CreditCard, 
  Settings,
  LogOut,
  X,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Prompts', href: '/dashboard/prompts', icon: FileText },
  { name: 'Categories', href: '/dashboard/category', icon: Layers },
  { name: 'Blog CMS', href: '/dashboard/blog', icon: BookOpen },
];

const systemNav = [
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const adminNav = [
  { name: 'Manage Prompts', href: '/dashboard/admin/prompts', icon: Shield },
  { name: 'Analytics', href: '/dashboard/admin/analytics', icon: LayoutDashboard },
];

interface NavItemType {
  name: string;
  href: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  const NavItem = ({ item }: { item: NavItemType }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeSidebar"
            className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-xl"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-3">
            <Icon size={18} className={isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-white'} />
            {item.name}
        </span>
        {isActive && (
            <motion.div 
                layoutId="activeGlow"
                className="absolute right-2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" 
            />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:static top-0 left-0 z-50 h-full w-72 bg-[#050510]/95 backdrop-blur-xl border-r border-white/5 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 flex items-center justify-center rounded-xl shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform">
                <Image src="/proomptify.png" alt="Logo" width={20} height={20} className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Proomptify</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 no-scrollbar">
            
            {/* Main Group */}
            <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Main Menu</h3>
                <div className="space-y-1">
                    {mainNav.map((item) => (
                        <NavItem key={item.href} item={item} />
                    ))}
                </div>
            </div>

            {/* Admin Group - Only show for admin users */}
            {isAdmin && (
              <div>
                <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                  <Shield size={14} />
                  Admin Panel
                </h3>
                <div className="space-y-1">
                    {adminNav.map((item) => (
                        <NavItem key={item.href} item={item} />
                    ))}
                </div>
              </div>
            )}

            {/* System Group */}
            <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">System</h3>
                <div className="space-y-1">
                    {systemNav.map((item) => (
                        <NavItem key={item.href} item={item} />
                    ))}
                </div>
            </div>

        </div>

        {/* Bottom Section: Upgrade Card & Logout */}
        <div className="p-4 border-t border-white/5 space-y-4">
            
            {/* User Info */}
            {user && (
              <div className="px-3 py-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                {isAdmin && (
                  <p className="text-xs text-purple-400 mt-1">👑 Admin Access</p>
                )}
              </div>
            )}

            {/* Upgrade Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 p-4">
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-purple-500/20 rounded-full blur-xl" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-purple-500 rounded-lg text-white shadow-lg shadow-purple-500/30">
                            <Zap size={14} fill="currentColor" />
                        </div>
                        <span className="text-sm font-bold text-white">Pro Plan</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">Get advanced analytics and unlimited prompts.</p>
                    <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
                        Upgrade Now
                    </button>
                </div>
            </div>

            {/* Logout */}
            <button 
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-colors group"
            >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                Sign Out
            </button>
        </div>
      </aside>
    </>
  );
}