import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DepartmentService from '../services/DepartmentService';
import EmployeeService from '../services/EmployeeService';
import { Card, Button, Input, Select, Table, Loading, Pagination } from './ui';
import { Form } from './ui/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash,
  faChartPie
} from '@fortawesome/free-solid-svg-icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useModal } from './modal';

const DepartmentManagement = ({ selectedTenant }) => {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [departmentStats, setDepartmentStats] = useState(null);
  const {showModal, hideModal} = useModal();

  const employeeService = useMemo(() =>new EmployeeService(selectedTenant), [selectedTenant]);
  const departmentService = useMemo(() =>new DepartmentService(selectedTenant), [selectedTenant]);

  // Chart colors for department statistics
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await departmentService.getDepartments({ search: searchTerm, currentPage });
      setDepartments(response.data);
      setTotalPages(response.pagination.total);
    } catch (error) {
    console.error('Failed to fetch departments:', error);
    } finally {
    setLoading(false);
    }
  }, [departmentService, searchTerm, currentPage]);

  const fetchDepartmentStats = useCallback(async () => {
    try {
      const response = await departmentService.getDepartmentStats();
      setDepartmentStats(response);
    } catch (error) {
      console.error('Failed to fetch department stats:', error);
    }
  }, [departmentService]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeService.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  }, [employeeService]);

  useEffect(() => {fetchEmployees();}, [fetchEmployees]);
  useEffect(() => {fetchDepartments();}, [fetchDepartments]);
  useEffect(() => {fetchDepartmentStats();}, [fetchDepartmentStats]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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

  const handleShowModal = (type, data = null) => {
    if (type === 'department') {
      const state = data ? {
        name: data.name ?? '',
        description: data.description ?? '',
        managerId: data.managerId ?? '',
        parentDepartmentId: data.parentDepartmentId ?? '',
        budget: data.budget ?? '',
        headCount: data.headCount ?? '',
        status: data.status ?? ''
      } : {
        name: '',
        description: '',
        managerId: '',
        parentDepartmentId: '',
        budget: '',
        headCount: '',
        status: 'active'
      }
      showModal(<DepartmentModalContent initialState={state} data={data} />);
    } else if (type === 'stats') {
      showModal(<StatsModalContent departmentStats={departmentStats} />);
    }
  };

  const DepartmentModalContent = ({initialState, data = null}) => {
    const [state, setState] = useState(initialState);

    const handleInputChange = (e) => {
      let { name, value, type } = e.target;
      if (type === 'number') {
        value = Number(value);
      }
      setState({ ...state, [name]: value });
    };

    const handleSubmit = async (e) => {
      // e.preventDefault();
      try {
        if (data) {
          await departmentService.updateDepartment(data.id, state);
        } else {
          await departmentService.createDepartment(state);
        }
        hideModal();
        fetchDepartments();
      } catch (error) {
        console.error('Failed to save department:', error);
      }
    };

    return (<Form onSubmit={handleSubmit}>
      <Input
        label="Department Name"
        name="name"
        value={state.name}
        onChange={handleInputChange}
        required
      />

      <Input
        label="Description"
        name="description"
        value={state.description}
        onChange={handleInputChange}
        required
      />

      <Select
        label="Department Manager"
        name="managerId"
        value={state.managerId}
        onChange={handleInputChange}
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
        value={state.parentDepartmentId}
        onChange={handleInputChange}
        options={[
          { value: '', label: 'None (Top Level)' },
            ...departments ? departments.filter(dept => dept.id !== data?.id)
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
          value={state.budget}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Head Count"
          name="headCount"
          type="number"
          value={state.headCount}
          onChange={handleInputChange}
          required
        />
      </div>

      <Select
        label="Status"
        name="status"
        value={state.status}
        onChange={handleInputChange}
        required
        options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ]}
      />

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="secondary" onClick={() => hideModal()}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {data ? 'Update Department' : 'Add Department'}
        </Button>
      </div>
    </Form>);
  };

  const StatsModalContent = ({ departmentStats }) => {
    return (<div className="space-y-6">
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
        <h4 className="text-lg font-semibold mb-4">Budget Distribution</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departmentStats.distribution}
                dataKey="departmentBudget"
                nameKey="departmentName"
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
    </div>);
  };

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
            <Button variant="secondary" onClick={() => handleShowModal('stats')}>
                <FontAwesomeIcon icon={faChartPie} className="mr-2" />
                View Statistics
            </Button>
            </div>
            <Button variant="primary" onClick={() => handleShowModal('department')}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Department
            </Button>
        </div>

        {loading ? (
          <Loading />
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
                    onClick={() => handleShowModal('department', dept)}
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
    </div>
  );
};

export default DepartmentManagement;