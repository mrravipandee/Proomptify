'use client';

import { useState } from 'react';
import { 
  User, 
  Lock, 
  Globe, 
  Save, 
  Upload, 
  CheckCircle2,
  Mail,
  Shield,
  Smartphone,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- Mock State ---
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@prompthub.com',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
  });

  const [appConfig, setAppConfig] = useState({
    siteName: 'PromptHub',
    supportEmail: 'support@prompthub.com',
    version: 'v1.2.0',
    maintenanceMode: false
  });

  // --- Handlers ---
  const handleSave = (section: string) => {
    setLoading(section);
    // Simulate API call
    setTimeout(() => {
      setLoading(null);
      setSuccess(section);
      setTimeout(() => setSuccess(null), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative p-6 md:p-8 space-y-8 overflow-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
      
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                <p className="text-gray-400 mt-1">Manage your account and global application preferences.</p>
            </div>
        </div>

        {/* 1. Profile Settings */}
        <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0b]/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl"
        >
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                    <User size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Admin Profile</h2>
                    <p className="text-xs text-gray-500">Update your personal information.</p>
                </div>
            </div>
            
            <div className="p-8 space-y-8">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full opacity-70 blur-sm group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative h-24 w-24 rounded-full p-[2px] bg-[#0a0a0b]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Upload size={20} className="text-white drop-shadow-md" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-medium">Profile Photo</h3>
                        <p className="text-xs text-gray-500 mt-1 mb-3">JPG, GIF or PNG. Max size of 800K</p>
                        <button className="text-xs bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors">
                            Upload New
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                        <div className="relative group">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                            <input 
                                value={profile.name}
                                onChange={(e) => setProfile({...profile, name: e.target.value})}
                                className="w-full bg-[#050510] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all placeholder-gray-600"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                        <div className="relative group">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                            <input 
                                value={profile.email}
                                onChange={(e) => setProfile({...profile, email: e.target.value})}
                                className="w-full bg-[#050510] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all placeholder-gray-600"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</label>
                        <div className="relative">
                            <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input 
                                value={profile.role}
                                disabled
                                className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex justify-end">
                <button 
                    onClick={() => handleSave('profile')}
                    disabled={loading === 'profile'}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading === 'profile' ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : success === 'profile' ? (
                        <>
                            <CheckCircle2 size={16} /> Saved
                        </>
                    ) : (
                        <>
                            <Save size={16} /> Save Changes
                        </>
                    )}
                </button>
            </div>
        </motion.section>

        {/* 2. Security / Password */}
        <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0a0a0b]/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl"
        >
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
                <div className="p-2.5 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                    <Lock size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Security</h2>
                    <p className="text-xs text-gray-500">Manage your password and authentication.</p>
                </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Password</label>
                    <input 
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-[#050510] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/20 transition-all placeholder-gray-600"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">New Password</label>
                    <input 
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-[#050510] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/20 transition-all placeholder-gray-600"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Confirm Password</label>
                    <input 
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-[#050510] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/20 transition-all placeholder-gray-600"
                    />
                </div>
            </div>

            <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
                 <button className="text-sm text-gray-400 hover:text-white flex items-center gap-2">
                    <Smartphone size={16} /> Enable 2FA
                 </button>
                 <button 
                    onClick={() => handleSave('password')}
                    disabled={loading === 'password'}
                    className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-colors"
                >
                    {loading === 'password' ? <Loader2 size={16} className="animate-spin" /> : success === 'password' ? 'Updated!' : 'Update Password'}
                </button>
            </div>
        </motion.section>

        {/* 3. App Information */}
        <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0a0a0b]/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl"
        >
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
                <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                    <Globe size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Application Settings</h2>
                    <p className="text-xs text-gray-500">Global configuration for the dashboard.</p>
                </div>
            </div>
            
            <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Site Name</label>
                        <input 
                            value={appConfig.siteName}
                            onChange={(e) => setAppConfig({...appConfig, siteName: e.target.value})}
                            className="w-full bg-[#050510] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Support Email</label>
                        <input 
                            value={appConfig.supportEmail}
                            onChange={(e) => setAppConfig({...appConfig, supportEmail: e.target.value})}
                            className="w-full bg-[#050510] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                             <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Maintenance Mode</h3>
                            <p className="text-xs text-gray-500">Disables the public site for visitors.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setAppConfig({...appConfig, maintenanceMode: !appConfig.maintenanceMode})}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors border ${
                            appConfig.maintenanceMode ? 'bg-purple-600 border-purple-500' : 'bg-[#050510] border-white/10'
                        }`}
                    >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${appConfig.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
                
                <div className="text-xs text-gray-500 text-center">
                    Current Version: <span className="text-gray-300 font-mono bg-white/5 px-2 py-0.5 rounded ml-2">{appConfig.version}</span>
                </div>
            </div>

            <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex justify-end">
                <button 
                    onClick={() => handleSave('app')}
                    disabled={loading === 'app'}
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50"
                >
                    {loading === 'app' ? <Loader2 size={16} className="animate-spin" /> : success === 'app' ? 'Saved!' : 'Save Changes'}
                </button>
            </div>
        </motion.section>

      </div>
    </div>
  );
}