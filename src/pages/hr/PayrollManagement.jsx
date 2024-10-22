import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Spinner, Modal, Table, Progress } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave,
  faFileInvoiceDollar,
  faCalendarAlt,
  faDownload,
  faSearch,
  faSync,
  faCheckCircle,
  faExclamationTriangle,
  faHistory,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const PayrollManagement = () => {
  const [loading, setLoading] = useState(true);
  const [payrollData, setPayrollData] = useState(null);
  const [currentPayPeriod, setCurrentPayPeriod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [payrollStats, setPayrollStats] = useState(null);

  useEffect(() => {
    fetchPayrollData();
    fetchPayrollHistory();
    fetchPayrollStats();
  }, []);

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockPayrollData = {
        employees: [
          {
            id: 1,
            name: 'John Doe',
            position: 'Senior Developer',
            baseSalary: 95000,
            benefits: 15000,
            taxes: 28500,
            netSalary: 81500,
            status: 'pending'
          },
          {
            id: 2,
            name: 'Jane Smith',
            position: 'Product Manager',
            baseSalary: 105000,
            benefits: 18000,
            taxes: 31500,
            netSalary: 91500,
            status: 'processed'
          },
          // Add more employees...
        ],
        currentPeriod: 'March 2024',
        totalPayroll: 850000,
        processedCount: 45,
        pendingCount: 15
      };
      setPayrollData(mockPayrollData);
      setCurrentPayPeriod(mockPayrollData.currentPeriod);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayrollHistory = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockHistory = [
        {
          period: 'March 2024',
          totalAmount: 850000,
          employeeCount: 60,
          processedDate: '2024-03-25',
          status: 'completed'
        },
        {
          period: 'February 2024',
          totalAmount: 845000,
          employeeCount: 59,
          processedDate: '2024-02-25',
          status: 'completed'
        },
        // Add more history...
      ];
      setPayrollHistory(mockHistory);
    } catch (error) {
      console.error('Error fetching payroll history:', error);
    }
  };

  const fetchPayrollStats = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockStats = {
        monthlyTrend: [
          { month: 'Jan', amount: 820000 },
          { month: 'Feb', amount: 845000 },
          { month: 'Mar', amount: 850000 },
          { month: 'Apr', amount: 855000 },
        ],
        averageSalary: 85000,
        totalBenefits: 180000,
        totalTaxes: 255000
      };
      setPayrollStats(mockStats);
    } catch (error) {
      console.error('Error fetching payroll stats:', error);
    }
  };

  const handleProcessPayroll = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Update processed count
      setPayrollData(prev => ({
        ...prev,
        processedCount: prev.processedCount + prev.pendingCount,
        pendingCount: 0,
        employees: prev.employees.map(emp => ({
          ...emp,
          status: 'processed'
        }))
      }));
    } catch (error) {
      console.error('Error processing payroll:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const PayrollSummaryCard = ({ title, value, icon, color = "primary" }) => (
    <Card className={`bg-${color}-50 dark:bg-${color}-900 p-6`}>
      <div className="flex items-center">
        <div className={`p-4 rounded-full bg-${color}-100 dark:bg-${color}-800`}>
          <FontAwesomeIcon 
            icon={icon} 
            className={`text-2xl text-${color}-600 dark:text-${color}-400`} 
          />
        </div>
        <div className="ml-4">
          <h3 className={`text-${color}-900 dark:text-${color}-100 text-sm font-medium`}>
            {title}
          </h3>
          <p className={`text-${color}-700 dark:text-${color}-300 text-2xl font-bold`}>
            {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
          </p>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payroll Management
        </h2>
        <div className="flex space-x-4">
          <Select
            value={currentPayPeriod}
            onChange={(e) => setCurrentPayPeriod(e.target.value)}
            className="w-48"
          >
            <option value="March 2024">March 2024</option>
            <option value="February 2024">February 2024</option>
          </Select>
          <Link to="/hr/payroll-process">
            <Button 
              variant="primary" 
              onClick={handleProcessPayroll}
              disabled={isProcessing || payrollData.pendingCount === 0}
            >
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
              Process Payroll
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PayrollSummaryCard
          title="Total Payroll"
          value={payrollData.totalPayroll}
          icon={faMoneyBillWave}
        />
        <PayrollSummaryCard
          title="Processed Employees"
          value={payrollData.processedCount}
          icon={faCheckCircle}
          color="green"
        />
        <PayrollSummaryCard
          title="Pending Employees"
          value={payrollData.pendingCount}
          icon={faExclamationTriangle}
          color="yellow"
        />
        <PayrollSummaryCard
          title="Average Salary"
          value={payrollStats.averageSalary}
          icon={faChartLine}
          color="secondary"
        />
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Payroll History
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={payrollStats.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#0ea5e9" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <Table
          headers={['Employee', 'Position', 'Base Salary', 'Benefits', 'Taxes', 'Net Salary', 'Status', 'Actions']}
          data={payrollData.employees.map(employee => [
            employee.name,
            employee.position,
            `$${employee.baseSalary.toLocaleString()}`,
            `$${employee.benefits.toLocaleString()}`,
            `$${employee.taxes.toLocaleString()}`,
            `$${employee.netSalary.toLocaleString()}`,
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              employee.status === 'processed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
            }`}>
              {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
            </span>,
            <div className="flex space-x-2">
              <Button variant="secondary" onClick={() => handleViewEmployee(employee)}>
                <FontAwesomeIcon icon={faSearch} />
              </Button>
              <Button variant="primary">
                <FontAwesomeIcon icon={faDownload} />
              </Button>
            </div>
          ])}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Employee Payroll Details"
      >
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Employee Name
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedEmployee.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Position
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedEmployee.position}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Salary Breakdown
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Base Salary</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${selectedEmployee.baseSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Benefits</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${selectedEmployee.benefits.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Taxes</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${selectedEmployee.taxes.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Net Salary</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    ${selectedEmployee.netSalary.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary">
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download Payslip
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PayrollManagement;