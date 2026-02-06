'use client';

import { 
  Users, 
  CreditCard, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Components ---

// 1. The Stat Card (Reusable)
type StatCardProps = {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ size?: number }>; 
  trend: 'up' | 'down';
  delay?: number;
};

const StatCard = ({ title, value, change, icon: Icon, trend, delay }: StatCardProps) => {
  const isPositive = trend === 'up';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-purple-500/30 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-purple-500/10"
    >
      {/* Internal Gradient Glow on Hover */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/10 blur-[50px] transition-all group-hover:bg-purple-500/20" />
      
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-gray-400 group-hover:text-white transition-colors">
          <Icon size={20} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${
          isPositive 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        <p className="text-sm text-gray-500 font-medium mt-1">{title}</p>
      </div>
    </motion.div>
  );
};

// 2. Mock Chart Component (Visual only, no heavy library)
const RevenueChart = () => {
  const bars = [40, 65, 50, 80, 55, 90, 70, 95, 60, 85, 75, 100]; // Heights in %
  return (
    <div className="h-full w-full flex items-end justify-between gap-2 pt-8">
      {bars.map((height, i) => (
        <div key={i} className="group relative flex-1 flex flex-col justify-end h-full">
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-bold px-2 py-1 rounded">
                ${height * 100}
            </div>
            {/* The Bar */}
            <div 
                style={{ height: `${height}%` }} 
                className="w-full bg-white/10 rounded-t-sm hover:bg-purple-500 transition-all duration-300 relative overflow-hidden"
            >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-50" />
            </div>
        </div>
      ))}
    </div>
  );
};

// 3. Main Page
export default function DashboardPage() {
  const stats: StatCardProps[] = [
    { title: "Total Users", value: "12,345", change: "+12%", icon: Users, trend: "up" },
    { title: "Paid Subs", value: "1,234", change: "+4%", icon: CreditCard, trend: "up" },
    { title: "Prompts", value: "54,321", change: "+24%", icon: FileText, trend: "up" },
    { title: "Revenue", value: "$45,231", change: "-2%", icon: DollarSign, trend: "down" }
  ];

  return (
    <div className="min-h-screen bg-[#050520] relative overflow-hidden p-6 md:p-8">
      
      {/* --- BACKGROUND EFFECTS (The "Dimension" Look) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          {/* Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Dashboard <span className="text-purple-500">Overview</span>
            </h1>
            <p className="text-gray-400 mt-1">Welcome back, here&apos;s what&apos;s happening today.</p>
          </div>
          
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors backdrop-blur-md">
                Download Report
             </button>
             <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-purple-900/20">
                + Add Prompt
             </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* CHARTS & ACTIVITY ROW */}
        <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Left: Revenue Chart */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
                        <p className="text-xs text-gray-500">Monthly recurring revenue (MRR)</p>
                    </div>
                    <select className="bg-black/20 border border-white/10 text-xs text-gray-300 rounded-lg px-2 py-1 focus:outline-none">
                        <option>Last 12 Months</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
                <div className="h-[250px] w-full">
                    <RevenueChart />
                </div>
            </motion.div>

            {/* Right: Recent Activity */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                    <button className="text-xs text-purple-400 hover:text-purple-300">View All</button>
                </div>
                
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 group-hover:border-purple-500/30 group-hover:text-white transition-colors">
                                <Activity size={16} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-white font-medium">New User Registered</p>
                                <p className="text-xs text-gray-500">2 minutes ago</p>
                            </div>
                            <ArrowUpRight size={14} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
                        </div>
                    ))}
                </div>
            </motion.div>

        </div>
      </div>
    </div>
  );
}