'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, FileText, TrendingUp, Loader } from 'lucide-react';
import { api } from '@/lib/api';

interface Stats {
  totalPrompts: number;
  totalUsers: number;
  totalUsage: number;
  revenueThisMonth: number;
  averageUsagePerPrompt: number;
  topPrompts: Array<{ id: string; title: string; usage: number }>;
  activeUsers: number;
  newUsersThisMonth: number;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminStats();
      setStats((response as any)?.data || null);
    } catch (error: unknown) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    delay,
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ size?: number }>;
    trend?: { value: number; isPositive: boolean };
    delay: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:border-purple-500/30 hover:bg-white/[0.07] transition-all"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/10 blur-[50px] transition-all group-hover:bg-purple-500/20" />

      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-gray-400 group-hover:text-white transition-colors">
          <Icon size={20} />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full border ${
              trend.isPositive
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        <p className="text-sm text-gray-500 font-medium mt-1">{title}</p>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050520]">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#050520]/95 backdrop-blur">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Dashboard Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">
            Monitor your platform performance
          </p>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Prompts"
            value={stats?.totalPrompts || 0}
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            trend={{ value: 8, isPositive: true }}
            delay={0.1}
          />
          <StatCard
            title="Total Usage"
            value={stats?.totalUsage || 0}
            icon={BarChart3}
            trend={{ value: 23, isPositive: true }}
            delay={0.2}
          />
          <StatCard
            title="This Month Revenue"
            value={`$${stats?.revenueThisMonth || 0}`}
            icon={TrendingUp}
            trend={{ value: 15, isPositive: true }}
            delay={0.3}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatCard
            title="Active Users"
            value={stats?.activeUsers || 0}
            icon={Users}
            delay={0.4}
          />
          <StatCard
            title="New Users (This Month)"
            value={stats?.newUsersThisMonth || 0}
            icon={Users}
            delay={0.5}
          />
          <StatCard
            title="Avg Usage Per Prompt"
            value={Math.round(stats?.averageUsagePerPrompt || 0)}
            icon={TrendingUp}
            delay={0.6}
          />
        </div>

        {/* Top Prompts */}
        {stats?.topPrompts && stats.topPrompts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 size={20} className="text-purple-400" />
              Top Performing Prompts
            </h2>

            <div className="space-y-3">
              {stats.topPrompts.map((prompt, index) => (
                <div
                  key={prompt.id}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10 group hover:border-purple-500/30 hover:bg-white/[0.08] transition-all"
                >
                  <div className="text-purple-400 font-bold text-lg w-8">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium line-clamp-1">
                      {prompt.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {prompt.usage}
                    </p>
                    <p className="text-gray-500 text-xs">uses</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
