import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../hooks/useRole';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUsers, 
  faMoneyBillWave, 
  faUserPlus, 
  faChartLine, 
  faClock, 
  faTasks, 
  faBuilding,
  faComputer
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { role, hasPermission } = useRole();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: faHome, path: '/', permission: null },
    { name: 'Employees', icon: faUsers, path: '/hr/employees', permission: 'manage_hr' },
    { name: 'Departments', icon: faComputer, path: '/hr/departments', permission: 'manage_hr' },
    { name: 'Payroll', icon: faMoneyBillWave, path: '/hr/payroll', permission: 'manage_hr' },
    { name: 'Recruitment', icon: faUserPlus, path: '/hr/recruitment', permission: 'manage_hr' },
    { name: 'Performance', icon: faChartLine, path: '/manager/performance', permission: 'manage_team' },
    { name: 'Attendance', icon: faClock, path: '/manager/attendance', permission: 'manage_team' },
    { name: 'Tasks', icon: faTasks, path: '/employee/tasks', permission: null },
    { name: 'Tenants', icon: faBuilding, path: '/admin/tenants', permission: 'manage_companies' },
  ];

  return (
    <div className={`bg-primary-800 dark:bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
      <nav>
        {navItems.map((item) => (
          (item.permission === null || hasPermission(item.permission)) && (
            <Link
              key={item.name}
              to={item.path}
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                location.pathname === item.path
                  ? 'bg-primary-600 dark:bg-gray-700 text-white'
                  : 'text-primary-200 dark:text-gray-400 hover:bg-primary-700 dark:hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => toggleSidebar?.()}
            >
              <FontAwesomeIcon icon={item.icon} className={`mr-3 ${location.pathname === item.path ? 'text-secondary-400' : 'text-primary-400 dark:text-gray-500'}`} />
              {item.name}
            </Link>
          )
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;