import React, { useState, useEffect, useCallback } from 'react';
import { useRole } from '../../hooks/useRole';
import { Card, Button, Input, Select, Table, Form, Loading, Pagination, Modal } from '../../components/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatDate } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faEdit,
  faTrash,
  faLock,
  faUnlock,
  faKey,
  faUsers,
  faCheckCircle,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import userService from '../../services/userService';
import tenantService from '../../services/tenantService';

const UserManagement = () => {
  const { hasPermission } = useRole();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [stats, userStats] = useState({});
  const [tenants, setTenants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userModalState, setUserModalState] = useState({isOpen: false});
  const [passwordModalState, setPasswordModalState] = useState({isOpen: false});

  // Chart colors for department statistics
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    tenant: '',
    status: ''
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams({
        page: currentPage,
        ...filters
      });
      const response = await userService.getUsers(params);
      setUsers(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  const fetchUserStats = useCallback(async () => {
    const response = await userService.getStats()
    userStats(response);
  }, []);

  const fetchTenants = useCallback(async () => {
    try {
      const response = await tenantService.getTenants();
      setTenants(response);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
    }
  }, []);

  useEffect(() => {fetchUsers();}, [fetchUsers]);
  useEffect(() => {fetchUserStats();}, [fetchUserStats]);
  useEffect(() => {fetchTenants();}, [fetchTenants]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      await userService.updateStatus(user.id, user.status === 'active' ? 'inactive' : 'active');
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleHideModal = () => {
    setUserModalState(prev => ({...prev, isOpen: false}));
  }

  const handleShowModal = (type, data = null) => {
    if (type === 'user') {
      setUserModalState(prev => ({...prev, isOpen: true, data, title: data ? "Edit User" : "Add New User"}));
    } else if (type === 'password') {
      setPasswordModalState(prev => ({...prev, isOpen: true, data: data.id, title: `Reset user "${data.firstName} ${data.lastName}" password`}));
    }
  }

  if (!hasPermission('manage_companies')) {
    return <div>You do not have permission to access this page.</div>;
  }

  const UserModalContent = ({data = null}) => {
    const [state, setState] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      tenantId: '',
      status: 'active',
      position: '',
      startDate: '',
      department: ''
    });
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
      const newState = data ? {
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
        role: data.role ?? '',
        tenantId: data.tenantId ?? '',
        status: data.status ?? '',
        position: data.position ?? '',
        startDate: data.startDate ? formatDate(data.startDate, 'calendar') : '',
        department: data.departmentId ?? ''
      } : {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        tenantId: '',
        status: 'active',
        position: '',
        startDate: '',
        department: ''
      }; 
      setState(newState);
    }, [data])
    

    useEffect(() => {
      if (state.tenantId) {
        const tenant = tenants.find((e) => e.id === state.tenantId);
        setDepartments(tenant.departments);
      } else {
        setDepartments([]);
      }
    }, [state.tenantId])

    const handleSubmit = async (e) => {
      // e.preventDefault();
      try {
          if (data) {
            await userService.updateUser(data.id, state);
          } else {
            await userService.creatUser(state);
          }
          fetchUsers();
          handleHideModal();
      } catch (error) {
          console.error('Failed to save user:', error);
      }
    };

    return(<Form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={state.firstName}
          onChange={(e) => setState({ ...state, firstName: e.target.value })}
          required
        />
        <Input
          label="Last Name"
          value={state.lastName}
          onChange={(e) => setState({ ...state, lastName: e.target.value })}
        />
      </div>

      <Input
        label="Email"
        type="email"
        value={state.email}
        onChange={(e) => setState({ ...state, email: e.target.value })}
        required
      />

      <Input
        label="Phone"
        value={state.phone}
        onChange={(e) => setState({ ...state, phone: e.target.value })}
      />

      <Select
        label="Role"
        value={state.role}
        onChange={(e) => setState({ ...state, role: e.target.value })}
        required
        options={[
          { value: '', label: 'Select Role' },
          { value: 'SUPER_ADMIN', label: 'Super Admin' },
          { value: 'COMPANY_ADMIN', label: 'Company Admin' },
          { value: 'COMPANY_MANAGER', label: 'Company Manager' },
          { value: 'COMPANY_EMPLOYEE', label: 'Company Employee' }
        ]}
      />

      <Select
        label="Tenant"
        value={state.tenantId}
        onChange={(e) => setState({ ...state, tenantId: e.target.value })}
        required={state.role !== 'SUPER_ADMIN'}
        options={[
          { value: '', label: 'No Tenant' },
          ...tenants.map(tenant => ({
            value: tenant.id,
            label: tenant.name
          }))
        ]}
      />

      <Select
        label="Department"
        value={state.department}
        onChange={(e) => setState({ ...state, department: e.target.value })}
        options={[
          { value: '', label: 'No Department' },
          ...departments.map(dept => ({ value: dept.id, label: dept.name }))
        ]}
      />

      <Input
        label="Position"
        value={state.position}
        onChange={(e) => setState({ ...state, position: e.target.value })}
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
        value={state.status}
        onChange={(e) => setState({ ...state, status: e.target.value })}
        required
        options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'suspended', label: 'Suspended' }
        ]}
      />

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="secondary" onClick={() => handleHideModal()}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {data ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </Form>);
  };

  const PasswordModalContent = ({data}) => {
    const [state, setState] = useState({newPassword: '', confirmPassword: ''});
    
    const handlePasswordResetSubmit = async () => {
      if (state.newPassword !== state.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      try {
        await userService.updatePassword(data, state.newPassword);
        handleHideModal();
      } catch (error) {
        console.error('Failed to reset password:', error);
      }
    };

    return (<Form onSubmit={handlePasswordResetSubmit}>
      <Input
        label="New Password"
        type="password"
        value={state.newPassword}
        onChange={(e) => setState({ ...state, newPassword: e.target.value })}
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        value={state.confirmPassword}
        onChange={(e) => setState({ ...state, confirmPassword: e.target.value })}
        required
      />
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="secondary" onClick={() => handleHideModal()}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Reset Password
        </Button>
      </div>
    </Form>);
  };

  return (<>
    <Modal isOpen={userModalState.isOpen} title={userModalState.title} onClose={handleHideModal} >
      <UserModalContent data={userModalState.data} />
    </Modal>
    <Modal isOpen={passwordModalState.isOpen} title={passwordModalState.title} onClose={handleHideModal} >
      <PasswordModalContent data={passwordModalState.data} />
    </Modal>

    <div className="space-y-6">
      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            User Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="col-span-2"
            />

            <Select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              options={[
                { value: '', label: 'All Roles' },
                { value: 'SUPER_ADMIN', label: 'Super Admin' },
                { value: 'COMPANY_ADMIN', label: 'Company Admin' },
                { value: 'COMPANY_MANAGER', label: 'Company Manager' },
                { value: 'COMPANY_EMPLOYEE', label: 'Company Employee' }
              ]}
            />

            <Select
              value={filters.tenant}
              onChange={(e) => handleFilterChange('tenant', e.target.value)}
              options={[
                { value: '', label: 'All Tenants' },
                ...tenants.map(tenant => ({
                  value: tenant.id,
                  label: tenant.name
                }))
              ]}
            />

            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended' }
              ]}
            />
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <Button variant="primary" onClick={() => handleShowModal('user')}>
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Add User
          </Button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <Table
              headers={[
                'User',
                'Role',
                'Tenant',
                'Status',
                'Last Login',
                'Actions'
              ]}
              data={users.map((user) => [
                <div>
                  <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>,
                user.role,
                user.tenant?.name || 'N/A',
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : user.status === 'suspended'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.status}
                </span>,
                user.lastLoginAt ? (new Date(user.lastLoginAt)).toUTCString() : 'Never',
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleShowModal('user', user)}
                    title="Edit User"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => toggleUserStatus(user)}
                    title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                  >
                    <FontAwesomeIcon icon={user.status === 'active' ? faLock : faUnlock} />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleShowModal('password', user)}
                    title="Reset Password"
                  >
                    <FontAwesomeIcon icon={faKey} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteUser('password', user.id)}
                    title="Delete User"
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

      {/* User Stats Card */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-full p-3">
                <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <p className="text-lg font-semibold text-gray-900">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
                <p className="text-lg font-semibold text-gray-900">{stats?.activeUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                <FontAwesomeIcon icon={faClock} className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Recent Logins</h3>
                <p className="text-lg font-semibold text-gray-900">{stats?.recentLogins || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
                <FontAwesomeIcon icon={faLock} className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Suspended Users</h3>
                <p className="text-lg font-semibold text-gray-900">{stats?.suspendedUsers || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Department Distribution Chart */}
        {stats?.departmentDistribution && <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Department Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.departmentDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {stats.departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>}
      </Card>
    </div>
  </>);
};

export default UserManagement;