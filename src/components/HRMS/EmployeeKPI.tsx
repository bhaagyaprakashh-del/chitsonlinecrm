import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, CreditCard as Edit, Trash2, Eye, Target, TrendingUp, DollarSign, Users, CheckSquare, Calendar, Award, AlertTriangle, Star, Activity, BarChart3, PieChart, Filter, Download, Upload, Settings, MoreVertical, User, Building, Clock, CheckCircle, XCircle, Flag, Zap, Crown, Save, X, RefreshCw } from 'lucide-react';
import { EmployeeKPI, KPITarget, KPIAchievement } from '../../types/kpi';
import { getEmployeeKPIs, saveEmployeeKPIs, updateKPIAchievement, initializeKPIData } from '../../data/kpi.mock';
import { getEmployees, initializeEmployeesData } from '../../data/employees.mock';
import { Employee } from '../../types/hrms';
import toast from 'react-hot-toast';

interface CreateKPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (kpiData: any) => void;
  editingKPI?: EmployeeKPI | null;
  employees: Employee[];
}

interface UpdateAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  kpi: EmployeeKPI | null;
  targetType: string;
}

const UpdateAchievementModal: React.FC<UpdateAchievementModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  kpi, 
  targetType 
}) => {
  const [formData, setFormData] = useState({
    value: 0,
    description: ''
  });

  const target = kpi?.targets.find(t => t.type === targetType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value || !formData.description.trim()) {
      toast.error('Please enter value and description');
      return;
    }
    onSave(formData);
    setFormData({ value: 0, description: '' });
  };

  if (!isOpen || !kpi || !target) return null;

  const getTargetLabel = (type: string) => {
    switch (type) {
      case 'leads': return 'Leads Generated';
      case 'tasks': return 'Tasks Completed';
      case 'business': return 'Business Value (₹)';
      case 'collection': return 'Collection Amount (₹)';
      case 'group_filling': return 'Group Tickets Filled';
      default: return 'Achievement';
    }
  };

  const getUnit = (type: string) => {
    switch (type) {
      case 'business':
      case 'collection':
        return '₹';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-50">Update Achievement</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-slate-700/30 rounded-lg border border-yellow-400/20">
          <h4 className="text-slate-50 font-medium">{target.name}</h4>
          <p className="text-slate-400 text-sm">{kpi.employeeName}</p>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Target:</span>
              <span className="text-slate-50 ml-1">{getUnit(targetType)}{target.targetValue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400">Current:</span>
              <span className="text-slate-50 ml-1">{getUnit(targetType)}{target.achievedValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">
              {getTargetLabel(targetType)}
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              placeholder={`Enter ${targetType === 'business' || targetType === 'collection' ? 'amount' : 'count'}`}
              min="0"
              step={targetType === 'business' || targetType === 'collection' ? '1000' : '1'}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              placeholder="Describe the achievement..."
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 transition-all"
            >
              <Save className="h-4 w-4 mr-2" />
              Update Achievement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateKPIModal: React.FC<CreateKPIModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingKPI, 
  employees 
}) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    period: new Date().toISOString().slice(0, 7), // YYYY-MM
    targets: [
      {
        type: 'leads',
        name: 'Monthly Lead Generation',
        description: 'Generate new leads for chit fund schemes',
        targetValue: 0,
        incentiveAmount: 0
      },
      {
        type: 'tasks',
        name: 'Task Completion',
        description: 'Complete assigned tasks on time',
        targetValue: 0,
        incentiveAmount: 0
      },
      {
        type: 'business',
        name: 'Lead Conversion Value',
        description: 'Convert leads to subscribers with minimum value',
        targetValue: 0,
        incentiveAmount: 0
      },
      {
        type: 'collection',
        name: 'Payment Collection',
        description: 'Collect payments from assigned customers',
        targetValue: 0,
        incentiveAmount: 0
      },
      {
        type: 'group_filling',
        name: 'Group Ticket Filling',
        description: 'Fill vacant tickets in assigned chit groups',
        targetValue: 0,
        incentiveAmount: 0
      }
    ],
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (editingKPI) {
      const employee = employees.find(e => e.id === editingKPI.employeeId);
      setFormData({
        employeeId: editingKPI.employeeId,
        period: editingKPI.period,
        targets: editingKPI.targets.map(t => ({
          type: t.type,
          name: t.name,
          description: t.description,
          targetValue: t.targetValue,
          incentiveAmount: t.incentiveAmount
        })),
        notes: editingKPI.notes || ''
      });
    }
  }, [editingKPI, employees]);

  const handleTargetChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      targets: prev.targets.map((target, i) => 
        i === index ? { ...target, [field]: value } : target
      )
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId) newErrors.employeeId = 'Please select an employee';
    if (!formData.period) newErrors.period = 'Please select a period';
    
    const hasValidTargets = formData.targets.some(t => t.targetValue > 0);
    if (!hasValidTargets) newErrors.targets = 'Please set at least one target';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const employee = employees.find(e => e.id === formData.employeeId);
    if (!employee) return;

    const kpiData: EmployeeKPI = {
      id: editingKPI?.id || `kpi_${Date.now()}`,
      employeeId: formData.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: employee.department,
      branch: employee.branch,
      period: formData.period,
      targets: formData.targets
        .filter(t => t.targetValue > 0)
        .map((t, index) => ({
          id: `target_${formData.employeeId}_${index + 1}`,
          type: t.type as any,
          name: t.name,
          description: t.description,
          targetValue: t.targetValue,
          unit: (t.type === 'business' || t.type === 'collection') ? 'amount' : 'count',
          incentiveAmount: t.incentiveAmount,
          achievedValue: 0,
          achievementPercentage: 0,
          incentiveEarned: 0,
          status: 'pending',
          deadline: `${formData.period}-31`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })),
      achievements: [],
      overallPerformance: 0,
      totalIncentive: 0,
      status: 'active',
      createdAt: editingKPI?.createdAt || new Date().toISOString(),
      createdBy: editingKPI?.createdBy || 'admin@ramnirmalchits.com',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin@ramnirmalchits.com',
      notes: formData.notes
    };

    onSave(kpiData);
  };

  if (!isOpen) return null;

  const selectedEmployee = employees.find(e => e.id === formData.employeeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-50">
            {editingKPI ? 'Edit Employee KPI' : 'Create Employee KPI'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Employee *</label>
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.employeeId ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                disabled={!!editingKPI}
              >
                <option value="">Select Employee</option>
                {employees.filter(e => e.status === 'active').map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName} - {employee.designation}
                  </option>
                ))}
              </select>
              {errors.employeeId && <p className="mt-1 text-sm text-red-400">{errors.employeeId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Period *</label>
              <input
                type="month"
                value={formData.period}
                onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.period ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                disabled={!!editingKPI}
              />
              {errors.period && <p className="mt-1 text-sm text-red-400">{errors.period}</p>}
            </div>
          </div>

          {selectedEmployee && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Employee Information</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>Name: <span className="font-semibold">{selectedEmployee.firstName} {selectedEmployee.lastName}</span></p>
                <p>Department: <span className="font-semibold">{selectedEmployee.department}</span></p>
                <p>Branch: <span className="font-semibold">{selectedEmployee.branch}</span></p>
                <p>Designation: <span className="font-semibold">{selectedEmployee.designation}</span></p>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold text-slate-50 mb-4">KPI Targets & Incentives</h4>
            <div className="space-y-4">
              {formData.targets.map((target, index) => (
                <div key={index} className="bg-slate-700/30 rounded-xl p-4 border border-yellow-400/20">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-50 mb-2">
                        {target.type === 'leads' ? '🎯 Leads Target' :
                         target.type === 'tasks' ? '✅ Tasks Target' :
                         target.type === 'business' ? '💼 Business Target' :
                         target.type === 'collection' ? '💰 Collection Target' :
                         '👥 Group Filling Target'}
                      </label>
                      <input
                        type="text"
                        value={target.name}
                        onChange={(e) => handleTargetChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                        placeholder="Target name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-50 mb-2">
                        Target Value {target.type === 'business' || target.type === 'collection' ? '(₹)' : '(Count)'}
                      </label>
                      <input
                        type="number"
                        value={target.targetValue}
                        onChange={(e) => handleTargetChange(index, 'targetValue', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                        placeholder="0"
                        min="0"
                        step={target.type === 'business' || target.type === 'collection' ? '1000' : '1'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-50 mb-2">Incentive Amount (₹)</label>
                      <input
                        type="number"
                        value={target.incentiveAmount}
                        onChange={(e) => handleTargetChange(index, 'incentiveAmount', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                        placeholder="0"
                        min="0"
                        step="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-50 mb-2">Description</label>
                      <textarea
                        rows={2}
                        value={target.description}
                        onChange={(e) => handleTargetChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                        placeholder="Target description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.targets && <p className="mt-2 text-sm text-red-400">{errors.targets}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Additional Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              placeholder="Any additional notes about the KPI targets"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-900 mb-2">📋 KPI Rules & Incentive Policy</h4>
            <div className="text-sm text-yellow-800 space-y-1">
              <p>• <strong>Minimum Performance:</strong> 50% achievement required for positive incentive</p>
              <p>• <strong>Above 50%:</strong> Proportional incentive added to salary</p>
              <p>• <strong>Below 50%:</strong> Penalty deducted from salary</p>
              <p>• <strong>100%+ Achievement:</strong> Full incentive + potential bonus</p>
              <p>• <strong>Payroll Integration:</strong> Incentives/penalties automatically added to monthly payroll</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-yellow-400/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingKPI ? 'Update KPI' : 'Create KPI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const KPICard: React.FC<{ 
  kpi: EmployeeKPI; 
  onEdit: (kpi: EmployeeKPI) => void;
  onDelete: (kpi: EmployeeKPI) => void;
  onUpdateAchievement: (kpi: EmployeeKPI, targetType: string) => void;
}> = React.memo(({ kpi, onEdit, onDelete, onUpdateAchievement }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 100) return 'text-green-400';
    if (performance >= 80) return 'text-blue-400';
    if (performance >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTargetIcon = (type: string) => {
    switch (type) {
      case 'leads': return Target;
      case 'tasks': return CheckSquare;
      case 'business': return DollarSign;
      case 'collection': return TrendingUp;
      case 'group_filling': return Users;
      default: return Flag;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'amount') {
      return formatCurrency(value);
    }
    return value.toString();
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-semibold border border-yellow-400/30">
            {kpi.employeeName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-50">{kpi.employeeName}</h3>
            <p className="text-sm text-slate-400">{kpi.department} • {kpi.branch}</p>
            <p className="text-xs text-slate-500">Period: {new Date(kpi.period + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(kpi.status)}`}>
            {kpi.status.toUpperCase()}
          </span>
          <button className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Overall Performance */}
      <div className="mb-4 p-4 bg-slate-700/30 rounded-xl border border-yellow-400/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Overall Performance</span>
          <span className={`text-2xl font-bold ${getPerformanceColor(kpi.overallPerformance)}`}>
            {kpi.overallPerformance.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-3 border border-yellow-400/20">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              kpi.overallPerformance >= 100 ? 'bg-green-500' :
              kpi.overallPerformance >= 80 ? 'bg-blue-500' :
              kpi.overallPerformance >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(kpi.overallPerformance, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-sm font-semibold ${kpi.totalIncentive >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            Total Incentive: {kpi.totalIncentive >= 0 ? '+' : ''}{formatCurrency(kpi.totalIncentive)}
          </span>
          <span className="text-xs text-slate-500">
            {kpi.overallPerformance >= 50 ? '✅ Eligible for Incentive' : '❌ Penalty Applied'}
          </span>
        </div>
      </div>

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {kpi.targets.map((target) => {
          const Icon = getTargetIcon(target.type);
          return (
            <div key={target.id} className="p-3 bg-slate-700/30 rounded-lg border border-yellow-400/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-blue-400" />
                  <span className="text-slate-50 text-sm font-medium">{target.name}</span>
                </div>
                <button
                  onClick={() => onUpdateAchievement(kpi, target.type)}
                  className="p-1 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all"
                  title="Update Achievement"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target:</span>
                  <span className="text-slate-50">{formatValue(target.targetValue, target.unit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Achieved:</span>
                  <span className="text-slate-50">{formatValue(target.achievedValue, target.unit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Progress:</span>
                  <span className={`font-medium ${getPerformanceColor(target.achievementPercentage)}`}>
                    {target.achievementPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Incentive:</span>
                  <span className={`font-medium ${target.incentiveEarned >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {target.incentiveEarned >= 0 ? '+' : ''}{formatCurrency(target.incentiveEarned)}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-slate-600/50 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      target.achievementPercentage >= 100 ? 'bg-green-500' :
                      target.achievementPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(target.achievementPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-yellow-400/20">
        <div className="flex items-center text-xs text-slate-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Updated {new Date(kpi.updatedAt).toLocaleDateString()}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(kpi)}
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
            title="Edit KPI"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(kpi)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Delete KPI"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

const EmployeeKPIComponent: React.FC = () => {
  const [kpis, setKpis] = useState<EmployeeKPI[]>(() => {
    initializeKPIData();
    return getEmployeeKPIs();
  });
  const [employees] = useState<Employee[]>(() => {
    initializeEmployeesData();
    return getEmployees().filter(e => e.status === 'active');
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [filterPerformance, setFilterPerformance] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingKPI, setEditingKPI] = useState<EmployeeKPI | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<EmployeeKPI | null>(null);
  const [selectedTargetType, setSelectedTargetType] = useState<string>('');

  // Listen for KPI updates
  useEffect(() => {
    const handleKPIUpdate = () => {
      const updatedKPIs = getEmployeeKPIs();
      setKpis(updatedKPIs);
    };

    window.addEventListener('kpisUpdated', handleKPIUpdate);
    return () => window.removeEventListener('kpisUpdated', handleKPIUpdate);
  }, []);

  const getPerformanceColor = (performance: number) => {
    if (performance >= 100) return 'text-green-400';
    if (performance >= 80) return 'text-blue-400';
    if (performance >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredKPIs = useMemo(() => kpis.filter(kpi => {
    const matchesSearch = kpi.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kpi.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || kpi.department === filterDepartment;
    const matchesPeriod = filterPeriod === 'all' || kpi.period === filterPeriod;
    const matchesPerformance = filterPerformance === 'all' || 
      (filterPerformance === 'high' && kpi.overallPerformance >= 80) ||
      (filterPerformance === 'medium' && kpi.overallPerformance >= 50 && kpi.overallPerformance < 80) ||
      (filterPerformance === 'low' && kpi.overallPerformance < 50);
    
    return matchesSearch && matchesDepartment && matchesPeriod && matchesPerformance;
  }), [kpis, searchTerm, filterDepartment, filterPeriod, filterPerformance]);

  const stats = useMemo(() => ({
    totalKPIs: kpis.length,
    activeKPIs: kpis.filter(k => k.status === 'active').length,
    avgPerformance: kpis.length > 0 ? kpis.reduce((sum, k) => sum + k.overallPerformance, 0) / kpis.length : 0,
    totalIncentives: kpis.reduce((sum, k) => sum + Math.max(0, k.totalIncentive), 0),
    totalPenalties: Math.abs(kpis.reduce((sum, k) => sum + Math.min(0, k.totalIncentive), 0)),
    highPerformers: kpis.filter(k => k.overallPerformance >= 80).length,
    mediumPerformers: kpis.filter(k => k.overallPerformance >= 50 && k.overallPerformance < 80).length,
    lowPerformers: kpis.filter(k => k.overallPerformance < 50).length,
    eligibleForIncentive: kpis.filter(k => k.overallPerformance >= 50).length,
    penaltyApplied: kpis.filter(k => k.overallPerformance < 50).length
  }), [kpis]);

  const uniqueDepartments = useMemo(() => [...new Set(kpis.map(k => k.department))], [kpis]);
  const uniquePeriods = useMemo(() => [...new Set(kpis.map(k => k.period))], [kpis]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreateKPI = () => {
    setEditingKPI(null);
    setShowCreateModal(true);
  };

  const handleEditKPI = (kpi: EmployeeKPI) => {
    setEditingKPI(kpi);
    setShowCreateModal(true);
  };

  const handleSaveKPI = (kpiData: EmployeeKPI) => {
    let updatedKPIs;
    
    if (editingKPI) {
      updatedKPIs = kpis.map(k => k.id === editingKPI.id ? kpiData : k);
      toast.success(`KPI updated for ${kpiData.employeeName}`);
    } else {
      updatedKPIs = [...kpis, kpiData];
      toast.success(`KPI created for ${kpiData.employeeName}`);
    }
    
    setKpis(updatedKPIs);
    saveEmployeeKPIs(updatedKPIs);
    setShowCreateModal(false);
    setEditingKPI(null);
  };

  const handleDeleteKPI = (kpi: EmployeeKPI) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete KPI for ${kpi.employeeName}?`);
    if (confirmDelete) {
      const updatedKPIs = kpis.filter(k => k.id !== kpi.id);
      setKpis(updatedKPIs);
      saveEmployeeKPIs(updatedKPIs);
      toast.success(`KPI deleted for ${kpi.employeeName}`);
    }
  };

  const handleUpdateAchievement = (kpi: EmployeeKPI, targetType: string) => {
    setSelectedKPI(kpi);
    setSelectedTargetType(targetType);
    setShowUpdateModal(true);
  };

  const handleSaveAchievement = (data: { value: number; description: string }) => {
    if (!selectedKPI) return;

    const updatedKPI = updateKPIAchievement(
      selectedKPI.employeeId,
      selectedKPI.period,
      selectedTargetType,
      data.value,
      data.description
    );

    if (updatedKPI) {
      const updatedKPIs = kpis.map(k => k.id === selectedKPI.id ? updatedKPI : k);
      setKpis(updatedKPIs);
      toast.success(`Achievement updated for ${selectedKPI.employeeName}`);
    }

    setShowUpdateModal(false);
    setSelectedKPI(null);
    setSelectedTargetType('');
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Employee KPI Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage employee targets, track performance, and calculate incentives with payroll integration
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <Download className="h-4 w-4 mr-2" />
            Export KPI Report
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <Settings className="h-4 w-4 mr-2" />
            KPI Settings
          </button>
          <button 
            onClick={handleCreateKPI}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create KPI
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
                <p className="text-sm text-slate-400">Total KPIs</p>
                <p className="text-2xl font-bold text-slate-50">{stats.totalKPIs}</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active</p>
                <p className="text-2xl font-bold text-green-400">{stats.activeKPIs}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Performance</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(stats.avgPerformance)}`}>
                  {stats.avgPerformance.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">High Performers</p>
                <p className="text-2xl font-bold text-green-400">{stats.highPerformers}</p>
              </div>
              <Crown className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Medium Performers</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.mediumPerformers}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Low Performers</p>
                <p className="text-2xl font-bold text-red-400">{stats.lowPerformers}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Incentive Eligible</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.eligibleForIncentive}</p>
              </div>
              <Award className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Penalty Applied</p>
                <p className="text-2xl font-bold text-red-400">{stats.penaltyApplied}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Incentives</p>
                <p className="text-xl font-bold text-green-400">{formatCurrency(stats.totalIncentives)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Penalties</p>
                <p className="text-xl font-bold text-red-400">{formatCurrency(stats.totalPenalties)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
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
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            >
              <option value="all">All Periods</option>
              {uniquePeriods.map(period => (
                <option key={period} value={period}>
                  {new Date(period + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>
            <select
              value={filterPerformance}
              onChange={(e) => setFilterPerformance(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            >
              <option value="all">All Performance</option>
              <option value="high">High (80%+)</option>
              <option value="medium">Medium (50-79%)</option>
              <option value="low">Low (&lt;50%)</option>
            </select>
            <div className="text-sm text-slate-400">
              Showing: <span className="font-semibold text-slate-50">{filteredKPIs.length}</span> KPIs
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredKPIs.map((kpi) => (
            <KPICard 
              key={kpi.id} 
              kpi={kpi}
              onEdit={handleEditKPI}
              onDelete={handleDeleteKPI}
              onUpdateAchievement={handleUpdateAchievement}
            />
          ))}
        </div>

        {filteredKPIs.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-50 mb-2">No KPIs found</h3>
            <p className="text-sm text-slate-400 mb-4">
              {searchTerm || filterDepartment !== 'all' || filterPeriod !== 'all' || filterPerformance !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Create your first employee KPI to get started'
              }
            </p>
            <button 
              onClick={handleCreateKPI}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First KPI
            </button>
          </div>
        )}

        {/* Performance Distribution Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Performance Distribution
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <p className="text-2xl font-bold text-green-400">{stats.highPerformers}</p>
                <p className="text-xs text-green-300">High (80%+)</p>
              </div>
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <p className="text-2xl font-bold text-yellow-400">{stats.mediumPerformers}</p>
                <p className="text-xs text-yellow-300">Medium (50-79%)</p>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                <p className="text-2xl font-bold text-red-400">{stats.lowPerformers}</p>
                <p className="text-xs text-red-300">Low (&lt;50%)</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Incentive Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Incentives</span>
                <span className="text-green-400 font-semibold">{formatCurrency(stats.totalIncentives)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Penalties</span>
                <span className="text-red-400 font-semibold">{formatCurrency(stats.totalPenalties)}</span>
              </div>
              <div className="flex justify-between border-t border-yellow-400/20 pt-2">
                <span className="text-slate-400 font-medium">Net Impact</span>
                <span className={`font-bold ${
                  (stats.totalIncentives - stats.totalPenalties) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatCurrency(stats.totalIncentives - stats.totalPenalties)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Eligible Employees</span>
                <span className="text-blue-400 font-medium">{stats.eligibleForIncentive}/{stats.totalKPIs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit KPI Modal */}
        <CreateKPIModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingKPI(null);
          }}
          onSave={handleSaveKPI}
          editingKPI={editingKPI}
          employees={employees}
        />

        {/* Update Achievement Modal */}
        <UpdateAchievementModal
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedKPI(null);
            setSelectedTargetType('');
          }}
          onSave={handleSaveAchievement}
          kpi={selectedKPI}
          targetType={selectedTargetType}
        />
      </div>
    </div>
  );
};

export default EmployeeKPIComponent;