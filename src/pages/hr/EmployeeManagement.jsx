import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Input, Select, Loading, Modal, Table, Tabs, TabPanel } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faUserCircle,
  faEnvelope,
  faPhone,
  faBriefcase,
  faCalendarAlt,
  faIdCard
} from '@fortawesome/free-solid-svg-icons';

const EmployeeManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    joiningDate: '',
    employeeId: '',
    status: 'active',
    role: '',
  });

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch employees
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace with actual API call
      const mockEmployees = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          department: 'Engineering',
          position: 'Senior Developer',
          joiningDate: '2023-01-15',
          employeeId: 'EMP001',
          status: 'active',
          role: 'Team Lead'
        },
        // Add more mock employees...
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      // Simulating API call to fetch departments
      await new Promise(resolve => setTimeout(resolve, 500));
      // Replace with actual API call
      const mockDepartments = [
        'Engineering',
        'Marketing',
        'Sales',
        'Human Resources',
        'Finance',
        'Product',
        'Design'
      ];
      setDepartments(mockDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      joiningDate: '',
      employeeId: '',
      status: 'active',
      role: '',
    });
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setFormData(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setLoading(true);
      try {
        // Simulating API call to delete employee
        await new Promise(resolve => setTimeout(resolve, 500));
        // Replace with actual API call
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (error) {
        console.error('Error deleting employee:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulating API call to add/edit employee
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace with actual API call
      if (currentEmployee) {
        // Editing existing employee
        setEmployees(employees.map(emp => emp.id === currentEmployee.id ? { ...formData, id: emp.id } : emp));
      } else {
        // Adding new employee
        const newEmployee = { ...formData, id: Date.now() };
        setEmployees([...employees, newEmployee]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    if (activeTab === 'all') return true;
    return emp.status === activeTab;
  });

  const EmployeeCard = ({ employee }) => (
    <Card className="mb-4 p-4 bg-white dark:bg-gray-800 shadow-lg">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <FontAwesomeIcon icon={faUserCircle} className="text-2xl text-primary-600 dark:text-primary-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{employee.position}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => handleEditEmployee(employee)}>
            <FontAwesomeIcon icon={faEdit} className="mr-1" />
            Edit
          </Button>
          <Button variant="danger" onClick={() => handleDeleteEmployee(employee.id)}>
            <FontAwesomeIcon icon={faTrash} className="mr-1" />
            Delete
          </Button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-300">{employee.email}</span>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faPhone} className="text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-300">{employee.phone}</span>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faBriefcase} className="text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-300">{employee.department}</span>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-300">{employee.joiningDate}</span>
        </div>
      </div>
      <div className="mt-2">
        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
          employee.status === 'active' ? 'bg-green-100 text-green-800' :
          employee.status === 'inactive' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
        </span>
      </div>
    </Card>
  );

  if (loading && employees.length === 0) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Employee Management</h2>
        <Button variant="primary" onClick={handleAddEmployee}>
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Add Employee
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        tabs={[
          { value: 'all', label: 'All Employees' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'onLeave', label: 'On Leave' }
        ]}
        className="mb-6"
      />

      <div className="grid grid-cols-1 gap-4">
        {filteredEmployees.map(employee => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentEmployee ? "Edit Employee" : "Add New Employee"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
            options={departments.map(dept => ({ value: dept, label: dept }))}
          />
          <Input
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Employee ID"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Joining Date"
            name="joiningDate"
            type="date"
            value={formData.joiningDate}
            onChange={handleInputChange}
            required
          />
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'onLeave', label: 'On Leave' }
            ]}
          />
          <Input
            label="Role"
            name="role"
            value={formData.role}
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
              {currentEmployee ? 'Update' : 'Add'} Employee
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;