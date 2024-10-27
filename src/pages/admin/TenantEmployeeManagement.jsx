import React, { useState, useEffect } from 'react';
import { useRole } from '../../hooks/useRole';
import tenantService from '../../services/tenantService';
import departmentService from '../../services/departmentService';
import { Card, Button, Input, Select, Table, Modal, Spinner, Pagination } from '../../components/ui';
import { Form } from '../../components/ui/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faEdit,
  faTrash,
  faBuilding,
  faSearch,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import employeeService from '../../services/employeeService';

const TenantEmployeeManagement = () => {
  const { hasPermission } = useRole();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    fetchTenants();
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [selectedTenant, currentPage, searchTerm, filterRole]);

  const fetchTenants = async () => {
    try {
      const response = await tenantService.getTenants();
      setTenants(response);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
    }
  };

  const fetchDepartments = async () => {
    if (selectedTenant) {
        try {
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
    setIsModalOpen(true);
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
    setIsModalOpen(true);
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
    console.log(formData);
    try {
      if (currentEmployee) {
        await employeeService.updateEmployee(selectedTenant, currentEmployee.id, formData);
      } else {
        await employeeService.createEmployee(selectedTenant, formData);
      }
      setIsModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Failed to save employee:', error);
    }
  };

  if (!hasPermission('manage_companies')) {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Employee Management
          </h2>
          <Select
            label="Select Tenant"
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value != '' ? e.target.value : null)}
            options={[
                { value: '', label: "-- Select Tenant --" },
                ...tenants.map(tenant => ({
                    value: tenant.id,
                    label: tenant.name
                }))
            ]}
          />
        </div>

        {employees && (
          <>
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
              <div className="flex justify-center items-center h-64">
                <Spinner size="large" />
              </div>
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
          </>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentEmployee ? 'Edit Employee' : 'Add Employee'}
      >
        <Form onSubmit={handleSubmit}>
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
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {currentEmployee ? 'Update Employee' : 'Add Employee'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TenantEmployeeManagement;