import React, { useState } from 'react';
import { TrendingUp, Award, Target, DollarSign, Users, Calendar, BarChart3, PieChart } from 'lucide-react';

export const Conversions: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  const conversionStats = [
    { label: 'Total Conversions', value: '24', icon: Award, color: 'text-green-400', change: '+8 this month' },
    { label: 'Conversion Rate', value: '18.5%', icon: TrendingUp, color: 'text-blue-400', change: '+2.3%' },
    { label: 'Avg Deal Size', value: '₹3.2L', icon: DollarSign, color: 'text-purple-400', change: '+15%' },
    { label: 'Sales Velocity', value: '12 days', icon: Target, color: 'text-orange-400', change: '-2 days' }
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Conversions & Win Analysis</h1>
          <p className="mt-1 text-sm text-slate-400">
            Track successful conversions and sales performance
          </p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
        >
          <option value="current-month">Current Month</option>
          <option value="last-month">Last Month</option>
          <option value="current-quarter">Current Quarter</option>
          <option value="current-year">Current Year</option>
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {conversionStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-xl border border-yellow-400/30">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Conversion Trends
            </h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-yellow-400/30 rounded-xl">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                <p className="text-slate-400">Conversion Chart</p>
                <p className="text-slate-500 text-sm">Interactive chart coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Win/Loss Analysis
            </h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-yellow-400/30 rounded-xl">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                <p className="text-slate-400">Win/Loss Chart</p>
                <p className="text-slate-500 text-sm">Interactive chart coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};