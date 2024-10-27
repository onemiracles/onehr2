import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Spinner } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faChartLine,
  faUserPlus,
  faCog,
  faHistory,
  faExclamationTriangle,
  faInfoCircle,
  faCheckCircle,
  faSync,
  faDollarSign,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import { Link } from 'react-router-dom';
import tenantService from '../../services/tenantService';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const { subscriptionPlans, fetchTenantData } = useTenant();
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await Promise.all([
        fetchTenants(),
        fetchSubscriptionStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    // Simulate API call
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // const mockTenants = [
    //   {
    //     id: 1,
    //     name: 'TechCorp Inc',
    //     plan: 'Pro',
    //     status: 'active',
    //     employeeCount: 150,
    //     subscriptionStartDate: '2024-01-01',
    //     subscriptionEndDate: '2024-12-31',
    //     mrr: 3750,
    //     usage: {
    //       employees: 150,
    //       storage: 35,
    //       departments: 12
    //     }
    //   },
    //   {
    //     id: 2,
    //     name: 'Healthcare Plus',
    //     plan: 'Enterprise',
    //     status: 'active',
    //     employeeCount: 500,
    //     subscriptionStartDate: '2024-02-01',
    //     subscriptionEndDate: '2025-01-31',
    //     mrr: 10000,
    //     usage: {
    //       employees: 500,
    //       storage: 125,
    //       departments: 25
    //     }
    //   },
    //   // Add more mock tenants...
    // ];
    // setTenants(mockTenants);

    try {
      const response = await tenantService.getTenants();
      setTenants(response);
      // setFilteredTenants(response);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      // Handle error (show notification)
    }
  };

  const fetchSubscriptionStats = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockStats = {
      totalMRR: 25000,
      activeSubscriptions: 45,
      trialSubscriptions: 12,
      churnRate: 2.5,
      planDistribution: [
        { name: 'Free', value: 20 },
        { name: 'Basic', value: 35 },
        { name: 'Pro', value: 30 },
        { name: 'Enterprise', value: 15 }
      ],
      revenueHistory: [
        { month: 'Jan', mrr: 20000 },
        { month: 'Feb', mrr: 22000 },
        { month: 'Mar', mrr: 23500 },
        { month: 'Apr', mrr: 25000 },
      ]
    };
    setStats(mockStats);
  };

  const handleChangePlan = async (tenant) => {
    setSelectedTenant(tenant);
    setModalContent('changePlan');
    setIsModalOpen(true);
  };

  const handleViewUsage = (tenant) => {
    setSelectedTenant(tenant);
    setModalContent('viewUsage');
    setIsModalOpen(true);
  };

  const handleUpdateSubscription = async (newPlan) => {
    // Simulate API call
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTenants(tenants.map(t => 
        t.id === selectedTenant.id 
          ? { ...t, plan: newPlan }
          : t
      ));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = "primary" }) => (
    <Card className={`bg-${color}-50 dark:bg-${color}-900 p-6`}>
      <div className="flex items-center">
        <div className={`p-4 rounded-full bg-${color}-100 dark:bg-${color}-800`}>
          <FontAwesomeIcon 
            icon={icon} 
            className={`text-2xl text-${color}-600 dark:text-${color}-400`} 
          />
        </div>
        <div className="ml-4">
          <h3 className={`text-${color}-900 dark:text-${color}-100 text-sm font-medium`}>
            {title}
          </h3>
          <p className={`text-${color}-700 dark:text-${color}-300 text-2xl font-bold`}>
            {value}
          </p>
        </div>
      </div>
    </Card>
  );

  const ChangePlanModal = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Change Subscription Plan for {selectedTenant?.name}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(subscriptionPlans).map(([key, plan]) => (
          <Card
            key={key}
            className={`p-4 cursor-pointer hover:shadow-lg transition-shadow ${
              selectedTenant?.plan === plan.name
                ? 'border-2 border-primary-500'
                : ''
            }`}
            onClick={() => handleUpdateSubscription(plan.name)}
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {plan.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Up to {plan.maxEmployees} employees
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
              ${plan.price}/month
            </p>
          </Card>
        ))}
      </div>
    </div>
  );

  const UsageModal = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Usage Statistics for {selectedTenant?.name}
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Employees</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {selectedTenant?.usage.employees}/{subscriptionPlans[selectedTenant?.plan.toLowerCase()]?.maxEmployees}
            </span>
          </div>
          <Progress 
            value={(selectedTenant?.usage.employees / subscriptionPlans[selectedTenant?.plan.toLowerCase()]?.maxEmployees) * 100} 
            color="primary" 
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Storage</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {selectedTenant?.usage.storage}/{subscriptionPlans[selectedTenant?.plan.toLowerCase()]?.maxStorageGB} GB
            </span>
          </div>
          <Progress 
            value={(selectedTenant?.usage.storage / subscriptionPlans[selectedTenant?.plan.toLowerCase()]?.maxStorageGB) * 100} 
            color="primary" 
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Departments</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {selectedTenant?.usage.departments}/{subscriptionPlans[selectedTenant?.plan.toLowerCase()]?.maxDepartments}
            </span>
          </div>
          <Progress 
            value={(selectedTenant?.usage.departments / subscriptionPlans[selectedTenant?.plan.toLowerCase()]?.maxDepartments) * 100} 
            color="primary" 
          />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Subscription Management
        </h1>
        <Button variant="primary" onClick={fetchData}>
          <FontAwesomeIcon icon={faSync} className="mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Recurring Revenue"
          value={`$${stats.totalMRR.toLocaleString()}`}
          icon={faDollarSign}
          color="green"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          icon={faCheckCircle}
          color="blue"
        />
        <StatCard
          title="Trial Subscriptions"
          value={stats.trialSubscriptions}
          icon={faCalendarAlt}
          color="yellow"
        />
        <StatCard
          title="Churn Rate"
          value={`${stats.churnRate}%`}
          icon={faExclamationTriangle}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mrr" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Plan Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.planDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary-50">
          <h3 className="text-xl font-semibold text-primary-800 mb-4">Manage Companies</h3>
          <p className="text-gray-600 mb-4">Oversee and manage all companies in the system.</p>
          <Link to="/admin/tenants">
            <Button variant="primary">
              <FontAwesomeIcon icon={faBuilding} className="mr-2" />
              View Companies
            </Button>
          </Link>
        </Card>
        <Card className="bg-secondary-50">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Global Reports</h3>
          <p className="text-gray-600 mb-4">Access and analyze system-wide reports and statistics.</p>
          <Button variant="secondary">
            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
            Generate Reports
          </Button>
        </Card>
      </div>

      {/* Tenant List */}
      <Card className="overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tenant Subscriptions
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Employees
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    MRR
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Renewal Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {tenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {tenant.name}
                      </div>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${tenant.subscriptionPlan === 'Free' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' :
                          tenant.subscriptionPlan === 'Basic' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                          tenant.subscriptionPlan === 'Pro' ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' :
                          'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100'}`}
                      >
                        {tenant.subscriptionPlan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${tenant.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                        'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}
                      >
                        {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {tenant.employeeCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${tenant.mrr.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {tenant.subscriptionEndDate ?? '_'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => handleChangePlan(tenant)}
                        >
                          <FontAwesomeIcon icon={faCog} className="mr-1" />
                          Change Plan
                        </Button>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => handleViewUsage(tenant)}
                        >
                          <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                          Usage
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Coming Up for Renewal */}
      <Card className="bg-white dark:bg-gray-800">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Coming Up for Renewal
          </h2>
          <div className="space-y-4">
            {tenants
              .filter(tenant => {
                if (tenant.subscriptionEndDate) {
                  const daysUntilRenewal = Math.ceil(
                    (new Date(tenant.subscriptionEndDate) - new Date()) / (1000 * 60 * 60 * 24)
                  );
                  return daysUntilRenewal <= 30;
                }
                return false;
              })
              .map(tenant => (
                <div 
                  key={tenant.id}
                  className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {tenant.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Renews on {tenant.subscriptionEndDate}
                    </p>
                  </div>
                  <Button variant="secondary" size="small">
                    Contact Tenant
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent === 'changePlan' ? 'Change Subscription Plan' : 'Usage Statistics'}
      >
        {modalContent === 'changePlan' ? (
          <ChangePlanModal />
        ) : modalContent === 'viewUsage' ? (
          <UsageModal />
        ) : null}
      </Modal>
    </div>
  );
};

const Progress = ({ value, color = 'primary' }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
    <div
      className={`bg-${color}-600 h-2.5 rounded-full`}
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {title}
            </h3>
            {children}
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;