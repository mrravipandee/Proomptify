'use client';

import { useState } from 'react';
import { 
  User, 
  Lock, 
  Globe, 
  Save, 
  Upload, 
  CheckCircle2,
} from 'lucide-react';

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

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
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
    }, 1000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm">Manage your account and global application preferences.</p>
      </div>

      {/* 1. Profile Settings */}
      <section className="bg-[#0a0a0b] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <User size={20} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-white">Admin Profile</h2>
                <p className="text-xs text-gray-500">Update your personal information.</p>
            </div>
        </div>
        
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-6">
                <div className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={profile.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-white/10" />
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Upload size={16} className="text-white" />
                    </div>
                </div>
                <div>
                    <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">Change Avatar</button>
                    <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. Max size of 800K</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                    <input 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Email Address</label>
                    <input 
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Role</label>
                    <input 
                        value={profile.role}
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
                    />
                </div>
            </div>
        </div>

        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex justify-end">
            <button 
                onClick={() => handleSave('profile')}
                disabled={loading === 'profile'}
                className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
            >
                {loading === 'profile' ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white/50 border-t-white rounded-full"></span>
                ) : success === 'profile' ? (
                    <>
                        <CheckCircle2 size={16} className="text-green-400" />
                        Saved
                    </>
                ) : (
                    <>
                        <Save size={16} />
                        Save Changes
                    </>
                )}
            </button>
        </div>
      </section>

      {/* 2. Security / Password */}
      <section className="bg-[#0a0a0b] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                <Lock size={20} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-white">Change Password</h2>
                <p className="text-xs text-gray-500">Ensure your account stays secure.</p>
            </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Current Password</label>
                <input 
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">New Password</label>
                <input 
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Confirm Password</label>
                <input 
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
            </div>
        </div>

        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex justify-end">
             <button 
                onClick={() => handleSave('password')}
                disabled={loading === 'password'}
                className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
            >
                {loading === 'password' ? 'Saving...' : success === 'password' ? 'Updated!' : 'Update Password'}
            </button>
        </div>
      </section>

      {/* 3. App Information */}
      <section className="bg-[#0a0a0b] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Globe size={20} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-white">Application Settings</h2>
                <p className="text-xs text-gray-500">Global configuration for the dashboard.</p>
            </div>
        </div>
        
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Site Name</label>
                    <input 
                        value={appConfig.siteName}
                        onChange={(e) => setAppConfig({...appConfig, siteName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Support Email</label>
                    <input 
                        value={appConfig.supportEmail}
                        onChange={(e) => setAppConfig({...appConfig, supportEmail: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                    <h3 className="text-sm font-bold text-white">Maintenance Mode</h3>
                    <p className="text-xs text-gray-500">Disables the public site for visitors.</p>
                </div>
                <button 
                    onClick={() => setAppConfig({...appConfig, maintenanceMode: !appConfig.maintenanceMode})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${appConfig.maintenanceMode ? 'bg-purple-600' : 'bg-gray-700'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${appConfig.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            
            <div className="text-xs text-gray-500 pt-2">
                Application Version: <span className="text-gray-300 font-mono">{appConfig.version}</span>
            </div>
        </div>

        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex justify-end">
            <button 
                onClick={() => handleSave('app')}
                disabled={loading === 'app'}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
                {loading === 'app' ? 'Saving...' : success === 'app' ? 'Saved!' : 'Save Changes'}
            </button>
        </div>
      </section>

    </div>
  );
}