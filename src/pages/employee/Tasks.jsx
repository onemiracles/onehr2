import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Loading, Modal, Progress } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faListAlt,
  faThLarge,
  faCalendarAlt,
  faCheckCircle,
  faHourglassHalf,
  faExclamationCircle,
  faComment,
  faClock,
  faFlag,
  faUser,
  faTags,
  faEye,
  faComments,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

const EmployeeTaskView = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'grid', or 'timeline'
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState('');
  const [taskStats, setTaskStats] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchTaskStats();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockTasks = [
        {
          id: 1,
          title: 'Complete Project Documentation',
          description: 'Update technical documentation for the Q2 release',
          priority: 'high',
          dueDate: '2024-04-15',
          status: 'in-progress',
          progress: 75,
          assignedBy: 'John Manager',
          category: 'Documentation',
          comments: [
            { user: 'John Manager', text: 'Please include API documentation', timestamp: '2024-03-20 10:00' }
          ],
          timeSpent: 12,
          timeEstimate: 16
        },
        {
          id: 2,
          title: 'Review Code Changes',
          description: 'Review and provide feedback on recent pull requests',
          priority: 'medium',
          dueDate: '2024-04-10',
          status: 'pending',
          progress: 0,
          assignedBy: 'Jane Lead',
          category: 'Development',
          comments: [],
          timeSpent: 0,
          timeEstimate: 4
        }
      ];
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskStats = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockStats = {
        completed: 15,
        inProgress: 5,
        pending: 3,
        overdue: 1,
        efficiency: 92,
        weeklyProgress: [
          { day: 'Mon', completed: 3 },
          { day: 'Tue', completed: 4 },
          { day: 'Wed', completed: 2 },
          { day: 'Thu', completed: 3 },
          { day: 'Fri', completed: 3 }
        ]
      };
      setTaskStats(mockStats);
    } catch (error) {
      console.error('Error fetching task stats:', error);
    }
  };

  const handleUpdateProgress = async (taskId, newProgress) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, progress: newProgress }
          : task
      ));
    } catch (error) {
      console.error('Error updating task progress:', error);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newComment = {
        user: 'Current User',
        text: comment,
        timestamp: new Date().toISOString()
      };
      setTasks(tasks.map(task =>
        task.id === selectedTask.id
          ? { ...task, comments: [...task.comments, newComment] }
          : task
      ));
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <FontAwesomeIcon icon={faFlag} className="text-red-500" />;
      case 'medium':
        return <FontAwesomeIcon icon={faFlag} className="text-yellow-500" />;
      case 'low':
        return <FontAwesomeIcon icon={faFlag} className="text-green-500" />;
      default:
        return <FontAwesomeIcon icon={faFlag} className="text-gray-500" />;
    }
  };

  const TaskListView = () => (
    <div className="space-y-4">
      {filteredTasks.map(task => (
        <Card key={task.id} className="bg-white dark:bg-gray-800">
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  {getPriorityIcon(task.priority)}
                  <span className="ml-2">{task.title}</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {task.description}
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedTask(task);
                  setIsModalOpen(true);
                }}
              >
                <FontAwesomeIcon icon={faEye} />
              </Button>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {task.progress}%
                </span>
              </div>
              <Progress value={task.progress} />
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                  {task.status.replace('-', ' ').charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Due: {task.dueDate}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {task.timeSpent}/{task.timeEstimate}h
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const TaskGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTasks.map(task => (
        <Card key={task.id} className="bg-white dark:bg-gray-800">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {task.title}
              </h3>
              {getPriorityIcon(task.priority)}
            </div>
            <Progress value={task.progress} className="mt-4" />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Due: {task.dueDate}
                </span>
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full mt-4"
              onClick={() => {
                setSelectedTask(task);
                setIsModalOpen(true);
              }}
            >
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  const TaskTimelineView = () => (
    <div className="relative">
      <div className="border-l-2 border-primary-200 dark:border-primary-800 ml-4">
        {filteredTasks.map(task => (
          <div key={task.id} className="mb-8 ml-6 relative">
            <div className="absolute -left-9 top-0 bg-white dark:bg-gray-800 p-1 rounded-full border-2 border-primary-200 dark:border-primary-800">
              {getPriorityIcon(task.priority)}
            </div>
            <Card className="bg-white dark:bg-gray-800">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Due: {task.dueDate}
                </p>
                <Progress value={task.progress} className="mt-4" />
                <div className="mt-4 flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedTask(task);
                      setIsModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );

  const filteredTasks = tasks.filter(task => 
    filter === 'all' || task.status === filter
  );

  if (loading && tasks.length === 0) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Tasks
        </h2>
        <div className="flex space-x-4">
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('list')}
          >
            <FontAwesomeIcon icon={faListAlt} />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('grid')}
          >
            <FontAwesomeIcon icon={faThLarge} />
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('timeline')}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-green-50 dark:bg-green-900 p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-800">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-green-600 dark:text-green-400">Completed</p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100">
                {taskStats?.completed || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900 p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800">
              <FontAwesomeIcon icon={faHourglassHalf} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">In Progress</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {taskStats?.inProgress || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-900 p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-800">
              <FontAwesomeIcon icon={faClock} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
              <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                {taskStats?.pending || 0}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900 p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-800">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-red-600 dark:text-red-400">Overdue</p>
              <p className="text-xl font-bold text-red-900 dark:text-red-100">
                {taskStats?.overdue || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-40"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </Select>

        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Search tasks..."
            className="w-full"
            onChange={(e) => {
              // Implement search functionality
            }}
          />
        </div>
      </div>

      {viewMode === 'list' && <TaskListView />}
      {viewMode === 'grid' && <TaskGridView />}
      {viewMode === 'timeline' && <TaskTimelineView />}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Task Details"
      >
        {selectedTask && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    {getPriorityIcon(selectedTask.priority)}
                    <span className="ml-2">{selectedTask.title}</span>
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Category: {selectedTask.category}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedTask.status)}`}>
                  {selectedTask.status.replace('-', ' ').charAt(0).toUpperCase() + selectedTask.status.slice(1)}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedTask.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Assigned By</label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedTask.assignedBy}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Due Date</label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedTask.dueDate}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                  Progress
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-grow">
                    <Progress value={selectedTask.progress} />
                  </div>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedTask.progress}
                    onChange={(e) => handleUpdateProgress(selectedTask.id, parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                  Time Tracking
                </label>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Time Spent</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedTask.timeSpent}h
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Estimated</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedTask.timeEstimate}h
                      </p>
                    </div>
                    <div>
                      <Button variant="secondary" size="small">
                        Start Timer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                  Comments
                </label>
                <div className="space-y-4">
                  {selectedTask.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {comment.user}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                    </div>
                  ))}

                  <div className="flex space-x-2">
                    <Input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-grow"
                    />
                    <Button variant="primary" onClick={handleAddComment}>
                      <FontAwesomeIcon icon={faComment} className="mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeTaskView;