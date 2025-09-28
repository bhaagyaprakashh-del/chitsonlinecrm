import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Award,
  Target,
  TrendingUp,
  Filter,
  Download,
  Upload,
  MoreVertical,
  User,
  Building,
  CreditCard,
  Shield,
  Flag,
  Zap,
  Crown,
  Briefcase
} from 'lucide-react';
import { Employee } from '../../types/hrms';

const sampleEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@ramnirmalchits.com',
    phone: '+91 98765 43215',
    alternatePhone: '+91 98765 43216',
    dateOfBirth: '1990-05-15',
    gender: 'female',
    maritalStatus: 'single',
    bloodGroup: 'O+',
    address: '123 MG Road, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    postalCode: '560001',
    designation: 'Senior Sales Executive',
    department: 'Sales & Marketing',
    branch: 'Bangalore Main',
    joiningDate: '2021-06-01',
    confirmationDate: '2021-12-01',
    probationPeriod: 6,
    employmentType: 'permanent',
    workLocation: 'office',
    reportingManager: 'Rajesh Kumar',
    teamMembers: [],
    basicSalary: 75000,
    allowances: {
      hra: 22500,
      transport: 5000,
      medical: 2500,
      special: 5000
    },
    deductions: {
      pf: 9000,
      esi: 562,
      tax: 8500,
      other: 0
    },
    bankAccount: {
      accountNumber: '1234567890',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      accountHolderName: 'Priya Sharma'
    },
    documents: {
      resume: '/documents/priya-resume.pdf',
      idProof: '/documents/priya-aadhaar.pdf',
      addressProof: '/documents/priya-utility.pdf',
      educationCertificates: ['/documents/priya-degree.pdf'],
      photo: '/documents/priya-photo.jpg'
    },
    skills: ['Sales', 'Customer Relations', 'Lead Generation', 'CRM'],
    qualifications: [
      {
        degree: 'MBA Marketing',
        institution: 'Bangalore University',
        year: '2020',
        percentage: 85
      },
      {
        degree: 'B.Com',
        institution: 'Christ University',
        year: '2018',
        percentage: 78
      }
    ],
    experience: [
      {
        company: 'Previous Sales Corp',
        designation: 'Sales Executive',
        duration: '2 years',
        responsibilities: 'Lead generation and customer acquisition'
      }
    ],
    status: 'active',
    emergencyContact: {
      name: 'Ramesh Sharma',
      relationship: 'Father',
      phone: '+91 98765 43217'
    },
    createdAt: '2021-06-01',
    createdBy: 'hr@ramnirmalchits.com',
    updatedAt: '2024-03-15',
    updatedBy: 'priya.sharma@ramnirmalchits.com',
    notes: 'Top performing sales executive with excellent customer relationships'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Karthik',
    lastName: 'Nair',
    email: 'karthik.nair@ramnirmalchits.com',
    phone: '+91 98765 43221',
    dateOfBirth: '1988-03-22',
    gender: 'male',
    maritalStatus: 'married',
    bloodGroup: 'A+',
    address: '456 Jayanagar, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    postalCode: '560041',
    designation: 'Chit Fund Manager',
    department: 'Operations',
    branch: 'Bangalore South',
    joiningDate: '2020-08-15',
    confirmationDate: '2021-02-15',
    probationPeriod: 6,
    employmentType: 'permanent',
    workLocation: 'office',
    reportingManager: 'Rajesh Kumar',
    teamMembers: ['3', '4'],
    basicSalary: 85000,
    allowances: {
      hra: 25500,
      transport: 6000,
      medical: 3000,
      special: 7000
    },
    deductions: {
      pf: 10200,
      esi: 637,
      tax: 12000,
      other: 0
    },
    bankAccount: {
      accountNumber: '2345678901',
      bankName: 'SBI',
      ifscCode: 'SBIN0001234',
      accountHolderName: 'Karthik Nair'
    },
    documents: {
      resume: '/documents/karthik-resume.pdf',
      idProof: '/documents/karthik-pan.pdf',
      addressProof: '/documents/karthik-lease.pdf',
      educationCertificates: ['/documents/karthik-mba.pdf'],
      photo: '/documents/karthik-photo.jpg'
    },
    skills: ['Operations Management', 'Chit Fund Operations', 'Team Leadership', 'Customer Service'],
    qualifications: [
      {
        degree: 'MBA Finance',
        institution: 'IIM Bangalore',
        year: '2019',
        percentage: 88
      }
    ],
    experience: [
      {
        company: 'Financial Services Ltd',
        designation: 'Operations Executive',
        duration: '3 years',
        responsibilities: 'Financial operations and customer management'
      }
    ],
    status: 'active',
    emergencyContact: {
      name: 'Meera Nair',
      relationship: 'Spouse',
      phone: '+91 98765 43222'
    },
    createdAt: '2020-08-15',
    createdBy: 'hr@ramnirmalchits.com',
    updatedAt: '2024-03-14',
    updatedBy: 'karthik.nair@ramnirmalchits.com',
    notes: 'Experienced operations manager with strong leadership skills'
  }
];

