import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, CreditCard as Edit, Phone, Mail, DollarSign, Calendar, User, MoreVertical, GripVertical } from 'lucide-react';
import { Lead } from '../../types/crm';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const STORAGE_KEY = 'leads.kanban.v1';

// Use the same leads data as AllLeads component
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
    notes: ['Initial contact made', 'Interested in premium schemes', 'Budget confirmed'],
    tags: ['corporate', 'high-value', 'premium'],
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
    notes: ['Referred by existing customer', 'Interested in silver scheme'],
    tags: ['referral', 'silver-scheme'],
    nextFollowUp: '2024-03-17T14:00:00'
  },
  {
    id: '3',
    name: 'StartupInc',
    email: 'founder@startupinc.com',
    phone: '+91 98765 43212',
    company: 'StartupInc Technologies',
    source: 'cold-call',
    status: 'new',
    priority: 'low',
    value: 100000,
    assignedTo: 'Vikram Singh',
    createdAt: '2024-03-14T09:15:00',
    updatedAt: '2024-03-14T09:15:00',
    notes: ['Cold call made', 'Needs more information'],
    tags: ['startup', 'tech'],
    nextFollowUp: '2024-03-16T16:00:00'
  },
  {
    id: '4',
    name: 'Manufacturing Ltd',
    email: 'info@manufacturing.com',
    phone: '+91 98765 43213',
    company: 'Manufacturing Ltd',
    source: 'advertisement',
    status: 'proposal',
    priority: 'high',
    value: 750000,
    assignedTo: 'Priya Sharma',
    createdAt: '2024-03-08T11:20:00',
    updatedAt: '2024-03-13T16:45:00',
    notes: ['Proposal sent', 'Awaiting feedback'],
    tags: ['manufacturing', 'large-deal'],
    nextFollowUp: '2024-03-19T10:00:00'
  },
  {
    id: '5',
    name: 'Retail Chain Co',
    email: 'procurement@retailchain.com',
    phone: '+91 98765 43214',
    company: 'Retail Chain Co',
    source: 'website',
    status: 'negotiation',
    priority: 'high',
    value: 1200000,
    assignedTo: 'Vikram Singh',
    createdAt: '2024-03-05T14:30:00',
    updatedAt: '2024-03-14T12:15:00',
    notes: ['In final negotiations', 'Price discussion ongoing'],
    tags: ['retail', 'enterprise', 'high-value'],
    nextFollowUp: '2024-03-17T15:00:00'
  },
  {
    id: '6',
    name: 'Success Story Inc',
    email: 'ceo@successstory.com',
    phone: '+91 98765 43215',
    company: 'Success Story Inc',
    source: 'referral',
    status: 'won',
    priority: 'high',
    value: 800000,
    assignedTo: 'Priya Sharma',
    createdAt: '2024-02-28T10:00:00',
    updatedAt: '2024-03-12T17:30:00',
    notes: ['Deal closed successfully', 'Payment received'],
    tags: ['won-deal', 'referral', 'success'],
    nextFollowUp: '2024-04-12T10:00:00'
  },
  {
    id: '7',
    name: 'Failed Venture',
    email: 'contact@failedventure.com',
    phone: '+91 98765 43216',
    company: 'Failed Venture Pvt Ltd',
    source: 'cold-call',
    status: 'lost',
    priority: 'low',
    value: 650000,
    assignedTo: 'Karthik Nair',
    createdAt: '2024-03-11T14:20:00',
    updatedAt: '2024-03-13T12:30:00',
    notes: ['Budget constraints', 'Went with competitor'],
    tags: ['lost-deal', 'competitor'],
    nextFollowUp: '2024-06-01T10:00:00'
  },
  {
    id: '8',
    name: 'Healthcare Solutions',
    email: 'admin@healthcare.com',
    phone: '+91 98765 43217',
    company: 'Healthcare Solutions Pvt Ltd',
    source: 'referral',
    status: 'qualified',
    priority: 'medium',
    value: 480000,
    assignedTo: 'Vikram Singh',
    createdAt: '2024-03-09T13:45:00',
    updatedAt: '2024-03-13T16:30:00',
    notes: ['Qualified lead', 'Needs proposal for employee benefits'],
    tags: ['healthcare', 'employee-benefits'],
    nextFollowUp: '2024-03-18T14:00:00'
  },
  {
    id: '9',
    name: 'Digital Innovations',
    email: 'contact@digitalinnovations.com',
    phone: '+91 98765 43218',
    company: 'Digital Innovations Pvt Ltd',
    source: 'website',
    status: 'new',
    priority: 'high',
    value: 850000,
    assignedTo: 'Priya Sharma',
    createdAt: '2024-03-15T09:30:00',
    updatedAt: '2024-03-15T09:30:00',
    notes: ['Website inquiry received', 'Interested in corporate schemes'],
    tags: ['website-lead', 'corporate'],
    nextFollowUp: '2024-03-16T10:00:00'
  },
  {
    id: '10',
    name: 'Small Business Owner',
    email: 'owner@smallbiz.com',
    phone: '+91 98765 43219',
    company: 'Small Business Enterprises',
    source: 'referral',
    status: 'contacted',
    priority: 'low',
    value: 120000,
    assignedTo: 'Karthik Nair',
    createdAt: '2024-03-13T16:00:00',
    updatedAt: '2024-03-15T10:45:00',
    notes: ['Small business owner', 'Interested in basic schemes'],
    tags: ['small-business', 'basic-scheme'],
    nextFollowUp: '2024-03-18T14:30:00'
  },
  {
    id: '11',
    name: 'Premium Investors Group',
    email: 'invest@premium.com',
    phone: '+91 98765 43220',
    company: 'Premium Investors Group',
    source: 'website',
    status: 'proposal',
    priority: 'high',
    value: 1100000,
    assignedTo: 'Priya Sharma',
    createdAt: '2024-03-04T11:15:00',
    updatedAt: '2024-03-12T13:50:00',
    notes: ['High-value investor group', 'Proposal under review'],
    tags: ['premium', 'investor-group'],
    nextFollowUp: '2024-03-17T11:00:00'
  },
  {
    id: '12',
    name: 'Education Institute',
    email: 'finance@education.org',
    phone: '+91 98765 43221',
    company: 'Education Institute',
    source: 'website',
    status: 'negotiation',
    priority: 'medium',
    value: 420000,
    assignedTo: 'Karthik Nair',
    createdAt: '2024-03-06T15:45:00',
    updatedAt: '2024-03-13T14:10:00',
    notes: ['Negotiating payment terms', 'Educational pricing discussion'],
    tags: ['education', 'negotiation'],
    nextFollowUp: '2024-03-17T16:00:00'
  },
  {
    id: '13',
    name: 'Consulting Firm Ltd',
    email: 'partners@consulting.com',
    phone: '+91 98765 43222',
    company: 'Consulting Firm Ltd',
    source: 'advertisement',
    status: 'won',
    priority: 'medium',
    value: 560000,
    assignedTo: 'Vikram Singh',
    createdAt: '2024-02-25T14:20:00',
    updatedAt: '2024-03-10T12:45:00',
    notes: ['Successful closure', 'Quick decision process'],
    tags: ['consulting', 'won-deal'],
    nextFollowUp: '2024-05-10T10:00:00'
  },
  {
    id: '14',
    name: 'Budget Constraints Corp',
    email: 'finance@budgetcorp.com',
    phone: '+91 98765 43223',
    company: 'Budget Constraints Corp',
    source: 'cold-call',
    status: 'lost',
    priority: 'low',
    value: 280000,
    assignedTo: 'Karthik Nair',
    createdAt: '2024-02-20T09:00:00',
    updatedAt: '2024-03-05T14:20:00',
    notes: ['Budget constraints', 'Decided to postpone'],
    tags: ['lost-deal', 'budget-issue'],
    nextFollowUp: '2024-06-01T10:00:00'
  },
  {
    id: '15',
    name: 'Global Tech Solutions',
    email: 'info@globaltech.com',
    phone: '+91 98765 43224',
    company: 'Global Tech Solutions',
    source: 'cold-call',
    status: 'new',
    priority: 'medium',
    value: 450000,
    assignedTo: 'Vikram Singh',
    createdAt: '2024-03-15T11:15:00',
    updatedAt: '2024-03-15T11:15:00',
    notes: ['Cold call made', 'Showed interest in premium schemes'],
    tags: ['cold-call', 'tech-company'],
    nextFollowUp: '2024-03-17T14:00:00'
  }
];
interface SortableLeadCardProps {
  lead: Lead;
}

