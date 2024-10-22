const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const containersDir = path.join(__dirname, 'src', 'containers');

const pages = [
  'Dashboard',
  'AdminDashboard',
  'ManagerDashboard',
  'EmployeeDashboard',
  'EmployeeList',
  'Profile',
  'Login',
  'Register',
  'AttendanceTracker',
  'PayrollManagement',
  'RecruitmentPortal',
  'PerformanceReview',
  'Unauthorized'
];

const containers = [
  'AdminDashboardContainer',
  'ManagerDashboardContainer',
  'EmployeeDashboardContainer'
];

function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

function createPlaceholderFile(dir, filename) {
  const filePath = path.join(dir, `${filename}.jsx`);
  const content = `import React from 'react';

const ${filename} = () => {
  return (
    <div>
      <h1>${filename}</h1>
      {/* Add your ${filename} component logic here */}
    </div>
  );
};

export default ${filename};
`;

  fs.writeFileSync(filePath, content);
  console.log(`Created file: ${filePath}`);
}

// Create directories
createDir(pagesDir);
createDir(containersDir);

// Create page files
pages.forEach(page => createPlaceholderFile(pagesDir, page));

// Create container files
containers.forEach(container => createPlaceholderFile(containersDir, container));

console.log('Placeholder files generation complete!');