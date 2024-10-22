import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Spinner } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faFileAlt, faChartLine, faTasks } from '@fortawesome/free-solid-svg-icons';
import EmployeeClockInOut from '../../components/EmployeeClockInOut';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulating API call to fetch dashboard data
        await new Promise(resolve => setTimeout(resolve, 1500));
        setDashboardData({
          upcomingLeave: '5 days',
          lastPayslip: 'March 2024',
          performanceScore: '4.2/5',
          pendingTasks: 3
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  const cardList = [
    {
        title: "Time Off",
        icon: faCalendarAlt,
        content: `Upcoming leave: ${dashboardData.upcomingLeave}`,
        link: "/employee/request-time-off",
        button: "Request Time Off"
    },
    {
        title: "Payroll",
        icon: faFileAlt,
        content: `Last payslip: ${dashboardData.lastPayslip}`,
        link: "/employee/view-payslips",
        button: "View Payslips"
    },
    {
        title: "Performance",
        icon: faChartLine,
        content: `Current score: ${dashboardData.performanceScore}`,
        link: "/employee/performance",
        button: "View Performance"
    },
    {
        title: "Tasks",
        icon: faTasks,
        content: `Pending tasks: ${dashboardData.pendingTasks}`,
        link: "/employee/tasks",
        button: "Manage Tasks"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user.email}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EmployeeClockInOut />
        
        {cardList.map((e, i) => {
            return (<Card key={i} className="text-white bg-secondary-500">
                <h2 className="dark:text-white text-xl font-semibold text-primary-800 mb-4">
                  <FontAwesomeIcon icon={e.icon} className="mr-2" />
                  {e.title}
                </h2>
                <p className="text-gray-600 mb-4">{e.content}</p>
                <Link to={e.link}>
                  <Button variant="primary">{e.button}</Button>
                </Link>
              </Card>);
        })}
      </div>
    </div>
  );
};

export default EmployeeDashboard;