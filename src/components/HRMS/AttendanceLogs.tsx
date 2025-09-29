import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Eye, CheckSquare, Clock, Users, Calendar, QrCode, Download, Upload, MoreVertical, User, Building, CheckCircle, XCircle, AlertTriangle, Star, Target, Award, TrendingUp, Activity, MapPin, Smartphone, Wifi, Monitor } from 'lucide-react';
import { getEmployees, initializeEmployeesData } from '../../data/employees.mock';
import { Employee } from '../../types/hrms';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  breakTime: number; // in minutes
  workHours: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'half-day' | 'on-leave' | 'holiday';
  attendanceType: 'regular' | 'overtime' | 'night-shift' | 'weekend';
  location?: string;
  ipAddress?: string;
  deviceInfo?: string;
  qrCodeUsed: boolean;
  kioskId?: string;
  approvalStatus: 'auto-approved' | 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  isRegularized: boolean;
  regularizationReason?: string;
  regularizedBy?: string;
  regularizedAt?: string;
  notes?: string;
}

const sampleAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: 'emp_1',
    employeeName: 'Priya Sharma',
    date: '2024-03-15',
    checkIn: '09:15',
    checkOut: '18:30',
    breakTime: 60,
    workHours: 8.25,
    overtimeHours: 0.25,
    status: 'present',
    attendanceType: 'regular',
    location: 'Bangalore Main Office',
    ipAddress: '192.168.1.101',
    deviceInfo: 'Mobile App - Android',
    qrCodeUsed: true,
    kioskId: 'KIOSK_BLR_MAIN_01',
    approvalStatus: 'auto-approved',
    isRegularized: false
  },
  {
    id: '2',
    employeeId: 'emp_2',
    employeeName: 'Karthik Nair',
    date: '2024-03-15',
    checkIn: '08:45',
    checkOut: '17:15',
    breakTime: 45,
    workHours: 7.75,
    overtimeHours: 0,
    status: 'present',
    attendanceType: 'regular',
    location: 'Bangalore South Office',
    ipAddress: '192.168.2.105',
    deviceInfo: 'QR Scanner - Kiosk',
    qrCodeUsed: true,
    kioskId: 'KIOSK_BLR_SOUTH_01',
    approvalStatus: 'auto-approved',
    isRegularized: false
  },
  {
    id: '3',
    employeeId: 'emp_3',
    employeeName: 'Neha Singh',
    date: '2024-03-15',
    checkIn: '09:30',
    checkOut: '13:30',
    breakTime: 30,
    workHours: 3.5,
    overtimeHours: 0,
    status: 'half-day',
    attendanceType: 'regular',
    location: 'Bangalore East Office',
    ipAddress: '192.168.3.110',
    deviceInfo: 'Web Portal - Chrome',
    qrCodeUsed: false,
    approvalStatus: 'pending',
    isRegularized: true,
    regularizationReason: 'Medical appointment in afternoon',
    regularizedBy: 'Vikram Singh',
    regularizedAt: '2024-03-15T14:00:00',
    notes: 'Half day approved for medical reasons'
  },
  {
    id: '4',
    employeeId: 'emp_4',
    employeeName: 'Rohit Gupta',
    date: '2024-03-15',
    status: 'on-leave',
    attendanceType: 'regular',
    approvalStatus: 'approved',
    approvedBy: 'Anjali Sharma',
    approvedAt: '2024-03-14T16:00:00',
    isRegularized: false,
    workHours: 0,
    overtimeHours: 0,
    breakTime: 0,
    notes: 'Sick leave approved'
  },
  {
    id: '5',
    employeeId: 'emp_1',
    employeeName: 'Priya Sharma',
    date: '2024-03-14',
    checkIn: '09:00',
    checkOut: '20:15',
    breakTime: 75,
    workHours: 10,
    overtimeHours: 2,
    status: 'present',
    attendanceType: 'overtime',
    location: 'Bangalore Main Office',
    ipAddress: '192.168.1.101',
    deviceInfo: 'Mobile App - Android',
    qrCodeUsed: true,
    kioskId: 'KIOSK_BLR_MAIN_01',
    approvalStatus: 'approved',
    approvedBy: 'Rajesh Kumar',
    approvedAt: '2024-03-15T09:00:00',
    isRegularized: false,
    notes: 'Overtime for month-end closing activities'
  }
];

