import React, { useState } from 'react';
import { ArrowLeft, CreditCard as Edit, Mail, Phone, Building, Calendar, DollarSign, User, Tag, Activity, FileText } from 'lucide-react';
import { Lead } from '../../types/crm';

interface Lead360Props {
  leadId: string;
  onBack: () => void;
}

const sampleLead: Lead = {
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
  notes: [
    'Initial contact made via website form',
    'Interested in premium chit schemes for employees',
    'Budget confirmed at ₹5L',
    'Decision maker: CEO Rajesh Gupta',
    'Next meeting scheduled for proposal presentation'
  ],
  tags: ['corporate', 'high-value', 'premium', 'employee-benefits'],
  nextFollowUp: '2024-03-18T10:00:00'
};

export const Lead360: React.FC<Lead360Props> = ({ leadId, onBack }) => {
  const [lead] = useState<Lead>(sampleLead);
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-800 border-green-200';
      case 'proposal': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'won': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'activity', name: 'Activity', icon: Activity },
    { id: 'notes', name: 'Notes', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Lead Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead Name</span>
                  <span className="text-slate-50 font-medium">{lead.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Company</span>
                  <span className="text-slate-50">{lead.company || 'Individual'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Source</span>
                  <span className="text-slate-50 capitalize">{lead.source.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead Value</span>
                  <span className="text-green-400 font-semibold">{formatCurrency(lead.value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned To</span>
                  <span className="text-slate-50">{lead.assignedTo}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Contact Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">{lead.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">{lead.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">Created: {new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">Updated: {new Date(lead.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-lg font-semibold text-slate-50 mb-4">Lead Notes</h3>
            <div className="space-y-3">
              {lead.notes.map((note, index) => (
                <div key={index} className="p-3 bg-slate-700/30 rounded-xl border border-yellow-400/20">
                  <p className="text-slate-50">{note}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-50 mb-2">Activity Timeline</h3>
            <p className="text-sm text-slate-400">Activity tracking coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-bold text-xl border border-yellow-400/30">
              {lead.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-50">{lead.name}</h1>
              <p className="text-slate-400">{lead.company || 'Individual Lead'}</p>
              <div className="flex items-center space-x-3 mt-1">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priority)}`}></div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                  {lead.status.toUpperCase()}
                </span>
                <span className="text-slate-500 text-sm">
                  Value: {formatCurrency(lead.value)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all">
            <Edit className="h-4 w-4 mr-2" />
            Edit Lead
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-yellow-400/30 bg-slate-800/40 backdrop-blur-xl flex-shrink-0">
        <nav className="flex space-x-4 px-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                } whitespace-nowrap py-3 px-2 border-b-2 font-medium text-sm flex items-center transition-all`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
        {renderTabContent()}
      </div>
    </div>
  );
};