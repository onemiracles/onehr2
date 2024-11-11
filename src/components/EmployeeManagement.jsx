import React, { useState, useEffect } from 'react';
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
  faBuilding,
  faSearch,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

const EmployeeManagement = ({ selectedTenant }) => {
  const { hasPermission } = useRole();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterRole, setFilterRole] = useState('all');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    tenantId: '',
    departmentId: '',
    position: '',
    status: 'active'
  });
  const [ toggledModal, setToggledModal ] = useState(null);
  const employeeService = new EmployeeService(selectedTenant);

  const { showModal, hideModal } = useModal();

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [currentPage, searchTerm, filterRole]);

  useEffect(() => {
    if (!toggledModal) {
      return;
    }
    if (toggledModal === 'edit' && !currentEmployee) {
      return;
    }

    setToggledModal(null);

    showModal(<Form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <Select
        label="Role"
        name="role"
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
        value={formData.departmentId}
        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
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
        value={formData.position}
        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
        required
      />

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
        <Button variant="secondary" onClick={() => hideModal()}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {currentEmployee ? 'Update Employee' : 'Add Employee'}
        </Button>
      </div>
    </Form>,
    {
      title: currentEmployee ? 'Edit Employee' : 'Add Employee'
    });
  }, [toggledModal, currentEmployee]);

  const fetchDepartments = async () => {
    if (selectedTenant) {
        try {
          const departmentService = new DepartmentService(selectedTenant);
          const response = await departmentService.getDepartments(selectedTenant);
          setDepartments(response.data);
        } catch (error) {
          console.error('Failed to fetch employees:', error);
        }
    } else {
        setEmployees(null);
    }
  };

  const fetchEmployees = async () => {
    if (selectedTenant) {
        setLoading(true);
        try {
          const response = await employeeService.getEmployees(selectedTenant);
          setEmployees(response.data);
          setTotalPages(response.pagination.total);
        } catch (error) {
          console.error('Failed to fetch employees:', error);
        } finally {
          setLoading(false);
        }
    } else {
        setEmployees(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      tenantId: selectedTenant,
      departmentId: '',
      position: '',
      status: 'active'
    });
    handleShowModal('add');
  };

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      role: employee.role,
      tenantId: employee.tenantId,
      departmentId: employee.departmentId,
      position: employee.position,
      status: employee.status
    });
    handleShowModal('edit');
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

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (formData.departmentId == '') {
        delete formData.departmentId;
    }
    try {
      if (currentEmployee) {
        await employeeService.updateEmployee(selectedTenant, currentEmployee.id, formData);
      } else {
        await employeeService.createEmployee(selectedTenant, formData);
      }
      hideModal();
      fetchEmployees();
    } catch (error) {
      console.error('Failed to save employee:', error);
    }
  };

  const handleShowModal = (type) => {
    setToggledModal(type);
  };

  if (!hasPermission('manage_companies')) {
    return <div>You do not have permission to access this page.</div>;
  }

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
                { value: 'all', label: 'All Roles' },
                { value: 'COMPANY_ADMIN', label: 'Company Admin' },
                { value: 'COMPANY_MANAGER', label: 'Manager' },
                { value: 'COMPANY_EMPLOYEE', label: 'Employee' }
              ]}
            />
          </div>
          <Button variant="primary" onClick={handleAddEmployee}>
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
                    onClick={() => handleEditEmployee(employee)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="secondary"
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