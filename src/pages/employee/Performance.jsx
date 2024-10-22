import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Spinner, Progress } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBullseye, faComments, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const PerformanceMetric = ({ icon, title, value, color }) => (
  <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
    <div className={`p-3 rounded-full ${color} text-white mr-4`}>
      <FontAwesomeIcon icon={icon} className="w-5 h-5" />
    </div>
    <div>
      <p className="mb-2 text-sm font-medium text-gray-600">{title}</p>
      <p className="text-lg font-semibold text-gray-700">{value}</p>
    </div>
  </div>
);

const PerformanceGoal = ({ title, progress }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-base font-medium text-primary-700">{title}</span>
      <span className="text-sm font-medium text-primary-700">{progress}%</span>
    </div>
    <Progress value={progress} color="primary" />
  </div>
);

const Performance = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      setLoading(true);
      try {
        // Simulating API call to fetch performance data
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Replace with actual API call
        setPerformanceData({
          overallScore: 4.2,
          kpiAchievement: 85,
          feedbackRating: 4.5,
          performanceTrend: [
            { month: 'Jan', score: 3.8 },
            { month: 'Feb', score: 4.0 },
            { month: 'Mar', score: 4.2 },
            { month: 'Apr', score: 4.1 },
            { month: 'May', score: 4.3 },
            { month: 'Jun', score: 4.2 },
          ],
          goals: [
            { title: 'Project Completion', progress: 75 },
            { title: 'Skill Development', progress: 60 },
            { title: 'Team Collaboration', progress: 90 },
          ],
        });
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Performance Dashboard</h1>
      
      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <PerformanceMetric 
          icon={faChartLine} 
          title="Overall Performance Score" 
          value={performanceData.overallScore.toFixed(1)} 
          color="bg-primary-500"
        />
        <PerformanceMetric 
          icon={faBullseye} 
          title="KPI Achievement" 
          value={`${performanceData.kpiAchievement}%`} 
          color="bg-secondary-500"
        />
        <PerformanceMetric 
          icon={faComments} 
          title="Feedback Rating" 
          value={performanceData.feedbackRating.toFixed(1)} 
          color="bg-primary-500"
        />
      </div>

      <Card className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData.performanceTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#4C51BF" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Goals</h2>
        {performanceData.goals.map((goal, index) => (
          <PerformanceGoal key={index} title={goal.title} progress={goal.progress} />
        ))}
      </Card>

      <div className="flex justify-between">
        <Link to="/employee/achievements">
          <Button variant="primary">
            <FontAwesomeIcon icon={faTrophy} className="mr-2" />
            View Achievements
          </Button>
        </Link>
        <Link to="/employee/request-feedback">
          <Button variant="secondary">
            <FontAwesomeIcon icon={faComments} className="mr-2" />
            Request Feedback
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Performance;