const AttendanceCard: React.FC<{ record: AttendanceRecord }> = React.memo(({ record }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'half-day': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on-leave': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'holiday': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case 'auto-approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDeviceIcon = (deviceInfo: string) => {
    if (deviceInfo?.includes('Mobile')) return Smartphone;
    if (deviceInfo?.includes('Kiosk')) return Monitor;
    if (deviceInfo?.includes('Web')) return Wifi;
    return Monitor;
  };

  const DeviceIcon = getDeviceIcon(record.deviceInfo || '');

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-semibold border border-yellow-400/30">
            {record.employeeName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-50">{record.employeeName}</h3>
            <p className="text-sm text-slate-400">{new Date(record.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
            {record.status.replace('-', ' ').toUpperCase()}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getApprovalColor(record.approvalStatus)}`}>
            {record.approvalStatus.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Check In</span>
            <span className="text-slate-50 font-medium">{record.checkIn || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Check Out</span>
            <span className="text-slate-50 font-medium">{record.checkOut || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Work Hours</span>
            <span className="text-green-400 font-medium">{record.workHours}h</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Break Time</span>
            <span className="text-slate-50">{record.breakTime}m</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Overtime</span>
            <span className="text-orange-400 font-medium">{record.overtimeHours}h</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">QR Code</span>
            <span className={record.qrCodeUsed ? 'text-green-400' : 'text-red-400'}>
              {record.qrCodeUsed ? 'Used' : 'Manual'}
            </span>
          </div>
        </div>
      </div>

      {record.location && (
        <div className="mb-4 p-3 bg-slate-700/30 rounded-xl border border-yellow-400/20">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300 text-sm">{record.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DeviceIcon className="h-4 w-4 text-slate-400" />
            <span className="text-slate-400 text-xs">{record.deviceInfo}</span>
          </div>
        </div>
      )}

      {record.isRegularized && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400 font-medium">Regularized</p>
          <p className="text-xs text-yellow-300">{record.regularizationReason}</p>
          {record.regularizedBy && (
            <p className="text-xs text-slate-400 mt-1">By {record.regularizedBy}</p>
          )}
        </div>
      )}

      {record.notes && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-400">{record.notes}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-yellow-400/20">
        <div className="flex items-center text-xs text-slate-500">
          <Activity className="h-3 w-3 mr-1" />
          <span>{record.attendanceType.replace('-', ' ')}</span>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
            <Eye className="h-4 w-4" />
          </button>
          {record.approvalStatus === 'pending' && (
            <>
              <button className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all">
                <CheckCircle className="h-4 w-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

// Generate realistic attendance records for employees
const generateAttendanceRecords = (employees: Employee[]): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Generate records for last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    employees.forEach((employee, empIndex) => {
      // Skip weekends for some variety
      if (date.getDay() === 0 || date.getDay() === 6) {
        if (Math.random() > 0.3) return; // 30% chance of weekend work
      }
      
      // Generate realistic attendance patterns
      const isPresent = Math.random() > 0.1; // 90% attendance rate
      const isOnLeave = Math.random() > 0.95; // 5% leave probability
      const isHalfDay = Math.random() > 0.9; // 10% half day probability
      
      let status: AttendanceRecord['status'] = 'present';
      let checkIn = '';
      let checkOut = '';
      let workHours = 0;
      let overtimeHours = 0;
      
      if (isOnLeave) {
        status = 'on-leave';
      } else if (!isPresent) {
        status = 'absent';
      } else if (isHalfDay) {
        status = 'half-day';
        checkIn = '09:30';
        checkOut = '13:30';
        workHours = 3.5;
      } else {
        status = 'present';
        // Random check-in between 8:30 and 9:30
        const checkInHour = 8 + Math.random();
        const checkInMinutes = Math.floor(checkInHour * 60);
        checkIn = `${Math.floor(checkInMinutes / 60).toString().padStart(2, '0')}:${(checkInMinutes % 60).toString().padStart(2, '0')}`;
        
        // Random check-out between 17:30 and 19:00
        const checkOutHour = 17.5 + Math.random() * 1.5;
        const checkOutMinutes = Math.floor(checkOutHour * 60);
        checkOut = `${Math.floor(checkOutMinutes / 60).toString().padStart(2, '0')}:${(checkOutMinutes % 60).toString().padStart(2, '0')}`;
        
        // Calculate work hours
        const checkInTime = new Date(`2024-01-01T${checkIn}:00`);
        const checkOutTime = new Date(`2024-01-01T${checkOut}:00`);
        const totalMinutes = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60);
        const breakTime = 45 + Math.random() * 30; // 45-75 minutes break
        workHours = Math.round(((totalMinutes - breakTime) / 60) * 100) / 100;
        
        // Calculate overtime
        if (workHours > 8) {
          overtimeHours = Math.round((workHours - 8) * 100) / 100;
        }
      }
      
      const record: AttendanceRecord = {
        id: `att_${employee.id}_${dateString}`,
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        date: dateString,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        breakTime: status === 'present' || status === 'half-day' ? 45 + Math.random() * 30 : 0,
        workHours,
        overtimeHours,
        status,
        attendanceType: overtimeHours > 0 ? 'overtime' : 'regular',
        location: employee.branch,
        ipAddress: `192.168.${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 200) + 100}`,
        deviceInfo: ['Mobile App - Android', 'QR Scanner - Kiosk', 'Web Portal - Chrome'][Math.floor(Math.random() * 3)],
        qrCodeUsed: Math.random() > 0.2, // 80% QR code usage
        kioskId: `KIOSK_${employee.branch?.replace(/\s+/g, '_').toUpperCase()}_01`,
        approvalStatus: status === 'on-leave' || isHalfDay ? 'pending' : 'auto-approved',
        approvedBy: status === 'on-leave' ? employee.reportingManager : undefined,
        approvedAt: status === 'on-leave' ? new Date(date.getTime() - 24 * 60 * 60 * 1000).toISOString() : undefined,
        isRegularized: isHalfDay,
        regularizationReason: isHalfDay ? 'Medical appointment' : undefined,
        regularizedBy: isHalfDay ? employee.reportingManager : undefined,
        regularizedAt: isHalfDay ? new Date().toISOString() : undefined,
        notes: status === 'on-leave' ? 'Approved leave' : isHalfDay ? 'Half day for medical appointment' : undefined
      };
      
      records.push(record);
    });
  }
  
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const AttendanceLogs: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    initializeEmployeesData();
    return getEmployees();
  });
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterApproval, setFilterApproval] = useState<string>('all');
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Load employees and generate attendance records
  React.useEffect(() => {
    const loadedEmployees = getEmployees();
    console.log('AttendanceLogs: Loaded employees:', loadedEmployees.length);
    setEmployees(loadedEmployees);
    
    // Generate attendance records for all employees
    const generatedRecords = generateAttendanceRecords(loadedEmployees);
    console.log('AttendanceLogs: Generated attendance records:', generatedRecords.length);
    setAttendanceRecords(generatedRecords);
  }, []);

  // Listen for employee updates
  React.useEffect(() => {
    const handleEmployeeUpdate = () => {
      console.log('AttendanceLogs: Employee data updated, refreshing...');
      const updatedEmployees = getEmployees();
      console.log('AttendanceLogs: Updated employees count:', updatedEmployees.length);
      setEmployees(updatedEmployees);
      
      // Regenerate attendance records with updated employee data
      const updatedRecords = generateAttendanceRecords(updatedEmployees);
      setAttendanceRecords(updatedRecords);
    };

    window.addEventListener('employeesUpdated', handleEmployeeUpdate);
    window.addEventListener('employeeDataChanged', handleEmployeeUpdate);
    window.addEventListener('storage', handleEmployeeUpdate);
    
    return () => {
      window.removeEventListener('employeesUpdated', handleEmployeeUpdate);
      window.removeEventListener('employeeDataChanged', handleEmployeeUpdate);
      window.removeEventListener('storage', handleEmployeeUpdate);
    };
  }, []);

  const processQRAttendance = () => {
    if (!selectedEmployeeForQR) return;

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    const dateString = now.toISOString().split('T')[0];

    const newRecord: AttendanceRecord = {
      id: `att_${selectedEmployeeForQR.id}_${dateString}_${qrScanMode}`,
      employeeId: selectedEmployeeForQR.i