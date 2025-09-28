import React, { useState } from 'react';
import { Plus, Search, Download, FileText, DollarSign, Calendar, CheckCircle, Clock } from 'lucide-react';
import { loadLeads } from '../../data/leads.mock';

export const OrdersReceipts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [leads] = useState(() => loadLeads());

  // Generate orders from won leads
  const orders = React.useMemo(() => {
    const wonLeads = leads.filter(l => l.status === 'won');
    return wonLeads.map((lead, index) => ({
      id: lead.id,
      orderNumber: `ORD-2024-${String(index + 1).padStart(3, '0')}`,
      customerName: lead.name,
      customerCompany: lead.company,
      customerEmail: lead.email,
      customerPhone: lead.phone,
      amount: lead.value,
      date: lead.updatedAt.split('T')[0],
      status: 'completed' as const,
      receiptGenerated: true,
      assignedTo: lead.assignedTo,
      source: lead.source,
      tags: lead.tags
    }));
  }, [leads]);

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customerCompany && order.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Orders & Receipts</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage customer orders and payment receipts
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all">
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        {/* Search */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg w-full text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-yellow-400/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-yellow-400/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-400/20">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-slate-50">{order.orderNumber}</p>
                        <p className="text-xs text-slate-400">Source: {order.source}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-slate-50">{order.customerName}</p>
                        {order.customerCompany && (
                          <p className="text-xs text-slate-400">{order.customerCompany}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-slate-50">{order.customerEmail}</p>
                        <p className="text-xs text-slate-400">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-green-400">{formatCurrency(order.amount)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-50">{new Date(order.date).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-50">{order.assignedTo}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.receiptGenerated ? (
                        <button className="text-blue-400 hover:text-blue-300">
                          <Download className="h-4 w-4" />
                        </button>
                      ) : (
                        <button className="text-green-400 hover:text-green-300">
                          <FileText className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Orders</p>
                <p className="text-2xl font-bold text-slate-50">{orders.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Value</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(orders.reduce((sum, o) => sum + o.amount, 0))}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Order Size</p>
                <p className="text-2xl font-bold text-purple-400">{formatCurrency(orders.length > 0 ? orders.reduce((sum, o) => sum + o.amount, 0) / orders.length : 0)}</p>
              </div>
              <Target className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">This Month</p>
                <p className="text-2xl font-bold text-orange-400">{orders.filter(o => new Date(o.date) > new Date(Date.now() - 30*24*60*60*1000)).length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};