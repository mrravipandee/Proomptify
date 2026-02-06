'use client';

import { Users, CreditCard, FileText, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "12,345",
      change: "+12% from last month",
      icon: Users,
      trend: "up"
    },
    {
      title: "Paid Subscriptions",
      value: "1,234",
      change: "+4% from last month",
      icon: CreditCard,
      trend: "up"
    },
    {
      title: "Total Prompts",
      value: "54,321",
      change: "+24% from last month",
      icon: FileText,
      trend: "up"
    },
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "-2% from last month",
      icon: DollarSign,
      trend: "down"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050520] p-8">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your store&apos;s performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md transition-all hover:border-white/20"
            >
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-gray-400">
                  {stat.title}
                </p>
                <Icon className="h-4 w-4 text-gray-500" />
              </div>
              
              <div className="mt-2">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className={`text-xs mt-1 flex items-center gap-1 ${
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}