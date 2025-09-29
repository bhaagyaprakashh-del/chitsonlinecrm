import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Award, Target, DollarSign, Users, Calendar, BarChart3, PieChart, Plus, Eye, UserPlus, CheckCircle, Star, Trophy, Crown, Medal, Phone, Mail, Building, User, CreditCard, Search, Filter, MoreVertical, Activity, FileText } from 'lucide-react';
import { loadLeads, updateLead } from '../../data/leads.mock';
import { Lead } from '../../types/crm';
import toast from 'react-hot-toast';

interface ConvertedLead extends Lead {
  conversionDate: string;
  subscriberId?: string;
  isConverted: boolean;
}

interface AgentPerformance {
  agentName: string;
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  totalValue: number;
  rank: number;
  badge: 'champion' | 'star' | 'performer' | 'rookie';
}

// Mock function to save subscriber (in real app, this would call an API)
const saveSubscriber = (subscriberData: any) => {
  const existingSubscribers = JSON.parse(localStorage.getItem('subscribers_data') || '[]');
  const newSubscriber = {
    id: `sub_${Date.now()}`,
    subscriberId: `SUB${String(Date.now()).slice(-3)}`,
    firstName: subscriberData.firstName,
    lastName: subscriberData.lastName,
    email: subscriberData.email,
    phone: subscriberData.phone,
    company: subscriberData.company,
    membershipType: 'Individual',
    membershipTier: 'Basic',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'active',
    creditScore: 75,
    totalInvestments: subscriberData.leadValue || 0,
    currentBalance: 0,
    totalReturns: 0,
    activeSchemes: [],
    completedSchemes: [],
    totalSchemes: 0,
    kycStatus: 'pending',
    branch: 'Bangalore Main',
    assignedAgent: subscriberData.assignedTo,
    tags: ['converted-lead', ...subscriberData.tags],
    notes: `Converted from lead. Original lead value: ₹${subscriberData.leadValue?.toLocaleString('en-IN')}`,
    paymentHistory: {
      onTimePayments: 0,
      latePayments: 0,
      missedPayments: 0,
      averageDelayDays: 0
    },
    communicationPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
      phone: false,
      preferredTime: 'evening',
      language: 'English'
    },
    riskProfile: 'low',
    riskFactors: [],
    nominee: {
      name: '',
      relationship: '',
      phone: '',
      address: '',
      idProof: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    documents: [],
    createdAt: new Date().toISOString(),
    createdBy: 'system@ramnirmalchits.com',
    updatedAt: new Date().toISOString(),
    updatedBy: 'system@ramnirmalchits.com'
  };
  
  existingSubscribers.push(newSubscriber);
  localStorage.setItem('subscribers_data', JSON.stringify(existingSubscribers));
  
  // Trigger event to notify subscriber components
  window.dispatchEvent(new CustomEvent('subscribersUpdated'));
  
  return newSubscriber;
};

