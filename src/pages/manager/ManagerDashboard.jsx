import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Loading } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faChartLine, 
  faClock, 
  faCalendarAlt, 
  faClipboardList, 
  faUserPlus,
  faPeopleGroup
} from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch dashboard data
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Replace this with actual API call
      setDashboardData({
        teamSize: 12,
        averagePerformance: 85,
        attendanceRate: 95,
        attendances: 3,
        openPositions: 2,
        pendingApprovals: 3,
        performanceTrend: [
          { month: 'Jan', score: 82 },
          { month: 'Feb', score: 84 },
          { month: 'Mar', score: 83 },
          { month: 'Apr', score: 86 },
          { month: 'May', score: 85 },
          { month: 'Jun', score: 87 },
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Welcome, {user.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary-50 dark:bg-primary-900">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUsers} className="text-4xl text-primary-600 dark:text-primary-400 mr-4" />
            <div>
              <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-200">Team Size</h2>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-300">{dashboardData.teamSize}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-secondary-50 dark:bg-secondary-900">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faChartLine} className="text-4xl text-secondary-600 dark:text-secondary-400 mr-4" />
            <div>
              <h2 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">Average Performance</h2>
              <p className="text-3xl font-bold text-secondary-600 dark:text-secondary-300">{dashboardData.averagePerformance}%</p>
            </div>
          </div>
        </Card>
        <Card className="bg-primary-50 dark:bg-primary-900">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClock} className="text-4xl text-primary-600 dark:text-primary-400 mr-4" />
            <div>
              <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-200">Attendance Rate</h2>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-300">{dashboardData.attendanceRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Team Performance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-4">
            <Link to="manager/meeting">
                <Button variant="primary" className="w-full">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Schedule Team Meeting
                </Button>
            </Link>
            <Link to="manager/performance">
                <Button variant="secondary" className="w-full">
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                Review Performance ({dashboardData.pendingApprovals})
                </Button>
            </Link>
            <Link to="manager/attendance">
                <Button variant="outline" className="w-full">
                    <FontAwesomeIcon icon={faPeopleGroup} className="mr-2" />
                    Manage Attendances ({dashboardData.attendances})
                </Button>
            </Link>
            <Link to="manager/position">
                <Button variant="outline" className="w-full">
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                    Manage Open Positions ({dashboardData.openPositions})
                </Button>
            </Link>
          </div>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Updates</h2>
        <ul className="space-y-2">
          <li className="text-gray-600 dark:text-gray-300">New performance review cycle starts next week</li>
          <li className="text-gray-600 dark:text-gray-300">Team building event scheduled for next month</li>
          <li className="text-gray-600 dark:text-gray-300">Budget reports due by end of the week</li>
        </ul>
      </Card>
    </div>
  );
};

export default ManagerDashboard;