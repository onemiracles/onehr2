import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { default as DepartmentManagementComponent } from '../../components/DepartmentManagement';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui';
import DepartmentService from '../../services/DepartmentService';

const COLORS = ['#0ea5e9', '#ec4899', '#10b981', '#f59e0b', '#6366f1', '#8b5cf6'];

const DepartmentManagement = () => {
  const { user } = useAuth();
  const departmentService = useMemo(() => new DepartmentService(user.tenantId), [user.tenantId]);
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await departmentService.getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  }, [departmentService]);

  useEffect(() => {fetchDepartments()}, [fetchDepartments]);

  const DepartmentDistributionChart = ({departments}) => {
    const data = departments.map(dept => ({
      name: dept.name,
      value: dept.employees.length
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Department Management
        </h2>
      </div>

      <DepartmentManagementComponent selectedTenant={user.tenantId} />

      {departments && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white dark:bg-gray-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Employee Distribution
          </h3>
          <DepartmentDistributionChart departments={departments} />
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Department Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
              <p className="text-sm text-primary-600 dark:text-primary-400">Total Departments</p>
              <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                {departments.length}
              </p>
            </div>
            <div className="bg-secondary-50 dark:bg-secondary-900 p-4 rounded-lg">
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Employees</p>
              <p className="text-2xl font-bold text-secondary-700 dark:text-secondary-300">
                {departments.reduce((sum, dept) => sum + dept.employees.length, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>}

    </div>
  );
};

export default DepartmentManagement;