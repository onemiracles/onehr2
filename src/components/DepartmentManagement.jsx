import React, { useState, useEffect } from 'react';
import { useRole } from '../hooks/useRole';
import departmentService from '../services/departmentService';
import employeeService from '../services/employeeService';
import { Card, Button, Input, Select, Table, Modal, Spinner, Pagination } from './ui';
import { Form } from './ui/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faSitemap,
  faUserTie,
  faChartPie,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useModal, useConfirmModal, useAlertModal } from '../components/ModalProvider';

const DepartmentManagement = ({ selectedTenant }) => {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [departmentStats, setDepartmentStats] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: '',
    parentDepartmentId: '',
    budget: '',
    headCount: '',
    status: 'active'
  });

  const { show, hide } = useModal();

  // Chart colors for department statistics
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, [currentPage, searchTerm]);

  const fetchDepartments = async () => {
    if (selectedTenant) {
        setLoading(true);
        try {
          const response = await departmentService.getDepartments(selectedTenant);
          setDepartments(response.data);
          setTotalPages(response.pagination.total);
        } catch (error) {
        console.error('Failed to fetch departments:', error);
        } finally {
        setLoading(false);
        }
    } else {
        setDepartments(null);
    }
  };

  const fetchEmployees = async () => {
    if (selectedTenant) {
        try {
          const response = await employeeService.getEmployees(selectedTenant);
          setEmployees(response.data);
        } catch (error) {
          console.error('Failed to fetch employees:', error);
        }
    } else {
        setEmployees(null);
    }
  };

  const fetchDepartmentStats = async () => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/tenants/${selectedTenant}/departments/stats`);
      const data = await response.json();
      setDepartmentStats(data);
      setStatsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch department stats:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddDepartment = () => {
    setCurrentDepartment(null);
    setFormData({
      name: '',
      description: '',
      managerId: '',
      parentDepartmentId: '',
      budget: '',
      headCount: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleEditDepartment = (department) => {
    setCurrentDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      managerId: department.managerId,
      parentDepartmentId: department.parentDepartmentId,
      budget: department.budget,
      headCount: department.headCount,
      status: department.status
    });
    setIsModalOpen(true);
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      // Replace with actual API call
      await fetch(`/api/tenants/${selectedTenant}/departments/${departmentId}`, {
        method: 'DELETE'
      });
      fetchDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
    }
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    for (const [key, value] of Object.entries(formData)) {
        if (value == '') {
            delete formData[key];
        }
    }
    console.log(formData);
    try {
      if (currentDepartment) {
        await departmentService.updateDepartment(selectedTenant, currentDepartment.id, formData);
      } else {
        await departmentService.createDepartment(selectedTenant, formData);
      }
      hide();
      fetchDepartments();
    } catch (error) {
      console.error('Failed to save department:', error);
    }
  };

  const DepartmentStatsModal = () => (
    <Modal
      isOpen={statsModalOpen}
      onClose={() => setStatsModalOpen(false)}
      title="Department Statistics"
    >
      {departmentStats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <div className="text-center">
                <h4 className="text-lg font-semibold">Total Departments</h4>
                <p className="text-3xl font-bold text-primary-600">{departmentStats.totalDepartments}</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <h4 className="text-lg font-semibold">Total Employees</h4>
                <p className="text-3xl font-bold text-secondary-600">{departmentStats.totalEmployees}</p>
              </div>
            </Card>
          </div>

          <Card>
            <h4 className="text-lg font-semibold mb-4">Employee Distribution</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentStats.distribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {departmentStats.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Budget Overview</h4>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Total Budget</span>
                <span className="font-semibold">${departmentStats.totalBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Average per Department</span>
                <span className="font-semibold">${departmentStats.averageBudget.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4 flex-1 mr-4">
            <Input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="max-w-xs"
            />
            <Button variant="secondary" onClick={fetchDepartmentStats}>
                <FontAwesomeIcon icon={faChartPie} className="mr-2" />
                View Statistics
            </Button>
            </div>
            <Button variant="primary" onClick={handleAddDepartment}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Department
            </Button>
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-64">
            <Spinner size="large" />
            </div>
        ) : (
            <>
            <Table
                headers={[
                'Name',
                'Manager',
                'Employees',
                'Budget',
                'Status',
                'Actions'
                ]}
                data={departments.map((dept) => [
                <div>
                    <div className="font-medium">{dept.name}</div>
                    <div className="text-sm text-gray-500">{dept.description}</div>
                </div>,
                dept.managerName,
                `${dept._count.employees}/${dept.headCount}`,
                `$${dept.budget.toLocaleString()}`,
                <span className={`px-2 py-1 rounded-full text-xs ${
                    dept.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                    {dept.status}
                </span>,
                <div className="flex space-x-2">
                    <Button
                    variant="secondary"
                    onClick={() => handleEditDepartment(dept)}
                    >
                    <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                    variant="secondary"
                    onClick={() => handleDeleteDepartment(dept.id)}
                    >
                    <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </div>
                ])}
            />

            <Pagination
                currentPage={currentPage}
                total={totalPages}
                onPageChange={setCurrentPage}
            />
            </>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentDepartment ? 'Edit Department' : 'Add Department'}
      >
        <Form onSubmit={handleSubmit}>
          <Input
            label="Department Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <Select
            label="Department Manager"
            name="managerId"
            value={formData.managerId}
            onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
            required
            options={[
                { value: '', label: 'No Manager'},
                ...employees ? employees.map(employee => ({
                    value: employee.id,
                    label: `${employee.firstName} ${employee.lastName}`
                })): []
            ]}
          />

          <Select
            label="Parent Department"
            name="parentDepartmentId"
            value={formData.parentDepartmentId}
            onChange={(e) => setFormData({ ...formData, parentDepartmentId: e.target.value })}
            options={[
              { value: '', label: 'None (Top Level)' },
                ...departments ? departments.filter(dept => dept.id !== currentDepartment?.id)
                    .map(dept => ({
                        value: dept.id,
                        label: dept.name
                    })
                    ) : []
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
            />

            <Input
              label="Head Count"
              name="headCount"
              type="number"
              value={formData.headCount}
              onChange={(e) => setFormData({ ...formData, headCount: e.target.value })}
              required
            />
          </div>

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            required
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {currentDepartment ? 'Update Department' : 'Add Department'}
            </Button>
          </div>
        </Form>
      </Modal>

      <DepartmentStatsModal />
    </div>
  );
};

export default DepartmentManagement;