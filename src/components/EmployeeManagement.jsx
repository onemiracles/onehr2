import React, { useState, useEffect, useCallback, useMemo } from 'react';
import EmployeeService from '../services/EmployeeService';
import { useRole } from '../hooks/useRole';
import { useModal } from './modal';
import DepartmentService from '../services/DepartmentService';
import { Form, Card, Button, Input, Select, Table, Loading, Pagination } from '../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../utils';

const EmployeeManagement = ({ selectedTenant }) => {
  const { hasPermission } = useRole();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterRole, setFilterRole] = useState('');
  const { showModal, hideModal } = useModal();
  
  const employeeService = useMemo(() => new EmployeeService(selectedTenant), [selectedTenant]);
  const departmentService = useMemo(() => new DepartmentService(selectedTenant), [selectedTenant]);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await employeeService.getEmployees({currentPage, search: searchTerm, filterRole});
      setEmployees(response.data);
      setTotalPages(response.pagination.total);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  }, [employeeService, currentPage, searchTerm, filterRole]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await departmentService.getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  }, [departmentService]);

  useEffect(() => {fetchEmployees();}, [fetchEmployees]);
  useEffect(() => {fetchDepartments();}, [fetchDepartments]);  

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      await employeeService.deleteEmployee(selectedTenant, employeeId)
      fetchEmployees();
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  const handleShowModal = (data = null) => {
    const state = data ? {
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      phone: data.phone ?? '',
      email: data.email ?? '',
      role: data.role ?? '',
      tenantId: data.tenantId ?? '',
      departmentId: data.departmentId ?? '',
      position: data.position ?? '',
      startDate: formatDate(data.startDate, 'calendar') ?? '',
      status: data.status ?? ''
    } : {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      role: '',
      tenantId: selectedTenant,
      departmentId: '',
      position: '',
      startDate: '',
      status: 'active'
    };
    showModal(<ModelContent initailState={state} data={data} />,
      {
        title: data ? 'Edit Employee' : 'Add Employee'
      });
  };

  if (!hasPermission('manage_companies')) {
    return <div>You do not have permission to access this page.</div>;
  }

  const ModelContent = ({initailState, data = null}) => {
    const [state, setState] = useState(initailState);

    const handleSubmit = async (e) => {
      if (state.departmentId === '') {
          delete state.departmentId;
      }
      try {
        if (data) {
          await employeeService.updateEmployee(data.id, state);
        } else {
          await employeeService.createEmployee(state);
        }
        hideModal();
        fetchEmployees();
      } catch (error) {
        console.error('Failed to save employee:', error);
      }
    };

    return (<Form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={state.firstName}
          onChange={(e) => setState({ ...state, firstName: e.target.value })}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={state.lastName}
          onChange={(e) => setState({ ...state, lastName: e.target.value })}
          required
        />
      </div>
      
      <Input
        label="Phone"
        name="phone"
        value={state.phone}
        onChange={(e) => setState({ ...state, phone: e.target.value })}
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={state.email}
        onChange={(e) => setState({ ...state, email: e.target.value })}
        required
      />

      <Select
        label="Role"
        name="role"
        value={state.role}
        onChange={(e) => setState({ ...state, role: e.target.value })}
        required
        options={[
          { value: 'COMPANY_ADMIN', label: 'Company Admin' },
          { value: 'COMPANY_MANAGER', label: 'Manager' },
          { value: 'COMPANY_EMPLOYEE', label: 'Employee' }
        ]}
      />

      <Select
        label="Department"
        name="department"
        value={state.departmentId}
        onChange={(e) => setState({ ...state, departmentId: e.target.value })}
        options={[
            { value: '', label: 'No Department' },
            ...(departments ? departments.map((e) => {
                return { value: e.id, label: e.name }
            }) : [])
        ]}
      />

      <Input
        label="Position"
        name="position"
        value={state.position}
        onChange={(e) => setState({ ...state, position: e.target.value })}
        required
      />

      <Input
        label="Joining Date"
        name="startDate"
        type="date"
        value={state.startDate}
        onChange={(e) => setState({ ...state, startDate: e.target.value })}
      />

      <Select
        label="Status"
        name="status"
        value={state.status}
        onChange={(e) => setState({ ...state, status: e.target.value })}
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
          {data ? 'Update Employee' : 'Add Employee'}
        </Button>
      </div>
    </Form>);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4 flex-1 mr-4">
            <Input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="max-w-xs"
            />
            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="max-w-xs"
              options={[
                { value: '', label: 'All Roles' },
                { value: 'COMPANY_ADMIN', label: 'Company Admin' },
                { value: 'COMPANY_MANAGER', label: 'Manager' },
                { value: 'COMPANY_EMPLOYEE', label: 'Employee' }
              ]}
            />
          </div>
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Add Employee
          </Button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <Table
              headers={[
                'Name',
                'Email',
                'Role',
                'Department',
                'Position',
                'Status',
                'Actions'
              ]}
              data={employees.map((employee) => [
                `${employee.firstName} ${employee.lastName}`,
                employee.email,
                employee.role,
                employee.department?.name ?? '_',
                employee.position,
                <span className={`px-2 py-1 rounded-full text-xs ${
                  employee.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.status}
                </span>,
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleShowModal(employee)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteEmployee(employee.id)}
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

export default EmployeeManagement;