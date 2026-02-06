'use client';

import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Wallet,
  FileText,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Types ---
interface Transaction {
  id: string;
  user: string;
  email: string; // Added for better UI context
  amount: string;
  status: 'Succeeded' | 'Pending' | 'Failed';
  date: string;
  plan: 'Yearly' | 'Lifetime';
}

// --- Mock Data ---
const REVENUE_STATS = [
  { label: 'Total Revenue', value: '$124,500', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'Paid Users', value: '1,240', change: '+8.2%', trend: 'up', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Active Subs', value: '850', change: '+5.1%', trend: 'up', icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Churn Rate', value: '2.4%', change: '-0.5%', trend: 'down', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
];

const RECENT_TRANSACTIONS: Transaction[] = [
  { id: 'TX-1001', user: 'Alex Johnson', email: 'alex@company.com', amount: '$49.00', status: 'Succeeded', date: 'Oct 24, 2024', plan: 'Yearly' },
  { id: 'TX-1002', user: 'Sarah Williams', email: 'sarah@design.io', amount: '$199.00', status: 'Succeeded', date: 'Oct 24, 2024', plan: 'Lifetime' },
  { id: 'TX-1003', user: 'Michael Brown', email: 'mike@dev.co', amount: '$49.00', status: 'Pending', date: 'Oct 23, 2024', plan: 'Yearly' },
  { id: 'TX-1004', user: 'Emily Davis', email: 'emily@writer.net', amount: '$199.00', status: 'Failed', date: 'Oct 23, 2024', plan: 'Lifetime' },
  { id: 'TX-1005', user: 'David Wilson', email: 'david@agency.com', amount: '$49.00', status: 'Succeeded', date: 'Oct 22, 2024', plan: 'Yearly' },
];

export default function BillingPage() {
  return (
    <div className="min-h-screen relative p-6 md:p-8 space-y-8 overflow-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Billing & Revenue</h1>
            <p className="text-gray-400 mt-1">Track financial performance and transaction history.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors backdrop-blur-md">
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVENUE_STATS.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.trend === 'up';
            // Logic: Churn going down is Good (Positive visual), Churn going up is Bad.
            // For others: Up is Good.
            const isVisuallyPositive = stat.label === 'Churn Rate' ? !isPositive : isPositive;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="bg-[#0a0a0b]/60 border border-white/10 rounded-xl p-5 backdrop-blur-md hover:border-purple-500/20 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full border ${
                      isVisuallyPositive 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                     {isVisuallyPositive ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                     {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Col: Plan Breakdown (Visual Wallet) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 bg-[#0a0a0b]/60 border border-white/10 rounded-2xl p-6 flex flex-col h-full backdrop-blur-xl"
          >
              <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                      <Wallet size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Revenue Source</h3>
              </div>
              
              <div className="flex-1 flex flex-col justify-center gap-8">
                  
                  {/* Visual Card Representation */}
                  <div className="relative w-full aspect-[1.6/1] rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 p-6 flex flex-col justify-between shadow-2xl shadow-purple-900/40 overflow-hidden group">
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 blur-3xl rounded-full"></div>
                      
                      <div className="relative z-10 flex justify-between items-start">
                          <CreditCard className="text-white/80" />
                          <span className="text-white/80 font-mono text-sm">**** 4242</span>
                      </div>
                      <div className="relative z-10">
                          <p className="text-white/60 text-xs mb-1">Total Balance</p>
                          <h4 className="text-white text-2xl font-bold">$124,500.00</h4>
                      </div>
                  </div>

                  {/* Bars */}
                  <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-300 font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Yearly Plan
                            </span>
                            <span className="text-white font-bold">65%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-[65%] shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-right">$39,494 revenue</p>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-300 font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Lifetime Deal
                            </span>
                            <span className="text-white font-bold">35%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-[35%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-right">$86,366 revenue</p>
                    </div>
                  </div>
              </div>
          </motion.div>

          {/* Right Col: Recent Transactions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-[#0a0a0b]/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col"
          >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                          <Clock size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                  </div>
                  <button className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20">
                      View All History
                  </button>
              </div>
              
              <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-white/[0.02] text-gray-400 text-xs uppercase tracking-wider">
                          <tr>
                              <th className="px-6 py-4 font-semibold">Details</th>
                              <th className="px-6 py-4 font-semibold">Date</th>
                              <th className="px-6 py-4 font-semibold">Plan</th>
                              <th className="px-6 py-4 font-semibold">Amount</th>
                              <th className="px-6 py-4 font-semibold text-right">Status</th>
                              <th className="px-6 py-4 font-semibold text-right">Invoice</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                          {RECENT_TRANSACTIONS.map((tx) => (
                              <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                                  {/* User Details */}
                                  <td className="px-6 py-4">
                                      <div className="flex flex-col">
                                          <span className="text-white font-medium text-sm">{tx.user}</span>
                                          <span className="text-xs text-gray-500">{tx.email}</span>
                                          <span className="text-[10px] text-gray-600 font-mono mt-0.5">{tx.id}</span>
                                      </div>
                                  </td>
                                  
                                  <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                                      {tx.date}
                                  </td>
                                  
                                  <td className="px-6 py-4">
                                      <span className={`text-xs font-medium px-2 py-1 rounded border ${
                                          tx.plan === 'Lifetime' 
                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                      }`}>
                                          {tx.plan}
                                      </span>
                                  </td>
                                  
                                  <td className="px-6 py-4 text-sm text-white font-bold font-mono">
                                      {tx.amount}
                                  </td>
                                  
                                  <td className="px-6 py-4 text-right">
                                      <div className="flex justify-end">
                                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                              tx.status === 'Succeeded' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                              tx.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                              'bg-red-500/10 text-red-400 border-red-500/20'
                                          }`}>
                                              {tx.status === 'Succeeded' && <CheckCircle2 size={12} />}
                                              {tx.status === 'Pending' && <Clock size={12} />}
                                              {tx.status === 'Failed' && <XCircle size={12} />}
                                              {tx.status}
                                          </span>
                                      </div>
                                  </td>

                                  <td className="px-6 py-4 text-right">
                                      <button className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                                          <FileText size={16} />
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}