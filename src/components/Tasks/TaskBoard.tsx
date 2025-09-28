import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, CreditCard as Edit, CheckSquare, Users, Calendar, Target } from 'lucide-react';

export const TaskBoard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Task Board (Kanban)</h1>
          <p className="mt-1 text-sm text-slate-400">
            Visual task management with drag-and-drop workflow
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm w-64"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        <div className="text-center py-12">
          <div className="bg-slate-700/30 backdrop-blur-sm rounded-full p-4 mb-4 border border-slate-600/50 inline-block">
            <CheckSquare className="h-16 w-16 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-50 mb-2">Task Board (Kanban)</h3>
          <p className="text-slate-400">Visual task management with drag-and-drop workflow coming soon!</p>
        </div>
      </div>
    </div>
  );
};