const SortableLeadCard: React.FC<SortableLeadCardProps> = ({ lead }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30 border-l-4 ${getPriorityColor(lead.priority)} hover:border-yellow-400/50 transition-all cursor-pointer group ${
        isDragging ? 'ring-2 ring-white/30 cursor-grabbing shadow-2xl scale-105 z-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-slate-50 font-medium mb-1">{lead.name}</h4>
          <p className="text-slate-400 text-sm">{lead.company || 'Individual'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 capitalize">{lead.priority}</span>
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded opacity-0 group-hover:opacity-100 transition-all cursor-grab active:cursor-grabbing"
            aria-label="Drag lead"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
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
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
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

interface KanbanColumnProps {
  title: string;
  status: string;
  leads: Lead[];
  color: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, leads, color }) => {
  const {
    setNodeRef,
    isOver,
  } = useSortable({
    id: status,
    data: {
      type: 'column',
      status: status,
    },
  });

  return (
    <div 
      ref={setNodeRef}
      className={`bg-slate-800/40 backdrop-blur-xl rounded-2xl p-4 border border-yellow-400/30 min-h-[600px] flex flex-col transition-all ${
        isOver ? 'border-yellow-400/60 bg-slate-700/40' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
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
      
      <SortableContext items={leads.map(lead => lead.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 flex-1 overflow-y-auto scrollbar-none">
          {leads.map((lead) => (
            <SortableLeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const DragOverlayCard: React.FC<{ lead: Lead | null }> = ({ lead }) => {
  if (!lead) return null;

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
    <div className={`bg-slate-800/90 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/50 border-l-4 ${getPriorityColor(lead.priority)} shadow-2xl transform rotate-3 scale-105`}>
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
      </div>
    </div>
  );
};

export const LeadsKanban: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { distance: 4 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load leads from localStorage or use initial data
  useEffect(() => {
    const savedLeads = localStorage.getItem(STORAGE_KEY);
    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch (error) {
        console.error('Failed to parse saved leads:', error);
        setLeads(sampleLeads);
      }
    } else {
      setLeads(sampleLeads);
    }
  }, []);

  // Save leads to localStorage whenever leads change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

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
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getLeadsByStatus = (status: string) => {
    return filteredLeads.filter(lead => lead.status === status);
  };

  const findContainer = (id: UniqueIdentifier) => {
    const lead = leads.find(l => l.id === id);
    return lead?.status || null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeLead = leads.find(lead => lead.id === activeId);
    if (!activeLead) return;

    const activeContainer = activeLead.status;
    let overContainer: string;

    // Check if dropping on a column (droppable area)
    if (columns.some(col => col.status === overId)) {
      overContainer = overId as string;
    } else {
      // Dropping on another lead card
      const overLead = leads.find(lead => lead.id === overId);
      if (!overLead) return;
      overContainer = overLead.status;
    }

    if (!overContainer) return;

    setLeads(prevLeads => {
      const activeIndex = prevLeads.findIndex(lead => lead.id === activeId);

      if (activeIndex === -1) return prevLeads;

      const newLeads = [...prevLeads];

      // If moving to a different column, update the lead's status
      if (activeContainer !== overContainer) {
        newLeads[activeIndex] = {
          ...newLeads[activeIndex],
          status: overContainer as Lead['status'],
          updatedAt: new Date().toISOString()
        };
      }

      // Handle reordering within the same column or when dropping on another lead
      if (overId !== activeId) {
        const overIndex = newLeads.findIndex(lead => lead.id === overId);
        if (overIndex !== -1) {
          // Remove the active lead from its current position
          const [movedLead] = newLeads.splice(activeIndex, 1);
          // Insert it at the new position
          const insertIndex = activeIndex < overIndex ? overIndex - 1 : overIndex;
          newLeads.splice(insertIndex, 0, movedLead);
        }
      }

      return newLeads;
    });
  };

  const activeLead = activeId ? leads.find(lead => lead.id === activeId) : null;

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={[...leads.map(lead => lead.id), ...columns.map(col => col.status)]}>
            <div className="flex space-x-4 min-w-max">
              {columns.map((column) => {
                const columnLeads = getLeadsByStatus(column.status);
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
          </SortableContext>
          
          <DragOverlay>
            <DragOverlayCard lead={activeLead} />
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};