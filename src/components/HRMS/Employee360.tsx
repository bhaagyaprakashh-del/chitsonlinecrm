import { ArrowLeft, CreditCard as Edit, Save, X, Plus, User, CreditCard, Shield, Phone, MapPin, Mail, Building, Calendar, DollarSign, Users, Star, CheckCircle, XCircle, AlertTriangle, Clock, Award, Target, TrendingUp, Activity, Filter, Download, Upload, MoreVertical, Eye, Trash2, Key, Lock, EyeOff } from 'lucide-react';
import { Employee } from '../../types/hrms';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard as Edit, Mail, Phone, MapPin, Calendar, DollarSign, User, CreditCard, FileText, Clock, Award, Target, TrendingUp, Users, CheckCircle, AlertTriangle, Download, Upload, Star, Briefcase, Shield, Building, Activity, Eye, Send, MessageSquare, Save, X, Key, Lock, EyeOff, Search, Filter, MoreVertical, Trash2, ArrowLeft } from 'lucide-react';
import { getEmployees, saveEmployees, updateEmployee, deleteEmployee, initializeEmployeesData } from '../../data/employees.mock';
import { getBranches } from '../../data/branches.mock';
import { UserCategory } from '../../data/users.mock';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Employee360Props {
  employeeId: string;
  onBack: () => void;
}

const EmployeeTable: React.FC<{ 
  employees: Employee[]; 
  onEmployeeSelect: (employeeId: string) => void;
  selectedEmployeeId?: string;
}> = ({ employees, onEmployeeSelect, selectedEmployeeId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterBranch, setFilterBranch] = useState<string>('all');

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesBranch = filterBranch === 'all' || employee.branch === filterBranch;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesBranch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const uniqueDepartments = [...new Set(employees.map(e => e.department).filter(Boolean))];
  const uniqueBranches = [...new Set(employees.map(e => e.branch).filter(Boolean))];

  const handleCall = (employee: Employee) => {
    if (navigator.userAgent.match(/Mobile|Android|iPhone|iPad/)) {
      window.location.href = `tel:${employee.phone}`;
    } else {
      navigator.clipboard.writeText(employee.phone).then(() => {
        toast.success(`Phone number ${employee.phone} copied to clipboard`);
      }).catch(() => {
        toast.error('Could not copy phone number');
      });
    }
    toast.success(`Call initiated to ${employee.firstName} ${employee.lastName}`);
  };

  const handleEmail = (employee: Employee) => {
    const subject = encodeURIComponent(`Follow-up: ${employee.firstName} ${employee.lastName} - HR Communication`);
    const body = encodeURIComponent(`Dear ${employee.firstName},

I hope this email finds you well.

Best regards,
HR Team
Ramnirmalchits Financial Services`);
    
    const mailtoLink = `mailto:${employee.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    toast.success(`Email client opened for ${employee.firstName} ${employee.lastName}`);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search employees..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
            <option value="on-leave">On Leave</option>
          </select>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
          >
            <option value="all">All Departments</option>
            {uniqueDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
          >
            <option value="all">All Branches</option>
            {uniqueBranches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          <div className="text-sm text-slate-400 flex items-center">
            Showing: <span className="font-semibold ml-1 text-slate-50">{filteredEmployees.length}</span> employees
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-yellow-400/30 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-yellow-400/20 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yellow-400/20">
              {filteredEmployees.map((employee) => (
                <tr 
                  key={employee.id} 
                  className={`hover:bg-slate-700/20 transition-colors cursor-pointer ${
                    selectedEmployeeId === employee.id ? 'bg-blue-500/10 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => onEmployeeSelect(employee.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-medium border border-yellow-400/30">
                        {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-50">{employee.firstName} {employee.lastName}</p>
                        <p className="text-xs text-slate-400">{employee.employeeId} • {employee.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-slate-50">{employee.department}</p>
                      <p className="text-xs text-slate-400">{employee.employmentType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-slate-300">{employee.email}</p>
                      <p className="text-xs text-slate-400">{employee.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-slate-50">{employee.branch}</p>
                      <p className="text-xs text-slate-400">Reports to: {employee.reportingManager || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-semibold text-green-400">{formatCurrency(employee.basicSalary)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEmployeeSelect(employee.id);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(employee);
                        }}
                        className="text-green-400 hover:text-green-300"
                        title="Call Employee"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmail(employee);
                        }}
                        className="text-purple-400 hover:text-purple-300"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-50 mb-2">No employees found</h3>
          <p className="text-sm text-slate-400">Try adjusting your search criteria or add a new employee.</p>
        </div>
      )}
    </div>
  );
};