const EmployeeCard: React.FC<{ employee: Employee }> = React.memo(({ employee }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'terminated': return 'bg-red-100 text-red-800 border-red-200';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'permanent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contract': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'intern': return 'bg-green-100 text-green-800 border-green-200';
      case 'consultant': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTenure = (joiningDate: string) => {
    const joining = new Date(joiningDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joining.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years}y ${months}m`;
    }
    return `${months}m`;
  };

  const grossSalary = employee.basicSalary + 
    employee.allowances.hra + 
    employee.allowances.transport + 
    employee.allowances.medical + 
    employee.allowances.special;

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-semibold text-lg border border-yellow-400/30">
            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-50">{employee.firstName} {employee.lastName}</h3>
            <p className="text-sm text-slate-400">{employee.designation}</p>
            <p className="text-xs text-slate-500">{employee.employeeId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getEmploymentTypeColor(employee.employmentType)}`}>
            {employee.employmentType.toUpperCase()}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
            {employee.status.toUpperCase()}
          </span>
          <button className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-slate-300">
          <Mail className="h-4 w-4 mr-2 text-slate-500" />
          <span className="truncate">{employee.email}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <Phone className="h-4 w-4 mr-2 text-slate-500" />
          <span>{employee.phone}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <Building className="h-4 w-4 mr-2 text-slate-500" />
          <span>{employee.department} • {employee.branch}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <User className="h-4 w-4 mr-2 text-slate-500" />
          <span>Reports to: {employee.reportingManager}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-yellow-400/20">
        <div>
          <p className="text-xs text-slate-500">Basic Salary</p>
          <p className="text-lg font-semibold text-green-400">{formatCurrency(employee.basicSalary)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Gross Salary</p>
          <p className="text-lg font-semibold text-blue-400">{formatCurrency(grossSalary)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Department</p>
          <p className="text-lg font-semibold text-purple-400">{employee.department}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Tenure</p>
          <p className="text-lg font-semibold text-orange-400">{calculateTenure(employee.joiningDate)}</p>
        </div>
      </div>

      {/* Skills Preview */}
      {employee.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-2">Skills:</p>
          <div className="flex flex-wrap gap-1">
            {employee.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                {skill}
              </span>
            ))}
            {employee.skills.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-800 border border-slate-200">
                +{employee.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-yellow-400/20">
        <div className="flex items-center text-xs text-slate-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Joined {new Date(employee.joiningDate).toLocaleDateString()}</span>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

export const EmployeeDirectory: React.FC = () => {
  const [employees] = useState<Employee[]>(sampleEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterEmploymentType, setFilterEmploymentType] = useState<string>('all');

  const filteredEmployees = useMemo(() => employees.filter(employee => {
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesEmploymentType = filterEmploymentType === 'all' || employee.employmentType === filterEmploymentType;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesEmploymentType;
  }), [employees, searchTerm, filterStatus, filterDepartment, filterEmploymentType]);

  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    inactive: employees.filter(e => e.status === 'inactive').length,
    terminated: employees.filter(e => e.status === 'terminated').length,
    onLeave: employees.filter(e => e.status === 'on-leave').length,
    permanent: employees.filter(e => e.employmentType === 'permanent').length,
    contract: employees.filter(e => e.employmentType === 'contract').length,
    intern: employees.filter(e => e.employmentType === 'intern').length,
    consultant: employees.filter(e => e.employmentType === 'consultant').length,
    totalSalary: employees.reduce((sum, e) => sum + e.basicSalary, 0),
    avgSalary: employees.length > 0 ? employees.reduce((sum, e) => sum + e.basicSalary, 0) / employees.length : 0
  }), [employees]);

  const uniqueDepartments = useMemo(() => [...new Set(employees.map(e => e.department))], [employees]);

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
          <h1 className="text-2xl font-bold text-slate-50">Employee Directory</h1>
          <p className="mt-1 text-sm text-slate-400">
            Comprehensive employee management with profiles and organizational structure
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Employees
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-4">
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Employees</p>
                <p className="text-2xl font-bold text-slate-50">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Inactive</p>
                <p className="text-2xl font-bold text-gray-400">{stats.inactive}</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">On Leave</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.onLeave}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Permanent</p>
                <p className="text-2xl font-bold text-blue-400">{stats.permanent}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Contract</p>
                <p className="text-2xl font-bold text-purple-400">{stats.contract}</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Interns</p>
                <p className="text-2xl font-bold text-green-400">{stats.intern}</p>
              </div>
              <Star className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Consultants</p>
                <p className="text-2xl font-bold text-orange-400">{stats.consultant}</p>
              </div>
              <Briefcase className="h-8 w-8 text-orange-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30 md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Salary</p>
                <p className="text-xl font-bold text-emerald-400">{formatCurrency(stats.avgSalary)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-400" />
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
              value={filterEmploymentType}
              onChange={(e) => setFilterEmploymentType(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            >
              <option value="all">All Types</option>
              <option value="permanent">Permanent</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
              <option value="consultant">Consultant</option>
            </select>
            <div className="text-sm text-slate-400">
              Showing: <span className="font-semibold text-slate-50">{filteredEmployees.length}</span> employees
            </div>
          </div>
        </div>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-50 mb-2">No employees found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search criteria or add a new employee.</p>
          </div>
        )}
      </div>
    </div>
  );
};