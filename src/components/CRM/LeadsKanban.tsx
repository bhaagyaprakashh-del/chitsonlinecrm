import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, CreditCard as Edit, Phone, Mail, DollarSign, Calendar, User } from 'lucide-react';
import { Lead } from '../../types/crm';

const sampleLeads: Lead[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone: '+91 98765 43210',
    company: 'TechCorp Solutions Pvt Ltd',
    source: 'website',
    status: 'qualified',
    priority: 'high',
    value: 500000,
    assignedTo: 'Priya Sharma',
    createdAt: '2024-03-10T10:30:00',
    updatedAt: '2024-03-15T14:20:00',
    notes: ['Initial contact made', 'Interested in premium schemes'],
    tags: ['corporate', 'high-value'],
    nextFollowUp: '2024-03-18T10:00:00'
  },
  {
    id: '2',
    name: 'Sunita Reddy',
    email: 'sunita.reddy@gmail.com',
    phone: '+91 98765 43211',
    source: 'referral',
    status: 'contacted',
    priority: 'medium',
    value: 250000,
    assignedTo: 'Karthik Nair',
    createdAt: '2024-03-12T15:45:00',
    updatedAt: '2024-03-14T11:30:00',
    notes: ['Referred by existing customer'],
    tags: ['referral'],
    nextFollowUp: '2024-03-17T14:00:00'
  }
];

const LeadCard: React.FC<{ lead: Lead }> = ({ lead }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className={`bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30 border-l-4 ${getPriorityColor(lead.priority)} hover:border-yellow-400/50 transition-all cursor-pointer`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-slate-50 font-medium mb-1">{lead.name}</h4>
          <p className="text-slate-400 text-sm">{lead.company || 'Individual'}</p>
        </div>
        <span className="text-xs text-slate-500 capitalize">{lead.priority}</span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-slate-300">
          <Mail className="h-3 w-3 mr-2 text-slate-500" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <Phone className="h-3 w-3 mr-2 text-slate-500" />
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <DollarSign className="h-3 w-3 mr-2 text-slate-500" />
          <span>{formatCurrency(lead.value)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-yellow-400/20">
        <div className="flex items-center text-xs text-slate-500">
          <User className="h-3 w-3 mr-1" />
          <span>{lead.assignedTo}</span>
        </div>
        <div className="flex space-x-1">
          <button className="p-1 text-slate-400 hover:text-blue-400 rounded">
            <Eye className="h-3 w-3" />
          </button>
          <button className="p-1 text-slate-400 hover:text-green-400 rounded">
            <Edit className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

const KanbanColumn: React.FC<{ 
  title: string; 
  status: string; 
  leads: Lead[]; 
  color: string;
}> = ({ title, status, leads, color }) => {
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-4 border border-yellow-400/30 min-h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <h3 className="text-slate-50 font-semibold">{title}</h3>
          <span className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full text-xs">
            {leads.length}
          </span>
        </div>
        <button className="p-1 text-slate-400 hover:text-slate-50 rounded">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
};

export const LeadsKanban: React.FC = () => {
  const [leads] = useState<Lead[]>(sampleLeads);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { title: 'New Leads', status: 'new', color: 'bg-blue-500' },
    { title: 'Contacted', status: 'contacted', color: 'bg-yellow-500' },
    { title: 'Qualified', status: 'qualified', color: 'bg-green-500' },
    { title: 'Proposal', status: 'proposal', color: 'bg-purple-500' },
    { title: 'Negotiation', status: 'negotiation', color: 'bg-orange-500' },
    { title: 'Won', status: 'won', color: 'bg-emerald-500' },
    { title: 'Lost', status: 'lost', color: 'bg-red-500' }
  ];

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Leads Pipeline (Kanban)</h1>
          <p className="mt-1 text-sm text-slate-400">
            Visual pipeline management with drag-and-drop
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm w-64"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex space-x-4 min-w-max">
          {columns.map((column) => {
            const columnLeads = filteredLeads.filter(lead => lead.status === column.status);
            return (
              <div key={column.status} className="w-80 flex-shrink-0">
                <KanbanColumn
                  title={column.title}
                  status={column.status}
                  leads={columnLeads}
                  color={column.color}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};