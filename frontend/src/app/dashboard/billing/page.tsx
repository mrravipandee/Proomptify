'use client';

import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Types ---
interface Transaction {
  id: string;
  user: string;
  amount: string;
  status: 'Succeeded' | 'Pending' | 'Failed';
  date: string;
  plan: 'Yearly' | 'Lifetime';
}

// --- Mock Data ---
const REVENUE_STATS = [
  { label: 'Total Revenue', value: '$124,500', change: '+12.5%', trend: 'up', icon: DollarSign },
  { label: 'Paid Users', value: '1,240', change: '+8.2%', trend: 'up', icon: Users },
  { label: 'Active Subscriptions', value: '850', change: '+5.1%', trend: 'up', icon: CreditCard },
  { label: 'Churn Rate', value: '2.4%', change: '-0.5%', trend: 'down', icon: TrendingUp }, // Down is good for churn
];

const RECENT_TRANSACTIONS: Transaction[] = [
  { id: 'TX-1001', user: 'Alex Johnson', amount: '$49.00', status: 'Succeeded', date: 'Oct 24, 2024', plan: 'Yearly' },
  { id: 'TX-1002', user: 'Sarah Williams', amount: '$199.00', status: 'Succeeded', date: 'Oct 24, 2024', plan: 'Lifetime' },
  { id: 'TX-1003', user: 'Michael Brown', amount: '$49.00', status: 'Pending', date: 'Oct 23, 2024', plan: 'Yearly' },
  { id: 'TX-1004', user: 'Emily Davis', amount: '$199.00', status: 'Failed', date: 'Oct 23, 2024', plan: 'Lifetime' },
  { id: 'TX-1005', user: 'David Wilson', amount: '$49.00', status: 'Succeeded', date: 'Oct 22, 2024', plan: 'Yearly' },
];

export default function BillingPage() {
  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing Overview</h1>
          <p className="text-gray-400 text-sm">Monitor revenue, subscriptions, and transaction history.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {REVENUE_STATS.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          // For churn, down is good (green), up is bad (red)
          const isGood = stat.label === 'Churn Rate' ? !isPositive : isPositive;

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={index}
              className="bg-[#0a0a0b] border border-white/5 rounded-xl p-5 hover:border-purple-500/20 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                  <Icon size={20} />
                </div>
                <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${isGood ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                   {isGood ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                   {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Plan Breakdown */}
        <div className="lg:col-span-1 bg-[#0a0a0b] border border-white/5 rounded-xl p-6 flex flex-col h-full">
            <h3 className="text-lg font-bold text-white mb-6">Plan Distribution</h3>
            
            <div className="flex-1 flex flex-col justify-center gap-6">
                {/* Yearly Bar */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300 font-medium">Yearly Plan</span>
                        <span className="text-white font-bold">65%</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full w-[65%]"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">806 Users ($39,494)</p>
                </div>

                {/* Lifetime Bar */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300 font-medium">Lifetime Deal</span>
                        <span className="text-white font-bold">35%</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full w-[35%]"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">434 Users ($86,366)</p>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
                 <p className="text-sm text-gray-400">Most revenue comes from <span className="text-blue-400 font-bold">Lifetime</span> sales.</p>
            </div>
        </div>

        {/* Right Col: Recent Transactions */}
        <div className="lg:col-span-2 bg-[#0a0a0b] border border-white/5 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View All</button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Transaction ID</th>
                            <th className="px-6 py-4 font-semibold">User</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Plan</th>
                            <th className="px-6 py-4 font-semibold">Amount</th>
                            <th className="px-6 py-4 font-semibold text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {RECENT_TRANSACTIONS.map((tx) => (
                            <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{tx.id}</td>
                                <td className="px-6 py-4 text-sm text-white font-medium">{tx.user}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">{tx.date}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{tx.plan}</td>
                                <td className="px-6 py-4 text-sm text-white font-bold">{tx.amount}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                        tx.status === 'Succeeded' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        tx.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}