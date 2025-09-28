import React, { useState } from 'react';
import { Shield, Plus, Search, CreditCard as Edit3, Trash2, Users, Key, Lock, Check, X } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  status: 'active' | 'inactive';
  isSystem: boolean;
}

export const RolesPermissions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [permissions] = useState<Permission[]>([
    // Dashboard
    { id: 'dashboard.view', name: 'View Dashboard', description: 'Access to main dashboard', module: 'Dashboard' },
    
    // CRM
    { id: 'leads.view', name: 'View Leads', description: 'View all leads and prospects', module: 'CRM' },
    { id: 'leads.create', name: 'Create Leads', description: 'Add new leads to the system', module: 'CRM' },
    { id: 'leads.edit', name: 'Edit Leads', description: 'Modify existing lead information', module: 'CRM' },
    { id: 'leads.delete', name: 'Delete Leads', description: 'Remove leads from the system', module: 'CRM' },
    
    // HRMS
    { id: 'employees.view', name: 'View Employees', description: 'Access employee directory', module: 'HRMS' },
    { id: 'employees.create', name: 'Add Employees', description: 'Add new employees', module: 'HRMS' },
    { id: 'employees.edit', name: 'Edit Employees', description: 'Modify employee information', module: 'HRMS' },
    { id: 'payroll.manage', name: 'Manage Payroll', description: 'Process payroll and generate payslips', module: 'HRMS' },
    
    // Chit Fund
    { id: 'chit.view', name: 'View Chit Groups', description: 'Access chit fund groups', module: 'Chit Fund' },
    { id: 'chit.create', name: 'Create Groups', description: 'Create new chit fund groups', module: 'Chit Fund' },
    { id: 'chit.manage', name: 'Manage Groups', description: 'Manage existing chit groups', module: 'Chit Fund' },
    
    // Reports
    { id: 'reports.view', name: 'View Reports', description: 'Access reporting dashboard', module: 'Reports' },
    { id: 'reports.create', name: 'Create Reports', description: 'Generate custom reports', module: 'Reports' },
    { id: 'reports.export', name: 'Export Reports', description: 'Export reports to various formats', module: 'Reports' },
    
    // Settings
    { id: 'settings.view', name: 'View Settings', description: 'Access system settings', module: 'Settings' },
    { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system configuration', module: 'Settings' },
    { id: 'users.manage', name: 'Manage Users', description: 'Add, edit, and remove users', module: 'Settings' },
    { id: 'roles.manage', name: 'Manage Roles', description: 'Create and modify user roles', module: 'Settings' }
  ]);

  const [roles] = useState<Role[]>([
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      userCount: 2,
      permissions: permissions.map(p => p.id),
      status: 'active',
      isSystem: true
    },
    {
      id: '2',
      name: 'Admin',
      description: 'Administrative access with most permissions',
      userCount: 5,
      permissions: [
        'dashboard.view', 'leads.view', 'leads.create', 'leads.edit',
        'employees.view', 'employees.create', 'employees.edit',
        'chit.view', 'chit.create', 'chit.manage',
        'reports.view', 'reports.create', 'reports.export',
        'settings.view', 'users.manage'
      ],
      status: 'active',
      isSystem: false
    },
    {
      id: '3',
      name: 'Manager',
      description: 'Management level access for operations',
      userCount: 8,
      permissions: [
        'dashboard.view', 'leads.view', 'leads.create', 'leads.edit',
        'employees.view', 'chit.view', 'chit.manage',
        'reports.view', 'reports.create'
      ],
      status: 'active',
      isSystem: false
    },
    {
      id: '4',
      name: 'Employee',
      description: 'Standard employee access',
      userCount: 25,
      permissions: [
        'dashboard.view', 'leads.view', 'leads.create',
        'employees.view', 'chit.view',
        'reports.view'
      ],
      status: 'active',
      isSystem: false
    },
    {
      id: '5',
      name: 'Agent',
      description: 'Field agent with limited access',
      userCount: 15,
      permissions: [
        'dashboard.view', 'leads.view', 'leads.create',
        'chit.view'
      ],
      status: 'active',
      isSystem: false
    },
    {
      id: '6',
      name: 'Viewer',
      description: 'Read-only access to basic information',
      userCount: 3,
      permissions: [
        'dashboard.view', 'leads.view', 'employees.view',
        'chit.view', 'reports.view'
      ],
      status: 'inactive',
      isSystem: false
    }
  ]);

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || role.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getPermissionsByModule = () => {
    const grouped = permissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
    
    return grouped;
  };

  const stats = {
    total: roles.length,
    active: roles.filter(r => r.status === 'active').length,
    inactive: roles.filter(r => r.status === 'inactive').length,
    totalUsers: roles.reduce((sum, r) => sum + r.userCount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Roles & Permissions</h1>
          <p className="text-slate-400 mt-1">Manage user roles and access permissions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Create Role
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Roles</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Shield className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Roles</p>
              <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Permissions</p>
              <p className="text-2xl font-bold text-white">{permissions.length}</p>
            </div>
            <Key className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Roles</h2>
          
          {filteredRoles.map((role) => (
            <div 
              key={role.id} 
              className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-colors cursor-pointer ${
                selectedRole === role.id ? 'ring-2 ring-yellow-500/50' : ''
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      {role.name}
                      {role.isSystem && (
                        <Lock className="h-4 w-4 text-slate-400" title="System Role" />
                      )}
                    </h3>
                    <p className="text-slate-400 text-sm">{role.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${role.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">{role.userCount} users</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Key className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">{role.permissions.length} permissions</span>
                  </div>
                </div>

                {!role.isSystem && (
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Permissions Detail */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            {selectedRole ? `Permissions for ${roles.find(r => r.id === selectedRole)?.name}` : 'Select a role to view permissions'}
          </h2>
          
          {selectedRole ? (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <div className="space-y-6">
                {Object.entries(getPermissionsByModule()).map(([module, modulePermissions]) => (
                  <div key={module}>
                    <h3 className="text-lg font-medium text-white mb-3">{module}</h3>
                    <div className="space-y-2">
                      {modulePermissions.map((permission) => {
                        const hasPermission = roles.find(r => r.id === selectedRole)?.permissions.includes(permission.id);
                        return (
                          <div key={permission.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <div>
                              <p className="text-white text-sm font-medium">{permission.name}</p>
                              <p className="text-slate-400 text-xs">{permission.description}</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              hasPermission ? 'bg-green-500' : 'bg-slate-600'
                            }`}>
                              {hasPermission ? (
                                <Check className="h-4 w-4 text-white" />
                              ) : (
                                <X className="h-4 w-4 text-slate-400" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-12 text-center">
              <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">Select a role from the left to view its permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};