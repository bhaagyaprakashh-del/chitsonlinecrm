import React, { useState, useMemo } from 'react';
import { Plus, Search, CreditCard as Edit, Trash2, Eye, CheckSquare, Clock, Users, Calendar, Flag, Star, Target, Award, TrendingUp, Filter, Download, Settings, MoreVertical, User, Building, AlertTriangle, CheckCircle, XCircle, Activity, MessageSquare, FileText, Phone, Mail, Video, Paperclip } from 'lucide-react';
import { Task } from '../../types/tasks';

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with TechCorp Solutions',
    description: 'Call to discuss premium chit scheme proposal and answer any questions',
    type: 'call',
    priority: 'high',
    status: 'todo',
    assignedTo: 'Priya Sharma',
    assignedBy: 'Rajesh Kumar',
    dueDate: '2024-03-18T10:00:00',
    estimatedHours: 1,
    leadId: 'lead_001',
    tags: ['sales', 'follow-up', 'high-value'],
    attachments: [],
    comments: [],
    subtasks: [
      {
        id: 'sub_1',
        title: 'Prepare call agenda',
        completed: true,
        createdAt: '2024-03-15T09:00:00'
      },
      {
        id: 'sub_2',
        title: 'Review previous meeting notes',
        completed: true,
        createdAt: '2024-03-15T09:00:00'
      },
      {
        id: 'sub_3',
        title: 'Prepare pricing options',
        completed: false,
        dueDate: '2024-03-17T17:00:00',
        createdAt: '2024-03-15T09:00:00'
      }
    ],
    createdAt: '2024-03-15T09:00:00',
    updatedAt: '2024-03-15T14:30:00',
    watchers: ['Rajesh Kumar'],
    collaborators: [],
    progressPercentage: 75
  },
  {
    id: '2',
    title: 'Prepare monthly sales report',
    description: 'Compile sales data and create comprehensive monthly performance report',
    type: 'documentation',
    priority: 'medium',
    status: 'in-progress',
    assignedTo: 'Priya Sharma',
    assignedBy: 'Rajesh Kumar',
    dueDate: '2024-03-20T17:00:00',
    estimatedHours: 4,
    actualHours: 2,
    tags: ['reporting', 'monthly', 'sales'],
    attachments: [
      {
        id: 'att_1',
        name: 'sales-data-march.xlsx',
        url: '/files/sales-data-march.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 245760,
        uploadedBy: 'Priya Sharma',
        uploadedAt: '2024-03-15T11:30:00'
      }
    ],
    comments: [
      {
        id: 'comment_1',
        taskId: '2',
        message: 'Started working on the data compilation. Should have the draft ready by tomorrow.',
        createdBy: 'Priya Sharma',
        createdAt: '2024-03-15T14:00:00',
        isInternal: false,
        mentions: ['Rajesh Kumar']
      }
    ],
    subtasks: [
      {
        id: 'sub_4',
        title: 'Collect sales data from all agents',
        completed: true,
        createdAt: '2024-03-15T10:00:00'
      },
      {
        id: 'sub_5',
        title: 'Analyze conversion rates',
        completed: true,
        createdAt: '2024-03-15T10:00:00'
      },
      {
        id: 'sub_6',
        title: 'Create charts and visualizations',
        completed: false,
        assignedTo: 'Priya Sharma',
        dueDate: '2024-03-19T15:00:00',
        createdAt: '2024-03-15T10:00:00'
      },
      {
        id: 'sub_7',
        title: 'Write executive summary',
        completed: false,
        assignedTo: 'Priya Sharma',
        dueDate: '2024-03-20T12:00:00',
        createdAt: '2024-03-15T10:00:00'
      }
    ],
    createdAt: '2024-03-15T10:00:00',
    updatedAt: '2024-03-15T16:45:00',
    startedAt: '2024-03-15T11:00:00',
    watchers: ['Rajesh Kumar', 'Karthik Nair'],
    collaborators: ['Karthik Nair'],
    progressPercentage: 60
  },
  {
    id: '3',
    title: 'Customer onboarding - Sunita Reddy',
    description: 'Complete KYC verification and scheme enrollment for new customer',
    type: 'other',
    priority: 'medium',
    status: 'review',
    assignedTo: 'Karthik Nair',
    assignedBy: 'Priya Sharma',
    dueDate: '2024-03-19T16:00:00',
    estimatedHours: 2,
    customerId: 'cust_002',
    tags: ['onboarding', 'kyc', 'new-customer'],
    attachments: [
      {
        id: 'att_2',
        name: 'kyc-documents-sunita.pdf',
        url: '/files/kyc-documents-sunita.pdf',
        type: 'application/pdf',
        size: 1024000,
        uploadedBy: 'Karthik Nair',
        uploadedAt: '2024-03-14T15:20:00'
      }
    ],
    comments: [
      {
        id: 'comment_2',
        taskId: '3',
        message: 'KYC documents received and under review. All documents look complete.',
        createdBy: 'Karthik Nair',
        createdAt: '2024-03-14T16:00:00',
        isInternal: true,
        mentions: []
      }
    ],
    subtasks: [
      {
        id: 'sub_8',
        title: 'Verify identity documents',
        completed: true,
        createdAt: '2024-03-14T14:00:00'
      },
      {
        id: 'sub_9',
        title: 'Verify address proof',
        completed: true,
        createdAt: '2024-03-14T14:00:00'
      },
      {
        id: 'sub_10',
        title: 'Complete risk assessment',
        completed: false,
        assignedTo: 'Karthik Nair',
        dueDate: '2024-03-18T17:00:00',
        createdAt: '2024-03-14T14:00:00'
      }
    ],
    createdAt: '2024-03-14T14:00:00',
    updatedAt: '2024-03-15T10:30:00',
    startedAt: '2024-03-14T15:00:00',
    watchers: ['Priya Sharma'],
    collaborators: [],
    progressPercentage: 80
  },
  {
    id: '4',
    title: 'Team training session preparation',
    description: 'Prepare materials and agenda for upcoming CRM training session',
    type: 'meeting',
    priority: 'low',
    status: 'completed',
    assignedTo: 'Rajesh Kumar',
    assignedBy: 'HR Team',
    dueDate: '2024-03-15T12:00:00',
    completedAt: '2024-03-15T11:45:00',
    estimatedHours: 3,
    actualHours: 2.5,
    tags: ['training', 'team', 'crm'],
    attachments: [
      {
        id: 'att_3',
        name: 'training-agenda.docx',
        url: '/files/training-agenda.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 156000,
        uploadedBy: 'Rajesh Kumar',
        uploadedAt: '2024-03-14T10:00:00'
      }
    ],
    comments: [],
    subtasks: [
      {
        id: 'sub_11',
        title: 'Create presentation slides',
        completed: true,
        createdAt: '2024-03-13T09:00:00'
      },
      {
        id: 'sub_12',
        title: 'Prepare handout materials',
        completed: true,
        createdAt: '2024-03-13T09:00:00'
      },
      {
        id: 'sub_13',
        title: 'Book training room',
        completed: true,
        createdAt: '2024-03-13T09:00:00'
      }
    ],
    createdAt: '2024-03-13T09:00:00',
    updatedAt: '2024-03-15T11:45:00',
    startedAt: '2024-03-14T09:00:00',
    watchers: ['HR Team'],
    collaborators: ['Priya Sharma', 'Karthik Nair'],
    progressPercentage: 100
  },
  {
    id: '5',
    title: 'System backup verification',
    description: 'Verify that all daily backups are running correctly and data integrity is maintained',
    type: 'other',
    priority: 'critical',
    status: 'blocked',
    assignedTo: 'IT Team',
    assignedBy: 'Rajesh Kumar',
    dueDate: '2024-03-16T18:00:00',
    estimatedHours: 2,
    tags: ['system', 'backup', 'critical'],
    attachments: [],
    comments: [
      {
        id: 'comment_3',
        taskId: '5',
        message: 'Blocked due to server maintenance window. Will resume after maintenance is complete.',
        createdBy: 'IT Team',
        createdAt: '2024-03-15T13:00:00',
        isInternal: true,
        mentions: ['Rajesh Kumar']
      }
    ],
    subtasks: [],
    createdAt: '2024-03-15T08:00:00',
    updatedAt: '2024-03-15T13:00:00',
    watchers: ['Rajesh Kumar'],
    collaborators: [],
    progressPercentage: 0,
    blockedReason: 'Server maintenance in progress',
    blockedBy: 'IT Team'
  }
];

