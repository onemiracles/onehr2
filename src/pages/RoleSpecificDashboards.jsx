import React from 'react';
import { Card, Button } from '../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBuilding, faChartLine, faCalendarAlt, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import Dashboard from '../components/Dashboard';

export const SuperAdminDashboard = () => {
  return (
    <Dashboard>
      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Super Admin Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary-50">
          <h3 className="text-xl font-semibold text-primary-800 mb-4">Manage Companies</h3>
          <p className="text-gray-600 mb-4">Oversee and manage all companies in the system.</p>
          <Button variant="primary">
            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
            View Companies
          </Button>
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
    </Dashboard>
  );
};

export const CompanyAdminDashboard = () => {
  return (
    <Dashboard>
      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Company Admin Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary-50">
          <h3 className="text-xl font-semibold text-primary-800 mb-4">Employee Management</h3>
          <p className="text-gray-600 mb-4">Manage your company's employees and departments.</p>
          <Button variant="primary">
            <FontAwesomeIcon icon={faUsers} className="mr-2" />
            Manage Employees
          </Button>
        </Card>
        <Card className="bg-secondary-50">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Company Reports</h3>
          <p className="text-gray-600 mb-4">View and generate reports for your company.</p>
          <Button variant="secondary">
            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
            View Reports
          </Button>
        </Card>
      </div>
    </Dashboard>
  );
};

export const CompanyManagerDashboard = () => {
  return (
    <Dashboard>
      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Manager Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary-50">
          <h3 className="text-xl font-semibold text-primary-800 mb-4">Team Attendance</h3>
          <p className="text-gray-600 mb-4">Monitor and manage your team's attendance.</p>
          <Button variant="primary">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
            View Attendance
          </Button>
        </Card>
        <Card className="bg-secondary-50">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Performance Reviews</h3>
          <p className="text-gray-600 mb-4">Conduct and manage performance reviews for your team.</p>
          <Button variant="secondary">
            <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
            Start Review
          </Button>
        </Card>
      </div>
    </Dashboard>
  );
};

export const CompanyEmployeeDashboard = () => {
  return (
    <Dashboard>
      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Employee Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary-50">
          <h3 className="text-xl font-semibold text-primary-800 mb-4">My Attendance</h3>
          <p className="text-gray-600 mb-4">View and manage your attendance records.</p>
          <Button variant="primary">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
            Check In/Out
          </Button>
        </Card>
        <Card className="bg-secondary-50">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">My Payslips</h3>
          <p className="text-gray-600 mb-4">Access and download your payslips.</p>
          <Button variant="secondary">
            <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
            View Payslips
          </Button>
        </Card>
      </div>
    </Dashboard>
  );
};