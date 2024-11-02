import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Loading, Modal, Table } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faUserPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faChartPie,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0ea5e9', '#ec4899', '#10b981', '#f59e0b', '#6366f1', '#8b5cf6'];

const DepartmentManagement = () => {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    budget: '',
    headCount: '',
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockDepartments = [
        {
          id: 1,
          name: 'Engineering',
          description: 'Software development and technical operations',
          manager: 'John Doe',
          employeeCount: 45,
          budget: 1500000,
          headCount: 50,
        },
        {
          id: 2,
          name: 'Marketing',
          description: 'Brand management and marketing operations',
          manager: 'Jane Smith',
          employeeCount: 20,
          budget: 800000,
          headCount: 25,
        },
        {
          id: 3,
          name: 'Sales',
          description: 'Sales and business development',
          manager: 'Mike Johnson',
          employeeCount: 30,
          budget: 1200000,
          headCount: 35,
        },
      ];
      setDepartments(mockDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDepartment = () => {
    setCurrentDepartment(null);
    setFormData({
      name: '',
      description: '',
      manager: '',
      budget: '',
      headCount: '',
    });
    setIsModalOpen(true);
  };

  const handleEditDepartment = (department) => {
    setCurrentDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      manager: department.manager,
      budget: department.budget,
      headCount: department.headCount,
    });
    setIsModalOpen(true);
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setDepartments(departments.filter(dept => dept.id !== id));
      } catch (error) {
        console.error('Error deleting department:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (currentDepartment) {
        setDepartments(departments.map(dept =>
          dept.id === currentDepartment.id ? { ...dept, ...formData } : dept
        ));
      } else {
        const newDepartment = {
          id: Date.now(),
          ...formData,
          employeeCount: 0,
        };
        setDepartments([...departments, newDepartment]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving department:', error);
    } finally {
      setLoading(false);
    }
  };

  const DepartmentDistributionChart = () => {
    const data = departments.map(dept => ({
      name: dept.name,
      value: dept.employeeCount
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  if (loading && departments.length === 0) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Department Management
        </h2>
        <Button variant="primary" onClick={handleAddDepartment}>
          <FontAwesomeIcon icon={faBuilding} className="mr-2" />
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white dark:bg-gray-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Employee Distribution
          </h3>
          <DepartmentDistributionChart />
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Department Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
              <p className="text-sm text-primary-600 dark:text-primary-400">Total Departments</p>
              <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                {departments.length}
              </p>
            </div>
            <div className="bg-secondary-50 dark:bg-secondary-900 p-4 rounded-lg">
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Employees</p>
              <p className="text-2xl font-bold text-secondary-700 dark:text-secondary-300">
                {departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <Table
          headers={['Department', 'Manager', 'Employees', 'Budget', 'Actions']}
          data={departments.map(dept => [
            <div className="font-medium text-gray-900 dark:text-white">
              {dept.name}
              <p className="text-sm text-gray-500 dark:text-gray-400">{dept.description}</p>
            </div>,
            dept.manager,
            `${dept.employeeCount} / ${dept.headCount}`,
            `$${dept.budget.toLocaleString()}`,
            <div className="flex space-x-2">
              <Button variant="secondary" onClick={() => handleEditDepartment(dept)}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button variant="danger" onClick={() => handleDeleteDepartment(dept.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          ])}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentDepartment ? "Edit Department" : "Add New Department"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Department Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Department Manager"
            name="manager"
            value={formData.manager}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Budget"
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Head Count"
            name="headCount"
            type="number"
            value={formData.headCount}
            onChange={handleInputChange}
            required
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {currentDepartment ? 'Update' : 'Create'} Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;