const TaskCard: React.FC<{ task: Task }> = React.memo(({ task }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'blocked': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Users;
      case 'follow-up': return Clock;
      case 'demo': return Video;
      case 'documentation': return FileText;
      case 'development': return Target;
      case 'review': return Eye;
      default: return CheckSquare;
    }
  };

  const TypeIcon = getTypeIcon(task.type);
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className={`bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30 hover:border-yellow-400/50 transition-all ${
      isOverdue ? 'border-red-500/50' : ''
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} title={`${task.priority} priority`}></div>
          <TypeIcon className="h-4 w-4 text-slate-400" />
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
            {task.status.replace('-', ' ').toUpperCase()}
          </span>
          <button className="p-1 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded transition-all">
            <MoreVertical className="h-3 w-3" />
          </button>
        </div>
      </div>

      <h4 className="text-slate-50 font-medium mb-2 line-clamp-2">{task.title}</h4>
      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{task.description}</p>

      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-slate-300">
          <Calendar className="h-3 w-3 mr-2 text-slate-500" />
          <span className={isOverdue ? 'text-red-400' : ''}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <User className="h-3 w-3 mr-2 text-slate-500" />
          <span>{task.assignedTo}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <Clock className="h-3 w-3 mr-2 text-slate-500" />
          <span>{task.estimatedHours}h estimated</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Progress</span>
          <span>{task.progressPercentage}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2 border border-yellow-400/20">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              task.progressPercentage >= 100 ? 'bg-green-500' :
              task.progressPercentage >= 75 ? 'bg-blue-500' :
              task.progressPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${task.progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Subtasks */}
      {totalSubtasks > 0 && (
        <div className="mb-3 p-2 bg-slate-700/30 rounded-lg border border-yellow-400/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Subtasks</span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="space-y-1">
            {task.subtasks.slice(0, 3).map((subtask) => (
              <div key={subtask.id} className="flex items-center space-x-2">
                <CheckSquare className={`h-3 w-3 ${subtask.completed ? 'text-green-400' : 'text-slate-500'}`} />
                <span className={`text-xs ${subtask.completed ? 'text-slate-300 line-through' : 'text-slate-400'}`}>
                  {subtask.title}
                </span>
              </div>
            ))}
            {totalSubtasks > 3 && (
              <p className="text-xs text-slate-500">+{totalSubtasks - 3} more subtasks</p>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                #{tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-800 border border-slate-200">
                +{task.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Blocked Status */}
      {task.status === 'blocked' && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">Blocked</span>
          </div>
          {task.blockedReason && (
            <p className="text-red-300 text-xs mt-1">{task.blockedReason}</p>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-yellow-400/20">
        <div className="flex items-center space-x-3">
          {task.attachments.length > 0 && (
            <div className="flex items-center text-xs text-slate-500">
              <Paperclip className="h-3 w-3 mr-1" />
              <span>{task.attachments.length}</span>
            </div>
          )}
          {task.comments.length > 0 && (
            <div className="flex items-center text-xs text-slate-500">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{task.comments.length}</span>
            </div>
          )}
          {task.watchers.length > 0 && (
            <div className="flex items-center text-xs text-slate-500">
              <Eye className="h-3 w-3 mr-1" />
              <span>{task.watchers.length}</span>
            </div>
          )}
        </div>
        <div className="flex space-x-1">
          <button className="p-1 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all">
            <Eye className="h-3 w-3" />
          </button>
          <button className="p-1 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all">
            <Edit className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
});

export const MyTasks: React.FC = () => {
  const [tasks] = useState<Task[]>(sampleTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'my-tasks' | 'team-tasks'>('my-tasks');

  const currentUser = 'Priya Sharma'; // This would come from auth context

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by view mode
    if (viewMode === 'my-tasks') {
      filtered = filtered.filter(task => task.assignedTo === currentUser);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Apply assignee filter (for team tasks)
    if (filterAssignee !== 'all' && viewMode === 'team-tasks') {
      filtered = filtered.filter(task => task.assignedTo === filterAssignee);
    }

    return filtered;
  }, [tasks, searchTerm, filterStatus, filterPriority, filterAssignee, viewMode, currentUser]);

  const stats = useMemo(() => {
    const myTasks = tasks.filter(task => task.assignedTo === currentUser);
    const teamTasks = tasks;

    return {
      myTasks: {
        total: myTasks.length,
        todo: myTasks.filter(t => t.status === 'todo').length,
        inProgress: myTasks.filter(t => t.status === 'in-progress').length,
        review: myTasks.filter(t => t.status === 'review').length,
        completed: myTasks.filter(t => t.status === 'completed').length,
        blocked: myTasks.filter(t => t.status === 'blocked').length,
        overdue: myTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
        highPriority: myTasks.filter(t => t.priority === 'high' || t.priority === 'critical').length
      },
      teamTasks: {
        total: teamTasks.length,
        todo: teamTasks.filter(t => t.status === 'todo').length,
        inProgress: teamTasks.filter(t => t.status === 'in-progress').length,
        review: teamTasks.filter(t => t.status === 'review').length,
        completed: teamTasks.filter(t => t.status === 'completed').length,
        blocked: teamTasks.filter(t => t.status === 'blocked').length,
        overdue: teamTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
        highPriority: teamTasks.filter(t => t.priority === 'high' || t.priority === 'critical').length
      }
    };
  }, [tasks, currentUser]);

  const currentStats = viewMode === 'my-tasks' ? stats.myTasks : stats.teamTasks;
  const uniqueAssignees = useMemo(() => [...new Set(tasks.map(t => t.assignedTo))], [tasks]);

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">
            {viewMode === 'my-tasks' ? 'My Tasks' : 'Team Tasks'}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage personal and team task assignments with collaboration tools
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="flex bg-slate-700/50 backdrop-blur-sm rounded-lg p-1 border border-yellow-400/20">
            <button
              onClick={() => setViewMode('my-tasks')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'my-tasks'
                  ? 'bg-blue-500 text-slate-50'
                  : 'text-slate-300 hover:text-slate-50'
              }`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setViewMode('team-tasks')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'team-tasks'
                  ? 'bg-blue-500 text-slate-50'
                  : 'text-slate-300 hover:text-slate-50'
              }`}
            >
              Team Tasks
            </button>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-50">{currentStats.total}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">To Do</p>
                <p className="text-2xl font-bold text-blue-400">{currentStats.todo}</p>
              </div>
              <Flag className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">In Progress</p>
                <p className="text-2xl font-bold text-yellow-400">{currentStats.inProgress}</p>
              </div>
              <Activity className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Review</p>
                <p className="text-2xl font-bold text-purple-400">{currentStats.review}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-green-400">{currentStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Blocked</p>
                <p className="text-2xl font-bold text-orange-400">{currentStats.blocked}</p>
              </div>
              <XCircle className="h-8 w-8 text-orange-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Overdue</p>
                <p className="text-2xl font-bold text-red-400">{currentStats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">High Priority</p>
                <p className="text-2xl font-bold text-red-400">{currentStats.highPriority}</p>
              </div>
              <Star className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tasks..."
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
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            {viewMode === 'team-tasks' && (
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
              >
                <option value="all">All Assignees</option>
                {uniqueAssignees.map(assignee => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>
            )}
            <div className="text-sm text-slate-400">
              Showing: <span className="font-semibold text-slate-50">{filteredTasks.length}</span> tasks
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="h-12 w-12 mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-50 mb-2">No tasks found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search criteria or create a new task.</p>
          </div>
        )}
      </div>
    </div>
  );
};