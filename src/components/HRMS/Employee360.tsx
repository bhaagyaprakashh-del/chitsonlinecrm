import React, { useState } from 'react';
import { ArrowLeft, CreditCard as Edit, Mail, Phone, Building, Calendar, DollarSign, User, Shield, FileText, Activity } from 'lucide-react';
import { Employee } from '../../types/hrms';

interface Employee360Props {
  employeeId: string;
  onBack: () => void;
}

const sampleEmployee: Employee = {
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
};

export const Employee360: React.FC<Employee360Props> = ({ employeeId, onBack }) => {
  const [employee, setEmployee] = useState<Employee>(() => {
    // Load specific employee from localStorage
    const saved = localStorage.getItem('employees_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const foundEmployee = parsed.find((emp: Employee) => emp.id === employeeId || emp.employeeId === employeeId);
        return foundEmployee || sampleEmployee;
      } catch (error) {
        console.error('Failed to load employee:', error);
        return sampleEmployee;
      }
    }
    return sampleEmployee;
  });
  const [activeTab, setActiveTab] = useState('overview');

  // Listen for employee updates
  React.useEffect(() => {
    const handleEmployeeUpdate = () => {
      const saved = localStorage.getItem('employees_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const foundEmployee = parsed.find((emp: Employee) => emp.id === employeeId || emp.employeeId === employeeId);
          if (foundEmployee) {
            setEmployee(foundEmployee);
          }
        } catch (error) {
          console.error('Failed to reload employee:', error);
        }
      }
    };

    window.addEventListener('storage', handleEmployeeUpdate);
    window.addEventListener('employeesUpdated', handleEmployeeUpdate);
    
    return () => {
      window.removeEventListener('storage', handleEmployeeUpdate);
      window.removeEventListener('employeesUpdated', handleEmployeeUpdate);
    };
  }, [employeeId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'compensation', name: 'Compensation', icon: DollarSign },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'activity', name: 'Activity', icon: Activity }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date of Birth</span>
                  <span className="text-slate-50">{new Date(employee.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gender</span>
                  <span className="text-slate-50 capitalize">{employee.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Marital Status</span>
                  <span className="text-slate-50 capitalize">{employee.maritalStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Blood Group</span>
                  <span className="text-slate-50">{employee.bloodGroup}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Professional Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Employee ID</span>
                  <span className="text-slate-50">{employee.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Designation</span>
                  <span className="text-slate-50">{employee.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department</span>
                  <span className="text-slate-50">{employee.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Branch</span>
                  <span className="text-slate-50">{employee.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reporting Manager</span>
                  <span className="text-slate-50">{employee.reportingManager}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'compensation':
        const grossSalary = employee.basicSalary + 
          employee.allowances.hra + 
          employee.allowances.transport + 
          employee.allowances.medical + 
          employee.allowances.special;
        
        const totalDeductions = employee.deductions.pf + 
          employee.deductions.esi + 
          employee.deductions.tax + 
          employee.deductions.other;
        
        const netSalary = grossSalary - totalDeductions;

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Salary Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Basic Salary</span>
                  <span className="text-slate-50 font-medium">{formatCurrency(employee.basicSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">HRA</span>
                  <span className="text-slate-50">{formatCurrency(employee.allowances.hra)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transport</span>
                  <span className="text-slate-50">{formatCurrency(employee.allowances.transport)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Medical</span>
                  <span className="text-slate-50">{formatCurrency(employee.allowances.medical)}</span>
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
                  <span className="text-slate-50">{formatCurrency(employee.deductions.pf)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ESI</span>
                  <span className="text-slate-50">{formatCurrency(employee.deductions.esi)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax</span>
                  <span className="text-slate-50">{formatCurrency(employee.deductions.tax)}</span>
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
            <div className="h-16 w-16 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-bold text-xl border border-yellow-400/30">
              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-50">{employee.firstName} {employee.lastName}</h1>
              <p className="text-slate-400">{employee.designation} • {employee.department}</p>
              <p className="text-slate-500 text-sm">{employee.employeeId}</p>
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
            Edit Employee
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