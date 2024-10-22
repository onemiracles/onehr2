import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { Card, Spinner } from './ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClipboardList, faDollarSign, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const Dashboard = ({ children }) => {
  const { user } = useAuth();
  const { role } = useRole();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Simulating API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      // Replace this with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDashboardData({
        employeeCount: 150,
        attendanceRate: 95,
        payrollProcessed: 145000,
        openPositions: 5
      });
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user.email}</h1>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary-50">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUsers} className="text-4xl text-primary-600 mr-4" />
            <div>
              <h2 className="text-xl font-semibold text-primary-800">Total Employees</h2>
              <p className="text-3xl font-bold text-primary-600">{dashboardData.employeeCount}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-secondary-50">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClipboardList} className="text-4xl text-primary-600 mr-4" />
            <div>
              <h2 className="text-xl font-semibold text-primary-800">Attendance Rate</h2>
              <p className="text-3xl font-bold text-primary-600">{dashboardData.attendanceRate}%</p>
            </div>
          </div>
        </Card>
        <Card className="bg-primary-50">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faDollarSign} className="text-4xl text-primary-600 mr-4" />
            <div>
              <h2 className="text-xl font-semibold text-primary-800">Payroll Processed</h2>
              <p className="text-3xl font-bold text-primary-600">${dashboardData.payrollProcessed}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-secondary-50">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUserPlus} className="text-4xl text-primary-600 mr-4" />
            <div>
              <h2 className="text-xl font-semibold text-primary-800">Open Positions</h2>
              <p className="text-3xl font-bold text-primary-600">{dashboardData.openPositions}</p>
            </div>
          </div>
        </Card>
      </div> */}
      { children }
    </div>
  );
};

export default Dashboard;