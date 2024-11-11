import React, { useState, useEffect } from 'react';
import { useRole } from '../../hooks/useRole';
import DepartmentManagement from '../../components/DepartmentManagement';
import tenantService from '../../services/tenantService';
import { Card, Button, Input, Select, Table, Modal, Spinner, Pagination } from '../../components/ui';
import { useParams } from 'react-router-dom';

const TenantDepartmentManagement = () => {
  const { hasPermission } = useRole();
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState('');
  const { id } = useParams();

  useEffect(() => {
    // fetchTenants();
    setSelectedTenant(id);
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await tenantService.getTenants();
      setTenants(response);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
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
            Department Management
          </h2>
          {/* <Select
            label="Select Tenant"
            value={selectedTenant ?? -1}
            onChange={(e) => setSelectedTenant(e.target.value == -1 ? null : e.target.value)}
            options={[
                { value: -1, label: "-- Select Tenant --" },
                ...tenants.map(tenant => ({
                    value: tenant.id,
                    label: tenant.name
                }))
            ]}
          /> */}
        </div>

        {selectedTenant && (
          <DepartmentManagement selectedTenant={selectedTenant} />
        )}
      </Card>
    </div>
  );
};

export default TenantDepartmentManagement;