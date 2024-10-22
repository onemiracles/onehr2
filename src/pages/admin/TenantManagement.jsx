import React, { useState, useEffect } from 'react';
import { useRole } from '../../hooks/useRole';
import tenantService from '../../services/tenantService';
import { Table, Button, Modal, Input, Select } from '../../components/ui';
import { Form } from '../../components/ui/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const TenantManagement = () => {
  const { hasPermission } = useRole();
  const [tenants, setTenants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [form, setForm] = useState({ name: '', industry: '', employeeCount: '', subscriptionPlan: '' });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const fetchedTenants = await tenantService.getTenants();
      setTenants(fetchedTenants);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleOpenModal = (tenant = null) => {
    if (tenant) {
      setForm(tenant);
      setEditingTenant(tenant);
    } else {
      setForm({ name: '', industry: '', employeeCount: '', subscriptionPlan: '' });
      setEditingTenant(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTenant(null);
    setForm({ name: '', industry: '', employeeCount: '', subscriptionPlan: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTenant) {
        await tenantService.updateTenant(editingTenant.id, form);
      } else {
        await tenantService.createTenant(form);
      }
      fetchTenants();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save tenant:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      try {
        await tenantService.deleteTenant(id);
        fetchTenants();
      } catch (error) {
        console.error('Failed to delete tenant:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  if (!hasPermission('manage_companies')) {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tenant Management</h1>
        <Button onClick={() => handleOpenModal()} className="bg-primary-600 hover:bg-primary-700 text-white">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Tenant
        </Button>
      </div>

      <Table
        headers={['Name', 'Industry', 'Employee Count', 'Subscription Plan', 'Actions']}
        data={tenants.map((tenant) => [
          tenant.name,
          tenant.industry,
          tenant.employeeCount,
          tenant.subscriptionPlan,
          <div key={tenant.id} className="flex space-x-2">
            <Button onClick={() => handleOpenModal(tenant)} className="bg-secondary-500 hover:bg-secondary-600 text-white">
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button onClick={() => handleDelete(tenant.id)} className="bg-red-500 hover:bg-red-600 text-white">
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        ])}
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTenant ? 'Edit Tenant' : 'Add Tenant'}>
        <Form onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Industry"
            name="industry"
            value={form.industry}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Employee Count"
            name="employeeCount"
            type="number"
            value={form.employeeCount}
            onChange={handleInputChange}
            required
          />
          <Select
            label="Subscription Plan"
            name="subscriptionPlan"
            value={form.subscriptionPlan}
            onChange={handleInputChange}
            required
            options={[
              { value: 'Free', label: 'Free' },
              { value: 'Basic', label: 'Basic' },
              { value: 'Pro', label: 'Pro' },
              { value: 'Enterprise', label: 'Enterprise' },
            ]}
          />
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white mt-4">
            {editingTenant ? 'Update Tenant' : 'Create Tenant'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default TenantManagement;