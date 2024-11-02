import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Loading, Modal, Table, Progress } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, 
  faStar,
  faComment,
  faSave,
  faTimes,
  faCheck,
  faChartLine,
  faBullseye,
  faCalendarAlt,
  faHistory,
  faAward,
  faUserClock,
  faClipboardList,
  faFileAlt,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceReviews = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [currentView, setCurrentView] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [performanceStats, setPerformanceStats] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-Q1');

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchReviews(),
        fetchPerformanceStats(),
      ]);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockReviews = [
      {
        id: 1,
        employeeName: 'John Doe',
        position: 'Senior Developer',
        department: 'Engineering',
        status: 'pending',
        reviewPeriod: '2024-Q1',
        lastReview: '2023-Q4',
        goals: [
          { title: 'Complete project X', progress: 80 },
          { title: 'Mentor junior developers', progress: 65 },
          { title: 'Improve code quality', progress: 90 }
        ],
        ratings: {
          technical: 4.5,
          communication: 4.0,
          leadership: 3.8,
          productivity: 4.2
        },
        feedback: [
          {
            type: 'peer',
            content: 'Great team player, always willing to help.',
            date: '2024-03-15'
          },
          {
            type: 'manager',
            content: 'Strong technical skills, could improve leadership.',
            date: '2024-03-16'
          }
        ]
      },
      // Add more mock reviews...
    ];
    setReviews(mockReviews);
  };

  const fetchPerformanceStats = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockStats = {
      averageRating: 4.2,
      completedReviews: 45,
      pendingReviews: 15,
      goalCompletionRate: 78,
      departmentScores: {
        Engineering: 4.3,
        Product: 4.1,
        Marketing: 4.0,
        Sales: 4.4
      },
      performanceTrend: [
        { period: 'Q1 2023', score: 4.0 },
        { period: 'Q2 2023', score: 4.1 },
        { period: 'Q3 2023', score: 4.2 },
        { period: 'Q4 2023', score: 4.3 }
      ]
    };
    setPerformanceStats(mockStats);
  };

  const handleStartReview = (employeeId) => {
    setModalContent({ type: 'newReview', data: employeeId });
    setIsModalOpen(true);
  };

  const PerformanceOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary-50 dark:bg-primary-900 p-6">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-primary-100 dark:bg-primary-800">
              <FontAwesomeIcon 
                icon={faStar} 
                className="text-2xl text-primary-600 dark:text-primary-400" 
              />
            </div>
            <div className="ml-4">
              <h3 className="text-primary-900 dark:text-primary-100 text-sm font-medium">
                Average Rating
              </h3>
              <p className="text-primary-700 dark:text-primary-300 text-2xl font-bold">
                {performanceStats.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900 p-6">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-800">
              <FontAwesomeIcon 
                icon={faCheck} 
                className="text-2xl text-green-600 dark:text-green-400" 
              />
            </div>
            <div className="ml-4">
              <h3 className="text-green-900 dark:text-green-100 text-sm font-medium">
                Completed Reviews
              </h3>
              <p className="text-green-700 dark:text-green-300 text-2xl font-bold">
                {performanceStats.completedReviews}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-900 p-6">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-yellow-100 dark:bg-yellow-800">
              <FontAwesomeIcon 
                icon={faUserClock} 
                className="text-2xl text-yellow-600 dark:text-yellow-400" 
              />
            </div>
            <div className="ml-4">
              <h3 className="text-yellow-900 dark:text-yellow-100 text-sm font-medium">
                Pending Reviews
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-2xl font-bold">
                {performanceStats.pendingReviews}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-secondary-50 dark:bg-secondary-900 p-6">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-secondary-100 dark:bg-secondary-800">
              <FontAwesomeIcon 
                icon={faBullseye} 
                className="text-2xl text-secondary-600 dark:text-secondary-400" 
              />
            </div>
            <div className="ml-4">
              <h3 className="text-secondary-900 dark:text-secondary-100 text-sm font-medium">
                Goal Completion
              </h3>
              <p className="text-secondary-700 dark:text-secondary-300 text-2xl font-bold">
                {performanceStats.goalCompletionRate}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Performance Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceStats.performanceTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#0ea5e9" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Department Performance
          </h3>
          <div className="space-y-4">
            {Object.entries(performanceStats.departmentScores).map(([dept, score]) => (
              <div key={dept} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">{dept}</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {score.toFixed(1)}
                  </span>
                </div>
                <Progress
                  value={score * 20}
                  color={
                    score >= 4.5 ? 'green' :
                    score >= 4.0 ? 'primary' :
                    score >= 3.5 ? 'yellow' : 'red'
                  }
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Review Status
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative inline-flex">
                <div className="w-32 h-32">
                  <Progress
                    type="circle"
                    value={(performanceStats.completedReviews / (performanceStats.completedReviews + performanceStats.pendingReviews)) * 100}
                    color="primary"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {Math.round((performanceStats.completedReviews / (performanceStats.completedReviews + performanceStats.pendingReviews)) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {performanceStats.completedReviews}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {performanceStats.pendingReviews}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const ReviewForm = ({ onClose, employee }) => {
    const [formData, setFormData] = useState({
      ratings: {
        technical: '',
        communication: '',
        leadership: '',
        productivity: ''
      },
      strengths: '',
      improvements: '',
      goals: '',
      comments: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Handle review submission
        onClose();
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    };

    const handleRatingChange = (category, value) => {
      setFormData(prev => ({
        ...prev,
        ratings: {
          ...prev.ratings,
          [category]: value
        }
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Performance Ratings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(formData.ratings).map(category => (
              <div key={category}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize mb-2">
                  {category}
                </label>
                <Select
                  value={formData.ratings[category]}
                  onChange={(e) => handleRatingChange(category, e.target.value)}
                  required
                >
                  <option value="">Select Rating</option>
                  {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map(rating => (
                    <option key={rating} value={rating}>{rating}</option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        </div>

        <Input
          label="Key Strengths"
          name="strengths"
          type="textarea"
          value={formData.strengths}
          onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
          required
          rows={3}
        />

        <Input
          label="Areas for Improvement"
          name="improvements"
          type="textarea"
          value={formData.improvements}
          onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
          required
          rows={3}
        />

        <Input
          label="Goals for Next Period"
          name="goals"
          type="textarea"
          value={formData.goals}
          onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
          required
          rows={3}
        />

        <Input
          label="Additional Comments"
          name="comments"
          type="textarea"
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          rows={3}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit Review
          </Button>
        </div>
      </form>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Performance Reviews
        </h2>
        <div className="flex space-x-4">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-36"
          >
            <option value="2024-Q1">2024 Q1</option>
            <option value="2023-Q4">2023 Q4</option>
            <option value="2023-Q3">2023 Q3</option>
          </Select>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-40"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </Select>
        </div>
      </div>

      {currentView === 'overview' ? (
        <PerformanceOverview />
      ) : (
        <Card className="bg-white dark:bg-gray-800">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Employee Reviews
              </h3>
              <div className="flex space-x-4">
                <Button variant="primary">
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                  Export Reviews
                </Button>
              </div>
            </div>

            <Table
              headers={['Employee', 'Department', 'Goals Progress', 'Average Rating', 'Status', 'Actions']}
              data={reviews
                .filter(review => 
                  (selectedDepartment === 'all' || review.department === selectedDepartment) &&
                  review.reviewPeriod === selectedPeriod
                )
                .map(review => [
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {review.employeeName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {review.position}
                    </p>
                  </div>,
                  review.department,
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Goals</span>
                      <span className="text-gray-900 dark:text-white">
                        {Math.round(review.goals.reduce((acc, goal) => acc + goal.progress, 0) / review.goals.length)}%
                      </span>
                    </div>
                    <Progress
                      value={review.goals.reduce((acc, goal) => acc + goal.progress, 0) / review.goals.length}
                      color="primary"
                    />
                  </div>,
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white mr-2">
                      {Object.values(review.ratings).reduce((a, b) => a + b, 0) / Object.values(review.ratings).length}
                    </span>
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                  </div>,
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    review.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : review.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                  }`}>
                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                  </span>,
                  <div className="flex space-x-2">
                    <Button variant="secondary" onClick={() => {
                      setModalContent({ type: 'viewReview', data: review });
                      setIsModalOpen(true);
                    }}>
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                    {review.status === 'pending' && (
                      <Button variant="primary" onClick={() => handleStartReview(review.id)}>
                        <FontAwesomeIcon icon={faClipboardList} />
                      </Button>
                    )}
                  </div>
                ])}
            />
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent?.type === 'newReview' ? 'Conduct Review' : 'Review Details'}
      >
        {modalContent?.type === 'newReview' ? (
          <ReviewForm 
            onClose={() => setIsModalOpen(false)}
            employee={reviews.find(r => r.id === modalContent.data)}
          />
        ) : modalContent?.type === 'viewReview' ? (
          <ReviewDetails 
            review={modalContent.data}
            onClose={() => setIsModalOpen(false)}
          />
        ) : null}
      </Modal>
    </div>
  );
};

const ReviewDetails = ({ review, onClose }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Employee
          </label>
          <p className="text-gray-900 dark:text-white">{review.employeeName}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Department
          </label>
          <p className="text-gray-900 dark:text-white">{review.department}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Position
          </label>
          <p className="text-gray-900 dark:text-white">{review.position}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Review Period
          </label>
          <p className="text-gray-900 dark:text-white">{review.reviewPeriod}</p>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Performance Ratings
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(review.ratings).map(([category, rating]) => (
            <div key={category} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 capitalize">{category}</span>
                <span className="flex items-center">
                  <span className="font-semibold text-gray-900 dark:text-white mr-1">
                    {rating}
                  </span>
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Goals Progress
        </h4>
        <div className="space-y-4">
          {review.goals.map((goal, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-900 dark:text-white">{goal.title}</span>
                <span className="text-gray-600 dark:text-gray-400">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} color="primary" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Feedback
        </h4>
        <div className="space-y-4">
          {review.feedback.map((feedback, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {feedback.type} Feedback
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {feedback.date}
                </span>
              </div>
              <p className="text-gray-900 dark:text-white">{feedback.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default PerformanceReviews;