import React, { useState, useEffect } from 'react';
import { useRole } from '../../hooks/useRole';
import { Card, Button, Input, Select, Table, Form, Loading, Pagination } from '../../components/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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
import { useModal } from '../../components/modal';

const UserManagement = () => {
  const { hasPermission } = useRole();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isShowEditModal, setIsEditShowModal] = useState(false);
  const { showModal, hideModal } = useModal();

  // Chart colors for department statistics
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    tenant: '',
    status: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    tenantId: '',
    status: 'active',
    position: '',
    department: ''
  });

  // Password reset form
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filters]);

  useEffect(() => {
    if (isShowEditModal && formData && currentUser) {
        handleShowModal('edit');
    }
  }, [isShowEditModal, formData, currentUser]);

  const fetchTenants = async () => {
    try {
      const response = await tenantService.getTenants();
      setTenants(response);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
    }
  };

  const fetchUsers = async () => {
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
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      tenantId: '',
      status: 'active',
      position: '',
      department: ''
    });
    handleShowModal('edit');
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      tenantId: user.tenantId,
      status: user.status,
      position: user.position,
      department: user.department
    });
    setIsEditShowModal(true);
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    try {
        if (currentUser) {
          await userService.updateUser(currentUser.id, formData);
        } else {
          await userService.creatUser(formData);
        }
        fetchUsers();
        handleHideModal();
    } catch (error) {
        console.error('Failed to save user:', error);
    }
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

  const handleResetPassword = async (userId) => {
    setCurrentUser(users.find(u => u.id === userId));
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setIsResetPasswordModalOpen(true);
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Replace with actual API call
      await fetch(`/api/admin/users/${currentUser.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordForm.newPassword })
      });
      setIsResetPasswordModalOpen(false);
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      // Replace with actual API call
      await fetch(`/api/admin/users/${user.id}/toggle-status`, {
        method: 'POST'
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleHideModal = () => {
    hideModal();
  }

  const handleShowModal = (type) => {
    setIsEditShowModal(false);
    if (type === 'edit') {
        showModal(
            <Form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
        
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
        
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
        
              <Select
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                options={[
                  { value: 'SUPER_ADMIN', label: 'Super Admin' },
                  { value: 'COMPANY_ADMIN', label: 'Company Admin' },
                  { value: 'COMPANY_MANAGER', label: 'Company Manager' },
                  { value: 'COMPANY_EMPLOYEE', label: 'Company Employee' }
                ]}
              />
        
              <Select
                label="Tenant"
                value={formData.tenantId}
                onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                required={formData.role !== 'SUPER_ADMIN'}
                options={[
                  { value: '', label: 'Select Tenant' },
                  ...tenants.map(tenant => ({
                    value: tenant.id,
                    label: tenant.name
                  }))
                ]}
              />
        
              <Input
                label="Position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
        
              <Input
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
        
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                  {currentUser ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </Form>,
            {
                title: currentUser ? "Edit User" : "Add New User"
            });
    } else if (type === 'password') {
        showModal(<Form onSubmit={handlePasswordResetSubmit}>
            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
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
    }

  }

  if (!hasPermission('manage_companies')) {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
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
          <Button variant="primary" onClick={handleAddUser}>
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
                    onClick={() => handleEditUser(user)}
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
                    onClick={() => handleResetPassword(user.id)}
                    title="Reset Password"
                  >
                    <FontAwesomeIcon icon={faKey} />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDeleteUser(user.id)}
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

        {/* Role Distribution Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Role Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;