import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Spinner } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faUserPlus, 
  faCalendarAlt, 
  faMoneyBillWave,
  faChartLine,
  faUserCheck,
  faClipboardList,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const MetricCard = ({ icon, title, value, trend, color = "primary" }) => (
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
          {value}
        </p>
        {trend && (
          <span className={`text-sm ${
            trend > 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  </Card>
);

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock dashboard data
      setDashboardData({
        totalEmployees: 256,
        employeeTrend: 5.2,
        newHires: 12,
        openPositions: 8,
        attritionRate: -2.1,
        avgSalary: 75000,
        attendanceRate: 96.5,
        performanceRate: 88,
        monthlyData: [
          { month: 'Jan', employees: 245, hires: 8, exits: 3 },
          { month: 'Feb', employees: 250, hires: 7, exits: 2 },
          { month: 'Mar', employees: 252, hires: 5, exits: 3 },
          { month: 'Apr', employees: 256, hires: 12, exits: 8 },
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          HR Dashboard
        </h1>
        <div className="flex space-x-4">
          <Button variant="primary">
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Post New Position
          </Button>
          <Button variant="secondary">
            <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={faUsers}
          title="Total Employees"
          value={dashboardData.totalEmployees}
          trend={dashboardData.employeeTrend}
        />
        <MetricCard
          icon={faUserPlus}
          title="New Hires (MTD)"
          value={dashboardData.newHires}
          color="secondary"
        />
        <MetricCard
          icon={faBriefcase}
          title="Open Positions"
          value={dashboardData.openPositions}
          color="primary"
        />
        <MetricCard
          icon={faUserCheck}
          title="Attendance Rate"
          value={`${dashboardData.attendanceRate}%`}
          color="secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Workforce Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="employees" 
                stroke="#0ea5e9" 
                name="Total Employees"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="hires" 
                stroke="#22c55e" 
                name="New Hires"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="exits" 
                stroke="#ef4444" 
                name="Exits"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/hr/employee-onboarding">
                <Button variant="outline" className="w-full">
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Onboard Employee
                </Button>
            </Link>
            <Link to="/hr/payroll-process">
              <Button variant="outline" className="w-full">
                <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                Process Payroll
              </Button>
            </Link>
            <Link to="/hr/leave-requests">
              <Button variant="outline" className="w-full">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Leave Requests
              </Button>
            </Link>
            <Link to="/hr/performance-reviews">
              <Button variant="outline" className="w-full">
                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                Performance Reviews
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Updates
        </h2>
        <ul className="space-y-3">
          <li className="flex items-center text-gray-600 dark:text-gray-300">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            New employee onboarding scheduled for next week
          </li>
          <li className="flex items-center text-gray-600 dark:text-gray-300">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
            5 pending leave requests require approval
          </li>
          <li className="flex items-center text-gray-600 dark:text-gray-300">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
            Q2 performance reviews starting next month
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default CompanyDashboard;