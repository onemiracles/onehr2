import React, { memo, useEffect } from 'react';
import { default as DepartmentManagementComponent } from '../../components/DepartmentManagement';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartmentStats } from '../../store/departmentSlice';
import { useRole } from '../../hooks/useRole';

const COLORS = ['#0ea5e9', '#ec4899', '#10b981', '#f59e0b', '#6366f1', '#8b5cf6'];

const DepartmentManagement = () => {
  const { user } = useAuth();
  const { hasPermission } = useRole();
  
  if (!hasPermission('manage_hr')) {
    return <div>You do not have permission to access this page.</div>;
  }

  const DepartmentStatsComponent = memo(() => {
    const dispatch = useDispatch();
    const departmentStats = useSelector((state) => state.departments[user.tenantId]?.departmentStats);

    useEffect(() => {
      if (!departmentStats) {
        dispatch(fetchDepartmentStats({ tenantId: user.tenantId }));
      }
    }, [dispatch, departmentStats]);

    const chartData = departmentStats?.distribution?.map(dept => ({
      name: dept.departmentName,
      value: dept.departmentBudget
    }));

    return (departmentStats && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 bg-white dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Employee Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-white dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Department Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
            <p className="text-sm text-primary-600 dark:text-primary-400">Total Departments</p>
            <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
              {departmentStats.totalDepartments}
            </p>
          </div>
          <div className="bg-secondary-50 dark:bg-secondary-900 p-4 rounded-lg">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Employees</p>
            <p className="text-2xl font-bold text-secondary-700 dark:text-secondary-300">
              {departmentStats.totalEmployees}
            </p>
          </div>
        </div>
      </Card>
    </div>)
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Department Management
        </h2>
      </div>

      <DepartmentManagementComponent selectedTenant={user.tenantId} />

      <DepartmentStatsComponent />

    </div>
  );
};

export default DepartmentManagement;