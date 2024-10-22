import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Input, Checkbox, Spinner, Modal } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faPlus, faFilter, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const TaskItem = ({ task, onComplete, onDelete }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200">
    <div className="flex items-center">
      <Checkbox
        checked={task.completed}
        onChange={() => onComplete(task.id)}
        label={task.title}
      />
    </div>
    <div>
      <Button variant="danger" onClick={() => onDelete(task.id)} className="text-sm">
        <FontAwesomeIcon icon={faTimes} />
      </Button>
    </div>
  </div>
);

const Tasks = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch tasks
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Replace with actual API call
      const mockTasks = [
        { id: 1, title: 'Complete project proposal', completed: false },
        { id: 2, title: 'Review team performance', completed: true },
        { id: 3, title: 'Prepare for client meeting', completed: false },
        { id: 4, title: 'Update weekly report', completed: false },
      ];
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (newTaskTitle.trim() === '') return;
    
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setIsModalOpen(false);

    // Here you would typically make an API call to add the task to the backend
  };

  const handleCompleteTask = async (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    // Here you would typically make an API call to update the task status in the backend
  };

  const handleDeleteTask = async (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);

    // Here you would typically make an API call to delete the task from the backend
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <Card className="bg-primary-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary-800">
          <FontAwesomeIcon icon={faTasks} className="mr-2" />
          Your Tasks
        </h2>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Task
        </Button>
      </div>

      <div className="mb-4">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
          className="mr-2"
        >
          All
        </Button>
        <Button
          variant={filter === 'active' ? 'primary' : 'secondary'}
          onClick={() => setFilter('active')}
          className="mr-2"
        >
          Active
        </Button>
        <Button
          variant={filter === 'completed' ? 'primary' : 'secondary'}
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
          />
        ))}
        {filteredTasks.length === 0 && (
          <p className="p-4 text-gray-500 text-center">No tasks found.</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Task">
        <Input
          label="Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title"
        />
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="mr-2">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTask}>
            Add Task
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default Tasks;