interface UserCredentials {
  username: string;
  password: string;
  confirmPassword: string;
  role: UserCategory;
  permissions: string[];
  isActive: boolean;
}

const EditEmployeeForm: React.FC<{
  employee: Employee;
  onSave: (updatedEmployee: Employee) => void;
  onCancel: () => void;
}> = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Employee>({ ...employee });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showUserCredentials, setShowUserCredentials] = useState(false);
  const [userCredentials, setUserCredentials] = useState<UserCredentials>(() => {
    // Load existing user credentials if they exist
    const users = JSON.parse(localStorage.getItem('users_data') || '[]');
    const existingUser = users.find((user: any) => user.employeeId === employee.employeeId);
    
    return {
      username: existingUser?.username || `${employee.firstName.toLowerCase()}.${employee.lastName.toLowerCase()}`,
      password: '',
      confirmPassword: '',
      role: (existingUser?.category as UserCategory) || 'Employees',
      permissions: existingUser?.permissions || [],
      isActive: existingUser?.status === 'Active'
    };
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const branches = getBranches().filter(b => b.status === 'active');
  const departments = [
    'Executive', 'Operations', 'Sales & Marketing', 'Finance & Accounts', 
    'Human Resources', 'Information Technology', 'Customer Service'
  ];
  const managers = [
    'Prakashh Admin', 'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Reddy'
  ];

  const rolePermissions = {
    'Admin': ['dashboard.view', 'employees.view', 'employees.create', 'employees.edit', 'reports.view', 'settings.view'],
    'Employees': ['dashboard.view', 'employees.view', 'reports.view'],
    'Agents': ['dashboard.view', 'leads.view', 'leads.create'],
    'Subscribers': ['dashboard.view', 'profile.view']
  };
  const handleInputChange = (field: keyof Employee, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof Employee],
        [field]: value
      }
    }));
  };

  const handleUserCredentialsChange = (field: keyof UserCredentials, value: any) => {
    setUserCredentials(prev => ({ ...prev, [field]: value }));
    
    // Auto-update permissions when role changes
    if (field === 'role') {
      setUserCredentials(prev => ({
        ...prev,
        permissions: rolePermissions[value as UserCategory] || []
      }));
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUserCredentials(prev => ({ ...prev, password, confirmPassword: password }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
    if (!formData.designation?.trim()) newErrors.designation = 'Designation is required';
    if (!formData.department?.trim()) newErrors.department = 'Department is required';
    if (!formData.branch?.trim()) newErrors.branch = 'Branch is required';
    if (!formData.basicSalary || formData.basicSalary <= 0) newErrors.basicSalary = 'Basic salary is required';

    // Validate user credentials if section is shown
    if (showUserCredentials) {
      if (!userCredentials.username.trim()) newErrors.username = 'Username is required';
      if (!userCredentials.password.trim()) newErrors.password = 'Password is required';
      if (userCredentials.password !== userCredentials.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);
    
    try {
      const updatedEmployee = {
        ...formData,
        updatedAt: new Date().toISOString(),
        updatedBy: 'current-user@ramnirmalchits.com'
      };
      
      // Update user credentials if modified
      if (showUserCredentials) {
        const users = JSON.parse(localStorage.getItem('users_data') || '[]');
        const existingUserIndex = users.findIndex((user: any) => user.employeeId === employee.employeeId);
        
        const userData = {
          id: existingUserIndex >= 0 ? users[existingUserIndex].id : `user_${Date.now()}`,
          name: `${updatedEmployee.firstName} ${updatedEmployee.lastName}`,
          email: updatedEmployee.email,
          phone: updatedEmployee.phone,
          category: userCredentials.role,
          role: updatedEmployee.designation,
          status: userCredentials.isActive ? 'Active' : 'Inactive',
          department: updatedEmployee.department,
          branch: updatedEmployee.branch,
          joiningDate: updatedEmployee.joiningDate,
          lastLogin: existingUserIndex >= 0 ? users[existingUserIndex].lastLogin : null,
          username: userCredentials.username,
          password: userCredentials.password,
          permissions: userCredentials.permissions,
          employeeId: updatedEmployee.employeeId
        };
        
        if (existingUserIndex >= 0) {
          users[existingUserIndex] = userData;
        } else {
          users.push(userData);
        }
        
        localStorage.setItem('users_data', JSON.stringify(users));
        window.dispatchEvent(new CustomEvent('usersUpdated'));
      }
      
      onSave(updatedEmployee);
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-50">Edit Employee Details</h3>
        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                errors.firstName ? 'border-red-500' : 'border-yellow-400/30'
              }`}
              disabled={isSaving}
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                errors.lastName ? 'border-red-500' : 'border-yellow-400/30'
              }`}
              disabled={isSaving}
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                errors.email ? 'border-red-500' : 'border-yellow-400/30'
              }`}
              disabled={isSaving}
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Phone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                errors.phone ? 'border-red-500' : 'border-yellow-400/30'
              }`}
              disabled={isSaving}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Designation *</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                errors.designation ? 'border-red-500' : 'border-yellow-400/30'
              }`}
              disabled={isSaving}
            />
            {errors.designation && <p className="mt-1 text-sm text-red-400">{errors.designation}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Department *</label>
            <select
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                errors.department ? 'border-red-500' : 'border-yellow-400/30'
              }`}
              disabled={isSaving}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <p className="mt-1 text-sm text-red-400">{errors.department}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Branch *</label>
            <select
              value={formData.branch}
              onChange={(e) => handleInputChange('branch', e.target.value)}
              className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                errors.branch ? 'border-red-500' : 'border-yellow-400/30'
              }`}
              disabled={isSaving}
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.name}>
                  {branch.name} - {branch.city}
                </option>
              ))}
            </select>
            {errors.branch && <p className="mt-1 text-sm text-red-400">{errors.branch}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Reporting Manager</label>
            <select
              value={formData.reportingManager || ''}
              onChange={(e) => handleInputChange('reportingManager', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              disabled={isSaving}
            >
              <option value="">Select Manager</option>
              {managers.map(manager => (
                <option key={manager} value={manager}>{manager}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Basic Salary (₹) *</label>
            <input
              type="number"
              value={formData.basicSalary}
              onChange={(e) => handleInputChange('basicSalary', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                errors.basicSalary ? 'border-red-500' : 'border-yellow-400/30'
              }`}
              disabled={isSaving}
            />
            {errors.basicSalary && <p className="mt-1 text-sm text-red-400">{errors.basicSalary}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">HRA (₹)</label>
            <input
              type="number"
              value={formData.allowances?.hra || 0}
              onChange={(e) => handleNestedChange('allowances', 'hra', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Transport Allowance (₹)</label>
            <input
              type="number"
              value={formData.allowances?.transport || 0}
              onChange={(e) => handleNestedChange('allowances', 'transport', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Employment Type</label>
            <select
              value={formData.employmentType}
              onChange={(e) => handleInputChange('employmentType', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              disabled={isSaving}
            >
              <option value="permanent">Permanent</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
              <option value="consultant">Consultant</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              disabled={isSaving}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>

        {/* User Credentials Section */}
        <div className="border-t border-yellow-400/30 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-slate-50 flex items-center">
              <Key className="h-5 w-5 mr-2" />
              User Account Credentials
            </h4>
            <button
              type="button"
              onClick={() => setShowUserCredentials(!showUserCredentials)}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {showUserCredentials ? 'Hide' : 'Edit'} Credentials
            </button>
          </div>
          
          {showUserCredentials && (
            <div className="space-y-4 p-4 bg-slate-700/30 rounded-xl border border-yellow-400/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">Username *</label>
                  <input
                    type="text"
                    value={userCredentials.username}
                    onChange={(e) => handleUserCredentialsChange('username', e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                      errors.username ? 'border-red-500' : 'border-yellow-400/30'
                    }`}
                    disabled={isSaving}
                  />
                  {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">User Role</label>
                  <select
                    value={userCredentials.role}
                    onChange={(e) => handleUserCredentialsChange('role', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    disabled={isSaving}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Employees">Employee</option>
                    <option value="Agents">Agent</option>
                    <option value="Subscribers">Subscriber</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">New Password</label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={userCredentials.password}
                        onChange={(e) => handleUserCredentialsChange('password', e.target.value)}
                        className={`w-full px-3 py-2 pr-10 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                          errors.password ? 'border-red-500' : 'border-yellow-400/30'
                        }`}
                        placeholder="Leave empty to keep current"
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      disabled={isSaving}
                    >
                      Generate
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={userCredentials.confirmPassword}
                      onChange={(e) => handleUserCredentialsChange('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                        errors.confirmPassword ? 'border-red-500' : 'border-yellow-400/30'
                      }`}
                      placeholder="Confirm new password"
                      disabled={isSaving}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userCredentials.isActive}
                    onChange={(e) => handleUserCredentialsChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isSaving}
                  />
                  <span className="ml-2 text-slate-50">Account Active</span>
                </label>
              </div>

              {/* Permissions Preview */}
              <div className="p-4 bg-slate-800/50 rounded-lg border border-yellow-400/20">
                <h5 className="text-sm font-medium text-slate-50 mb-2">Assigned Permissions</h5>
                <div className="flex flex-wrap gap-2">
                  {userCredentials.permissions.map((permission, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                      {permission.replace('.', ' ').replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-50 mb-2">Address</label>
          <textarea
            rows={3}
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
            disabled={isSaving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-50 mb-2">Notes</label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
            disabled={isSaving}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-yellow-400/30">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50 backdrop-blur-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export const Employee360: React.FC<Employee360Props> = ({ employeeId, onBack }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actualEmployeeId = searchParams.get('id') || employeeId;
  const shouldEdit = searchParams.get('edit') === 'true';
  
  const [employees, setEmployees] = useState<Employee[]>(() => {
    console.log('Employee360: Initial load from localStorage...');
    initializeEmployeesData();
    const loadedEmployees = getEmployees();
    console.log('Employee360: Initial employees loaded:', loadedEmployees.length);
    console.log('Employee360: Employee names:', loadedEmployees.map(e => `${e.firstName} ${e.lastName}`));
    return loadedEmployees;
  });
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(actualEmployeeId);
  const [activeTab, setActiveTab] = useState('table');
  const [isEditing, setIsEditing] = useState(shouldEdit);

  // Load employees data on component mount
  React.useEffect(() => {
    console.log('Employee360: Loading employees data...');
    initializeEmployeesData();
    const loadedEmployees = getEmployees();
    console.log('Employee360: useEffect - Loading employees...');
    console.log('Employee360: useEffect - Loaded employees:', loadedEmployees.length);
    console.log('Employee360: useEffect - Employee names:', loadedEmployees.map(e => `${e.firstName} ${e.lastName}`));
    setEmployees(loadedEmployees);
    
    // Find the specific employee or use the first one
    const foundEmployee = loadedEmployees.find(e => e.id === actualEmployeeId || e.employeeId === actualEmployeeId);
    if (foundEmployee) {
      setSelectedEmployee(foundEmployee);
        console.log('Employee360: Found employee from URL:', `${foundEmployee.firstName} ${foundEmployee.lastName}`);
      setSelectedEmployeeId(foundEmployee.id);
      if (actualEmployeeId && !shouldEdit) {
        setActiveTab('overview');
      }
    } else if (loadedEmployees.length > 0) {
      const firstEmployee = loadedEmployees[0];
      setSelectedEmployee(firstEmployee);
      setSelectedEmployeeId(firstEmployee.id);
    }
  }, [actualEmployeeId]);

  // Listen for storage changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      console.log('Employee360: Storage changed, reloading employees...');
      const updatedEmployees = getEmployees();
      console.log('Employee360: Storage update - employees count:', updatedEmployees.length);
      console.log('Employee360: Storage update - employee names:', updatedEmployees.map(e => `${e.firstName} ${e.lastName}`));
      setEmployees(updatedEmployees);
      
      if (selectedEmployeeId) {
        const updatedEmployee = updatedEmployees.find(e => e.id === selectedEmployeeId);
        if (updatedEmployee) {
          console.log('Employee360: Updated selected employee:', `${updatedEmployee.firstName} ${updatedEmployee.lastName}`);
          setSelectedEmployee(updatedEmployee);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('employeesUpdated', handleStorageChange);
    window.addEventListener('employeeDataChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('employeesUpdated', handleStorageChange);
      window.removeEventListener('employeeDataChanged', handleStorageChange);
    };
  }, [selectedEmployeeId]);

  const handleEmployeeSelect = (newEmployeeId: string) => {
    const employee = employees.find(e => e.id === newEmployeeId);
    if (employee) {
      console.log('Employee360: Selecting employee:', `${employee.firstName} ${employee.lastName}`);
      setSelectedEmployee(employee);
      setSelectedEmployeeId(newEmployeeId);
      setActiveTab('overview');
      setIsEditing(false);
    }
  };

  const handleEditEmployee = () => {
    setIsEditing(true);
  };

  const handleSaveEmployee = (updatedEmployee: Employee) => {
    try {
      // Update employees using the centralized function
      const allEmployees = getEmployees();
      const updatedEmployees = allEmployees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      );
      saveEmployees(updatedEmployees);
      
      // Update local state
      setEmployees(updatedEmployees);
      setSelectedEmployee(updatedEmployee);
      setIsEditing(false);
      
      toast.success('Employee updated successfully!');
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleCallEmployee = (employee: Employee) => {
    if (navigator.userAgent.match(/Mobile|Android|iPhone|iPad/)) {
      window.location.href = `tel:${employee.phone}`;
    } else {
      navigator.clipboard.writeText(employee.phone).then(() => {
        toast.success(`Phone number ${employee.phone} copied to clipboard`);
      }).catch(() => {
        toast.error('Could not copy phone number');
      });
    }
    toast.success(`Call initiated to ${employee.firstName} ${employee.lastName}`);
  };

  const handleEmailEmployee = (employee: Employee) => {
    const subject = encodeURIComponent(`Follow-up: ${employee.firstName} ${employee.lastName} - HR Communication`);
    const body = encodeURIComponent(`Dear ${employee.firstName},

I hope this email finds you well.

Best regards,
HR Team
Ramnirmalchits Financial Services`);
    
    const mailtoLink = `mailto:${employee.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    toast.success(`Email client opened for ${employee.firstName} ${employee.lastName}`);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        // Update employees using the centralized function
        const allEmployees = getEmployees();
        const updatedEmployees = allEmployees.filter(emp => emp.id !== employee.id);
        saveEmployees(updatedEmployees);
        
        // Update local state
        setEmployees(updatedEmployees);
        
        // If deleted employee was selected, clear selection
        if (selectedEmployeeId === employee.id) {
          setSelectedEmployee(null);
          setSelectedEmployeeId('');
          setActiveTab('table');
        }
        
        // Also remove associated user account
        const users = JSON.parse(localStorage.getItem('users_data') || '[]');
        const updatedUsers = users.filter((user: any) => user.employeeId !== employee.employeeId);
        localStorage.setItem('users_data', JSON.stringify(updatedUsers));
        window.dispatchEvent(new CustomEvent('usersUpdated'));
        
        toast.success(`${employee.firstName} ${employee.lastName} deleted successfully`);
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee. Please try again.');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'table', name: 'Employee Directory', icon: Users },
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'compensation', name: 'Compensation', icon: DollarSign },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'activity', name: 'Activity', icon: Activity }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'table':
        return (
          <EmployeeTable 
            employees={employees} 
            onEmployeeSelect={handleEmployeeSelect}
            selectedEmployeeId={selectedEmployeeId}
          />
        );
      case 'overview':
        if (!selectedEmployee) {
          return (
            <div className="text-center py-12">
              <User className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-50 mb-2">No Employee Selected</h3>
              <p className="text-sm text-slate-400">Select an employee from the table to view details.</p>
            </div>
          );
        }

        if (isEditing) {
          return (
            <EditEmployeeForm
              employee={selectedEmployee}
              onSave={handleSaveEmployee}
              onCancel={handleCancelEdit}
            />
          );
        }

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date of Birth</span>
                  <span className="text-slate-50">{new Date(selectedEmployee.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gender</span>
                  <span className="text-slate-50 capitalize">{selectedEmployee.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Marital Status</span>
                  <span className="text-slate-50 capitalize">{selectedEmployee.maritalStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Blood Group</span>
                  <span className="text-slate-50">{selectedEmployee.bloodGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Address</span>
                  <span className="text-slate-50">{selectedEmployee.address}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Professional Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Employee ID</span>
                  <span className="text-slate-50">{selectedEmployee.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Designation</span>
                  <span className="text-slate-50">{selectedEmployee.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department</span>
                  <span className="text-slate-50">{selectedEmployee.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Branch</span>
                  <span className="text-slate-50">{selectedEmployee.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reporting Manager</span>
                  <span className="text-slate-50">{selectedEmployee.reportingManager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Employment Type</span>
                  <span className="text-slate-50 capitalize">{selectedEmployee.employmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Work Location</span>
                  <span className="text-slate-50 capitalize">{selectedEmployee.workLocation}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">{selectedEmployee.phone}</span>
                </div>
                {selectedEmployee.alternatePhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-50">{selectedEmployee.alternatePhone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">Joined: {new Date(selectedEmployee.joiningDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Emergency Contact</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name</span>
                  <span className="text-slate-50">{selectedEmployee.emergencyContact.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Relationship</span>
                  <span className="text-slate-50 capitalize">{selectedEmployee.emergencyContact.relationship}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone</span>
                  <span className="text-slate-50">{selectedEmployee.emergencyContact.phone}</span>
                </div>
              </div>
            </div>

            {/* Skills & Qualifications */}
            {selectedEmployee.skills.length > 0 && (
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30 lg:col-span-2">
                <h3 className="text-lg font-semibold text-slate-50 mb-4">Skills & Qualifications</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-50 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {selectedEmployee.qualifications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-50 mb-2">Education</h4>
                      <div className="space-y-2">
                        {selectedEmployee.qualifications.map((qual, index) => (
                          <div key={index} className="p-3 bg-slate-700/30 rounded-lg border border-yellow-400/20">
                            <p className="text-slate-50 font-medium">{qual.degree}</p>
                            <p className="text-slate-400 text-sm">{qual.institution} • {qual.year}</p>
                            {qual.percentage && (
                              <p className="text-slate-300 text-sm">Score: {qual.percentage}%</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'compensation':
        if (!selectedEmployee) {
          return (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-50 mb-2">No Employee Selected</h3>
              <p className="text-sm text-slate-400">Select an employee from the table to view compensation details.</p>
            </div>
          );
        }

        const grossSalary = selectedEmployee.basicSalary + 
          selectedEmployee.allowances.hra + 
          selectedEmployee.allowances.transport + 
          selectedEmployee.allowances.medical + 
          selectedEmployee.allowances.special;
        
        const totalDeductions = selectedEmployee.deductions.pf + 
          selectedEmployee.deductions.esi + 
          selectedEmployee.deductions.tax + 
          selectedEmployee.deductions.other;
        
        const netSalary = grossSalary - totalDeductions;

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Salary Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Basic Salary</span>
                  <span className="text-slate-50 font-medium">{formatCurrency(selectedEmployee.basicSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">HRA</span>
                  <span className="text-slate-50">{formatCurrency(selectedEmployee.allowances.hra)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transport</span>
                  <span className="text-slate-50">{formatCurrency(selectedEmployee.allowances.transport)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Medical</span>
                  <span className="text-slate-50">{formatCurrency(selectedEmployee.allowances.medical)}</span>
                </div>
                <div className="flex justify-between border-t border-yellow-400/20 pt-3">
                  <span className="text-slate-400 font-medium">Gross Salary</span>
                  <span className="text-green-400 font-semibold">{formatCurrency(grossSalary)}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Deductions</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">PF</span>
                  <span className="text-slate-50">{formatCurrency(selectedEmployee.deductions.pf)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ESI</span>
                  <span className="text-slate-50">{formatCurrency(selectedEmployee.deductions.esi)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax</span>
                  <span className="text-slate-50">{formatCurrency(selectedEmployee.deductions.tax)}</span>
                </div>
                <div className="flex justify-between border-t border-yellow-400/20 pt-3">
                  <span className="text-slate-400 font-medium">Net Salary</span>
                  <span className="text-blue-400 font-semibold">{formatCurrency(netSalary)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="bg-slate-700/30 backdrop-blur-sm rounded-full p-4 mb-4 border border-slate-600/50 inline-block">
              <FileText className="h-16 w-16 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-50 mb-2">{tabs.find(t => t.id === activeTab)?.name}</h3>
            <p className="text-slate-400">This section is coming soon!</p>
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
            {selectedEmployee && (
              <>
                <div className="h-16 w-16 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-bold text-xl border border-yellow-400/30">
                  {selectedEmployee.firstName.charAt(0)}{selectedEmployee.lastName.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-50">{selectedEmployee.firstName} {selectedEmployee.lastName}</h1>
                  <p className="text-slate-400">{selectedEmployee.designation} • {selectedEmployee.department}</p>
                  <p className="text-slate-500 text-sm">{selectedEmployee.employeeId}</p>
                </div>
              </>
            )}
            {!selectedEmployee && activeTab === 'table' && (
              <div>
                <h1 className="text-2xl font-bold text-slate-50">Employee Directory</h1>
                <p className="text-slate-400">Select an employee to view details • Total: {employees.length} employees</p>
              </div>
            )}
          </div>
        </div>
        {selectedEmployee && (
          <div className="flex space-x-3">
            <button 
              onClick={() => handleCallEmployee(selectedEmployee)}
              className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </button>
            <button 
              onClick={() => handleEmailEmployee(selectedEmployee)}
              className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </button>
            <button 
              onClick={() => handleDeleteEmployee(selectedEmployee)}
              className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
            {isEditing ? (
              <button 
                onClick={handleCancelEdit}
                className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel Edit
              </button>
            ) : (
              <button 
                onClick={handleEditEmployee}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Employee
              </button>
            )}
          </div>
        )}
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
                {tab.id === 'table' && (
                  <span className="ml-2 bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full text-xs">
                    {employees.length}
                  </span>
                )}
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