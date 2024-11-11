import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import tenantService from '../../services/tenantService';
import EmployeeManagement from '../../components/EmployeeManagement';
import { Card } from '../../components/ui';

const TenantEmployeeManagement = () => {
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
            Employee Management
          </h2>
          {/* <Select
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
          /> */}
        </div>

        {selectedTenant && (
          <EmployeeManagement selectedTenant={selectedTenant} />
        )}
      </Card>
    </div>
  );
};

export default TenantEmployeeManagement;