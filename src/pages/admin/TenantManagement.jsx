import React, { useState, useEffect } from 'react';
import { useRole } from '../../hooks/useRole';
import tenantService from '../../services/tenantService';
import { Table, Button, Input, Select, Loading, Form } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faBuilding, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useModal } from '../../components/modal';

const TenantManagement = () => {
  const { hasPermission } = useRole();
  const [tenants, setTenants] = useState([]);
  const { showModal, hideModal } = useModal();

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

  const handleOpenModal = (data = null) => {
    let state;
    if (data) {
      state = {name: data.name, industry: data.industry, employeeCount: data.employeeCount, subscriptionPlan: data.subscriptionPlan};
    } else {
      state = { name: '', industry: '', employeeCount: 0, subscriptionPlan: 'Free' };
    }
    showModal(<ModalContent data={data} initalState={state} />,
    {
      title: data ? 'Edit Tenant' : 'Add Tenant'
    });
  };

  const handleCloseModal = () => {
    hideModal();
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

  const ModalContent = ({initalState, data = null}) => {
    const [state, setState] = useState(initalState);

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
          delete state._count;
          await tenantService.updateTenant(data.id, state);
        } else {
          await tenantService.createTenant(state);
        }
        fetchTenants();
        handleCloseModal();
      } catch (error) {
        console.error('Failed to save tenant:', error);
        // Handle error (e.g., show error message to user)
      }
    };

    return (state && <Form onSubmit={handleSubmit}>
      <Input
        label="Name"
        name="name"
        value={state.name}
        onChange={handleInputChange}
        required
      />
      <Input
        label="Industry"
        name="industry"
        value={state.industry}
        onChange={handleInputChange}
        required
      />
      <Input
        label="Employee Count"
        name="employeeCount"
        type="number"
        value={state.employeeCount}
        onChange={handleInputChange}
        required
      />
      <Select
        label="Subscription Plan"
        name="subscriptionPlan"
        value={state.subscriptionPlan}
        onChange={handleInputChange}
        required
        options={[
          { value: 'Free', label: 'Free' },
          { value: 'Basic', label: 'Basic' },
          { value: 'Pro', label: 'Pro' },
          { value: 'Enterprise', label: 'Enterprise' },
        ]}
      />
      <Button type="submit" variant="primary">
        {data ? 'Update Tenant' : 'Create Tenant'}
      </Button>
    </Form>);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tenant Management</h1>
        <Button onClick={() => handleOpenModal()} variant="primary">
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
            <Link to={`${tenant.id}/employees`}>
              <Button variant="secondary">
                <FontAwesomeIcon icon={faPeopleGroup} />
              </Button>
            </Link>
            <Link to={`${tenant.id}/departments`}>
              <Button variant="secondary">
                <FontAwesomeIcon icon={faBuilding} />
              </Button>
            </Link>
            <Button onClick={() => handleOpenModal(tenant)} variant="secondary">
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button onClick={() => handleDelete(tenant.id)} variant="danger">
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        ])}
      />
    </div>
  );
};

export default TenantManagement;