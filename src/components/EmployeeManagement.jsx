import React, { useState, useEffect, useCallback, useMemo } from 'react';
import EmployeeService from '../services/EmployeeService';
import { useRole } from '../hooks/useRole';
import { Modal, Form, Card, Button, Input, Select, Table, Loading, Pagination } from '../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faEdit, faTrash, faUserCircle, faEnvelope, faPhone, faBriefcase, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllDepartment } from '../store/departmentSlice';
import { fetchAllEmployees } from '../store/employeeSlice';

const EmployeeManagement = ({ selectedTenant, display = 'table' }) => {
  const { hasPermission } = useRole();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterRole, setFilterRole] = useState('');
  const [modalState, setModalState] = useState({isOpen: false});
  
  const employeeService = useMemo(() => new EmployeeService(selectedTenant), [selectedTenant]);

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

  useEffect(() => {fetchEmployees();}, [fetchEmployees]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      await employeeService.deleteEmployee(employeeId)
      fetchEmployees();
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  const handleShowModal = (data = null) => {
    setModalState(prev => ({...prev, isOpen: true, data, title: data ? 'Edit Employee' : 'Add New Employee'}));
  };

  const handleCloseModal = () => {
    setModalState(prev => ({...prev, isOpen: false}));
  };

  if (!hasPermission('manage_hr')) {
    return <div>You do not have permission to access this page.</div>;
  }

  const ModalContent = ({data = null}) => {
    const dispatch = useDispatch();
    const allDepartment = useSelector((state) => state.departments[selectedTenant]?.allDepartment?.data);
    const [state, setState] = useState({
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
    });

    useEffect(() => {
      if (!allDepartment) {
        dispatch(fetchAllDepartment({ tenantId: selectedTenant }));
      }
    }, [dispatch, allDepartment])
    

    useEffect(() => {
      const newState = data ? {
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        phone: data.phone ?? '',
        email: data.email ?? '',
        role: data.role ?? '',
        tenantId: data.tenantId ?? '',
        departmentId: data.departmentId ?? '',
        position: data.position ?? '',
        startDate: data.startDate ? formatDate(data.startDate, 'calendar') : '',
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
      setState(newState);
    }, [data])
    

    const handleInputChange = (e) => {
      let { name, value, type } = e.target;
      if (type === 'number') {
        value = Number(value);
      }
      setState({ ...state, [name]: value });
    };

    const handleSubmit = async (e) => {
      try {
        if (data) {
          await employeeService.updateEmployee(data.id, state);
        } else {
          await employeeService.createEmployee(state);
        }
        handleCloseModal();
        fetchEmployees();
        dispatch(fetchAllEmployees({ tenantId: selectedTenant }));
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
          onChange={handleInputChange}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={state.lastName}
          onChange={handleInputChange}
        />
      </div>
      
      <Input
        label="Phone"
        name="phone"
        value={state.phone}
        onChange={handleInputChange}
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={state.email}
        onChange={handleInputChange}
        required
      />

      <Select
        label="Role"
        name="role"
        value={state.role}
        onChange={handleInputChange}
        required
        options={[
          { value: 'COMPANY_ADMIN', label: 'Company Admin' },
          { value: 'COMPANY_MANAGER', label: 'Manager' },
          { value: 'COMPANY_EMPLOYEE', label: 'Employee' }
        ]}
      />

      <Select
        label="Department"
        name="departmentId"
        value={state.departmentId}
        onChange={handleInputChange}
        options={[
            { value: '', label: 'No Department' },
            ...(allDepartment ? allDepartment.map((e) => {
                return { value: e.id, label: e.name }
            }) : [])
        ]}
      />

      <Input
        label="Position"
        name="position"
        value={state.position}
        onChange={handleInputChange}
      />

      <Input
        label="Joining Date"
        name="startDate"
        type="date"
        value={state.startDate}
        onChange={handleInputChange}
      />

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
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {data ? 'Update Employee' : 'Add Employee'}
        </Button>
      </div>
    </Form>);
  };

  const EmployeeCard = ({ employee }) => {
    let formattedDate = 'N/A';
    if (employee.startDate) {
      formattedDate = formatDate(employee.startDate);
    }
    return (
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
            <Button variant="secondary" onClick={() => handleShowModal(employee)}>
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
            <span className="text-sm text-gray-600 dark:text-gray-300">{employee.email ?? 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPhone} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{employee.phone ?? 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faBriefcase} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{employee.department?.name ?? 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{formattedDate}</span>
          </div>
        </div>
        <div className="mt-2">
          <span className={`inline-block px-2 py-1 rounded-full text-xs ${employee.status === 'active' ? 'bg-green-100 text-green-800' :
              employee.status === 'inactive' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'}`}>
            {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
          </span>
        </div>
      </Card>
    );
  };

  return (<>
    <Modal isOpen={modalState.isOpen} title={modalState.title} onClose={handleCloseModal} >
      <ModalContent data={modalState.data} />
    </Modal>

    <div className="space-y-6">
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
          {display === 'table' ? <Table
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
          : <div className="grid grid-cols-1 gap-4">
            {employees.map(employee => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>}

          <Pagination
            currentPage={currentPage}
            total={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  </>);
};

export default EmployeeManagement;