const ConvertedLeadsTable: React.FC<{ 
  leads: ConvertedLead[]; 
  onConvertToSubscriber: (lead: ConvertedLead) => void;
}> = ({ leads, onConvertToSubscriber }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'converted' && lead.isConverted) ||
                         (filterStatus === 'pending' && !lead.isConverted);
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search converted leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg w-full text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
          >
            <option value="all">All Converted Leads</option>
            <option value="converted">Converted to Subscriber</option>
            <option value="pending">Pending Conversion</option>
          </select>
          <div className="text-sm text-slate-400 flex items-center">
            Showing: <span className="font-semibold ml-1 text-slate-50">{filteredLeads.length}</span> leads
          </div>
        </div>
      </div>

      {/* Converted Leads Table */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-yellow-400/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-yellow-400/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Deal Value</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Conversion Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yellow-400/20">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priority)}`} title={`${lead.priority} priority`}></div>
                        <div className="h-10 w-10 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-medium border border-yellow-400/30">
                          {lead.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-50">{lead.name}</p>
                        <p className="text-xs text-slate-400">{lead.company || 'Individual'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-slate-300">{lead.email}</p>
                      <p className="text-xs text-slate-400">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-semibold text-green-400">{formatCurrency(lead.value)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-50">{lead.assignedTo}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-50">{new Date(lead.conversionDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.isConverted ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <UserPlus className="h-3 w-3 mr-1" />
                        SUBSCRIBER
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        WON
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          if (navigator.userAgent.match(/Mobile|Android|iPhone|iPad/)) {
                            window.location.href = `tel:${lead.phone}`;
                          } else {
                            navigator.clipboard.writeText(lead.phone);
                            toast.success(`Phone number copied: ${lead.phone}`);
                          }
                        }}
                        className="text-green-400 hover:text-green-300"
                        title="Call Lead"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          const subject = encodeURIComponent(`Congratulations on your successful enrollment!`);
                          const body = encodeURIComponent(`Dear ${lead.name},\n\nCongratulations on successfully enrolling in our chit fund scheme!\n\nBest regards,\n${lead.assignedTo}`);
                          window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`;
                        }}
                        className="text-blue-400 hover:text-blue-300"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      {!lead.isConverted && (
                        <button
                          onClick={() => onConvertToSubscriber(lead)}
                          className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Convert to Subscriber
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 mx-auto text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-50 mb-2">No converted leads found</h3>
          <p className="text-sm text-slate-400">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

const AgentPerformanceCard: React.FC<{ performance: AgentPerformance }> = ({ performance }) => {
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'champion': return 'bg-red-100 text-red-800 border-red-200';
      case 'star': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'performer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rookie': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return Crown;
      case 2: return Medal;
      case 3: return Award;
      default: return Trophy;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-orange-400';
      default: return 'text-slate-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const RankIcon = getRankIcon(performance.rank);

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl border border-yellow-400/30 ${
            performance.rank === 1 ? 'bg-yellow-500/20' :
            performance.rank === 2 ? 'bg-gray-500/20' :
            performance.rank === 3 ? 'bg-orange-500/20' : 'bg-blue-500/20'
          }`}>
            <RankIcon className={`h-6 w-6 ${getRankColor(performance.rank)}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-slate-50">#{performance.rank}</h3>
              <h4 className="text-lg font-semibold text-slate-50">{performance.agentName}</h4>
            </div>
            <p className="text-sm text-slate-400">Sales Agent</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getBadgeColor(performance.badge)}`}>
          {performance.badge.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Total Leads</span>
            <span className="text-slate-50 font-medium">{performance.totalLeads}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Converted</span>
            <span className="text-green-400 font-medium">{performance.convertedLeads}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Conversion Rate</span>
            <span className="text-purple-400 font-medium">{performance.conversionRate.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Total Value</span>
            <span className="text-orange-400 font-medium">{formatCurrency(performance.totalValue)}</span>
          </div>
        </div>
      </div>

      {/* Conversion Rate Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-slate-400 mb-1">
          <span>Conversion Performance</span>
          <span>{performance.conversionRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-3 border border-yellow-400/20">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              performance.conversionRate >= 80 ? 'bg-green-500' :
              performance.conversionRate >= 60 ? 'bg-yellow-500' :
              performance.conversionRate >= 40 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(performance.conversionRate, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-yellow-400/20">
        <div className="flex items-center text-xs text-slate-500">
          <Star className="h-3 w-3 mr-1" />
          <span>Rank #{performance.rank} • {performance.badge}</span>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Conversions: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState('converted-leads');
  const [convertedLeadsData, setConvertedLeadsData] = useState<ConvertedLead[]>([]);

  // Load leads data on component mount
  useEffect(() => {
    const loadedLeads = loadLeads();
    setLeads(loadedLeads);
    
    // Load converted leads from localStorage or initialize from won leads
    const saved = localStorage.getItem('converted_leads_data');
    if (saved) {
      try {
        setConvertedLeadsData(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load converted leads:', error);
        initializeConvertedLeads(loadedLeads);
      }
    } else {
      initializeConvertedLeads(loadedLeads);
    }
  }, []);

  const initializeConvertedLeads = (allLeads: Lead[]) => {
    const wonLeads = allLeads.filter(l => l.status === 'won');
    const converted = wonLeads.map(lead => ({
      ...lead,
      conversionDate: lead.updatedAt,
      isConverted: false
    }));
    setConvertedLeadsData(converted);
    localStorage.setItem('converted_leads_data', JSON.stringify(converted));
  };

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedLeads = loadLeads();
      setLeads(updatedLeads);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('leadsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('leadsUpdated', handleStorageChange);
    };
  }, []);

  // Calculate real conversion stats from leads data
  const conversionStats = useMemo(() => {
    const wonLeads = leads.filter(l => l.status === 'won');
    const lostLeads = leads.filter(l => l.status === 'lost');
    const totalConversions = wonLeads.length;
    const totalAttempts = wonLeads.length + lostLeads.length;
    const conversionRate = totalAttempts > 0 ? (wonLeads.length / totalAttempts * 100).toFixed(1) : '0';
    const avgDealSize = wonLeads.length > 0 ? wonLeads.reduce((sum, l) => sum + l.value, 0) / wonLeads.length : 0;
    const totalValue = wonLeads.reduce((sum, l) => sum + l.value, 0);

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 1,
      }).format(amount);
    };

    return [
      { label: 'Total Conversions', value: totalConversions.toString(), icon: Award, color: 'text-green-400', change: `${wonLeads.filter(l => new Date(l.updatedAt) > new Date(Date.now() - 30*24*60*60*1000)).length} this month` },
      { label: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-blue-400', change: 'Win rate' },
      { label: 'Avg Deal Size', value: formatCurrency(avgDealSize), icon: DollarSign, color: 'text-purple-400', change: 'Per conversion' },
      { label: 'Total Won Value', value: formatCurrency(totalValue), icon: Target, color: 'text-orange-400', change: 'All time' }
    ];
  }, [leads]);

  // Calculate agent performance rankings
  const agentPerformance = useMemo(() => {
    const agentStats: Record<string, AgentPerformance> = {};
    
    leads.forEach(lead => {
      if (!lead.assignedTo) return;
      
      if (!agentStats[lead.assignedTo]) {
        agentStats[lead.assignedTo] = {
          agentName: lead.assignedTo,
          totalLeads: 0,
          convertedLeads: 0,
          conversionRate: 0,
          totalValue: 0,
          rank: 0,
          badge: 'rookie'
        };
      }
      
      agentStats[lead.assignedTo].totalLeads++;
      if (lead.status === 'won') {
        agentStats[lead.assignedTo].convertedLeads++;
        agentStats[lead.assignedTo].totalValue += lead.value;
      }
    });

    // Calculate conversion rates and assign rankings
    const performances = Object.values(agentStats).map(agent => ({
      ...agent,
      conversionRate: agent.totalLeads > 0 ? (agent.convertedLeads / agent.totalLeads) * 100 : 0
    }));

    // Sort by conversion rate and assign ranks
    performances.sort((a, b) => b.conversionRate - a.conversionRate);
    performances.forEach((agent, index) => {
      agent.rank = index + 1;
      agent.badge = agent.conversionRate >= 80 ? 'champion' :
                   agent.conversionRate >= 60 ? 'star' :
                   agent.conversionRate >= 40 ? 'performer' : 'rookie';
    });

    return performances;
  }, [leads]);

  const handleConvertToSubscriber = (lead: ConvertedLead) => {
    try {
      // Create subscriber data from lead
      const subscriberData = {
        firstName: lead.name.split(' ')[0] || lead.name,
        lastName: lead.name.split(' ').slice(1).join(' ') || '',
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        leadValue: lead.value,
        assignedTo: lead.assignedTo,
        tags: lead.tags || []
      };

      // Save as subscriber
      const newSubscriber = saveSubscriber(subscriberData);
      
      // Update converted leads data
      const updatedConvertedLeads = convertedLeadsData.map(cl => 
        cl.id === lead.id 
          ? { ...cl, isConverted: true, subscriberId: newSubscriber.id }
          : cl
      );
      
      setConvertedLeadsData(updatedConvertedLeads);
      localStorage.setItem('converted_leads_data', JSON.stringify(updatedConvertedLeads));
      
      toast.success(`${lead.name} has been successfully converted to a subscriber!`);
      console.log('Lead converted to subscriber:', newSubscriber);
    } catch (error) {
      console.error('Error converting lead to subscriber:', error);
      toast.error('Failed to convert lead to subscriber. Please try again.');
    }
  };

  const tabs = [
    { id: 'converted-leads', name: 'Converted Leads', icon: CheckCircle, count: convertedLeadsData.length },
    { id: 'sales-performance', name: 'Sales & Ranking Performance', icon: Trophy, count: agentPerformance.length }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'converted-leads':
        return (
          <ConvertedLeadsTable 
            leads={convertedLeadsData}
            onConvertToSubscriber={handleConvertToSubscriber}
          />
        );

      case 'sales-performance':
        return (
          <div className="space-y-6">
            {/* Top 3 Podium */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-6 flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Top Performers Podium
              </h3>
              <div className="flex items-end justify-center space-x-8">
                {/* 2nd Place */}
                {agentPerformance[1] && (
                  <div className="text-center">
                    <div className="w-20 h-16 bg-gray-500/20 rounded-t-lg flex items-center justify-center border border-yellow-400/30 mb-2">
                      <Medal className="h-8 w-8 text-gray-300" />
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3 border border-yellow-400/20">
                      <p className="text-sm font-semibold text-slate-50">{agentPerformance[1].agentName}</p>
                      <p className="text-xs text-slate-400">{agentPerformance[1].convertedLeads} conversions</p>
                      <p className="text-xs text-gray-300">{agentPerformance[1].conversionRate.toFixed(1)}% rate</p>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {agentPerformance[0] && (
                  <div className="text-center">
                    <div className="w-24 h-20 bg-yellow-500/20 rounded-t-lg flex items-center justify-center border border-yellow-400/50 mb-2">
                      <Crown className="h-10 w-10 text-yellow-400" />
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4 border border-yellow-400/30">
                      <p className="text-lg font-bold text-slate-50">{agentPerformance[0].agentName}</p>
                      <p className="text-sm text-yellow-400">{agentPerformance[0].convertedLeads} conversions</p>
                      <p className="text-xs text-slate-500">🏆 {agentPerformance[0].conversionRate.toFixed(1)}% rate</p>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {agentPerformance[2] && (
                  <div className="text-center">
                    <div className="w-20 h-12 bg-orange-500/20 rounded-t-lg flex items-center justify-center border border-yellow-400/30 mb-2">
                      <Award className="h-6 w-6 text-orange-400" />
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3 border border-yellow-400/20">
                      <p className="text-sm font-semibold text-slate-50">{agentPerformance[2].agentName}</p>
                      <p className="text-xs text-slate-400">{agentPerformance[2].convertedLeads} conversions</p>
                      <p className="text-xs text-orange-300">{agentPerformance[2].conversionRate.toFixed(1)}% rate</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* All Agent Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {agentPerformance.map((performance) => (
                <AgentPerformanceCard key={performance.agentName} performance={performance} />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Conversions & Win Analysis</h1>
          <p className="mt-1 text-sm text-slate-400">
            Track successful conversions, sales performance, and convert leads to subscribers
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
                <span className="ml-2 bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
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

        {/* Tab Content */}
        {renderTabContent()}

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