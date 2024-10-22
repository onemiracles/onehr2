import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Input, Select, Spinner, Modal, Table } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const PositionManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    type: '',
    experience: '',
    description: '',
  });

  useEffect(() => {
    fetchOpenPositions();
  }, []);

  const fetchOpenPositions = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch open positions
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace this with actual API call
      const mockPositions = [
        { id: 1, title: 'Software Engineer', department: 'Engineering', type: 'Full-time', experience: '3-5 years', description: 'We are looking for a skilled software engineer...' },
        { id: 2, title: 'Product Manager', department: 'Product', type: 'Full-time', experience: '5+ years', description: 'Seeking an experienced product manager to lead...' },
        { id: 3, title: 'UX Designer', department: 'Design', type: 'Contract', experience: '2-4 years', description: 'Join our design team to create intuitive user experiences...' },
      ];
      setPositions(mockPositions);
    } catch (error) {
      console.error('Error fetching open positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddPosition = () => {
    setCurrentPosition(null);
    setFormData({
      title: '',
      department: '',
      type: '',
      experience: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleEditPosition = (position) => {
    setCurrentPosition(position);
    setFormData(position);
    setIsModalOpen(true);
  };

  const handleDeletePosition = async (id) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      setLoading(true);
      try {
        // Simulating API call to delete position
        await new Promise(resolve => setTimeout(resolve, 500));
        // Replace this with actual API call
        setPositions(positions.filter(position => position.id !== id));
      } catch (error) {
        console.error('Error deleting position:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulating API call to add/edit position
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace this with actual API call
      if (currentPosition) {
        // Editing existing position
        setPositions(positions.map(p => p.id === currentPosition.id ? { ...formData, id: p.id } : p));
      } else {
        // Adding new position
        const newPosition = { ...formData, id: Date.now() };
        setPositions([...positions, newPosition]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting position:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && positions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Open Positions</h2>
        <Button variant="primary" onClick={handleAddPosition}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Position
        </Button>
      </div>

      <Table
        headers={['Title', 'Department', 'Type', 'Experience', 'Actions']}
        data={positions.map(position => [
          position.title,
          position.department,
          position.type,
          position.experience,
          <div key={position.id} className="flex space-x-2">
            <Button variant="secondary" onClick={() => handleEditPosition(position)}>
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button variant="danger" onClick={() => handleDeletePosition(position.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        ])}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentPosition ? "Edit Position" : "Add New Position"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
          />
          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            options={[
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Internship', label: 'Internship' },
            ]}
          />
          <Input
            label="Experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            type="textarea"
            rows={4}
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {currentPosition ? 'Update' : 'Add'} Position
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};

export default PositionManagement;