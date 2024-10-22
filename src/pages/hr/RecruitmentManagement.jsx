import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Spinner, Modal, Table, Progress } from '../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faBriefcase,
  faListAlt,
  faFilter,
  faEye,
  faEdit,
  faTrash,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faChartBar,
  faCalendarAlt,
  faEnvelope,
  faPhone,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RecruitmentManagement = () => {
  const [loading, setLoading] = useState(true);
  const [jobPostings, setJobPostings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [currentView, setCurrentView] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [recruitmentStats, setRecruitmentStats] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    fetchRecruitmentData();
  }, []);

  const fetchRecruitmentData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await Promise.all([
        fetchJobPostings(),
        fetchCandidates(),
        fetchRecruitmentStats(),
      ]);
    } catch (error) {
      console.error('Error fetching recruitment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobPostings = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockJobPostings = [
      {
        id: 1,
        title: 'Senior Software Engineer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        status: 'Open',
        applications: 24,
        postedDate: '2024-03-01',
        salary: '120k - 150k',
        description: 'We are seeking an experienced software engineer...',
        requirements: ['7+ years experience', 'React expertise', 'System design'],
      },
      {
        id: 2,
        title: 'Product Manager',
        department: 'Product',
        location: 'New York',
        type: 'Full-time',
        status: 'Open',
        applications: 18,
        postedDate: '2024-03-05',
        salary: '130k - 160k',
        description: 'Looking for a strategic product manager...',
        requirements: ['5+ years experience', 'B2B SaaS', 'Agile methodology'],
      },
    ];
    setJobPostings(mockJobPostings);
  };

  const fetchCandidates = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockCandidates = [
      {
        id: 1,
        name: 'John Doe',
        position: 'Senior Software Engineer',
        status: 'Interview',
        email: 'john.doe@email.com',
        phone: '(555) 123-4567',
        experience: '8 years',
        appliedDate: '2024-03-10',
        source: 'LinkedIn',
        rating: 4,
        interviews: [
          { round: 'Technical', date: '2024-03-15', status: 'Completed' },
          { round: 'System Design', date: '2024-03-20', status: 'Scheduled' },
        ],
      },
      {
        id: 2,
        name: 'Jane Smith',
        position: 'Product Manager',
        status: 'Offered',
        email: 'jane.smith@email.com',
        phone: '(555) 987-6543',
        experience: '6 years',
        appliedDate: '2024-03-08',
        source: 'Referral',
        rating: 5,
        interviews: [
          { round: 'Initial', date: '2024-03-12', status: 'Completed' },
          { round: 'Technical', date: '2024-03-18', status: 'Completed' },
        ],
      },
    ];
    setCandidates(mockCandidates);
  };

  const fetchRecruitmentStats = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockStats = {
      openPositions: 8,
      activeApplications: 42,
      interviewsScheduled: 12,
      offersExtended: 3,
      timeToHire: 25, // days
      applicationTrend: [
        { month: 'Jan', applications: 35 },
        { month: 'Feb', applications: 42 },
        { month: 'Mar', applications: 38 },
        { month: 'Apr', applications: 45 },
      ],
    };
    setRecruitmentStats(mockStats);
  };

  const handleAddJobPosting = () => {
    setModalContent('newJob');
    setIsModalOpen(true);
  };

  const handleViewCandidate = (candidate) => {
    setModalContent({ type: 'viewCandidate', data: candidate });
    setIsModalOpen(true);
  };

  const handleScheduleInterview = (candidate) => {
    setModalContent({ type: 'scheduleInterview', data: candidate });
    setIsModalOpen(true);
  };

  const RecruitmentOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary-50 dark:bg-primary-900 p-6">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-primary-100 dark:bg-primary-800">
              <FontAwesomeIcon icon={faBriefcase} className="text-2xl text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-primary-900 dark:text-primary-100 text-sm font-medium">
                Open Positions
              </h3>
              <p className="text-primary-700 dark:text-primary-300 text-2xl font-bold">
                {recruitmentStats.openPositions}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-secondary-50 dark:bg-secondary-900 p-6">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-secondary-100 dark:bg-secondary-800">
              <FontAwesomeIcon icon={faUserPlus} className="text-2xl text-secondary-600 dark:text-secondary-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-secondary-900 dark:text-secondary-100 text-sm font-medium">
                Active Applications
              </h3>
              <p className="text-secondary-700 dark:text-secondary-300 text-2xl font-bold">
                {recruitmentStats.activeApplications}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-primary-50 dark:bg-primary-900 p-6">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-primary-100 dark:bg-primary-800">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-2xl text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-primary-900 dark:text-primary-100 text-sm font-medium">
                Interviews Scheduled
              </h3>
              <p className="text-primary-700 dark:text-primary-300 text-2xl font-bold">
                {recruitmentStats.interviewsScheduled}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-secondary-50 dark:bg-secondary-900 p-6">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-secondary-100 dark:bg-secondary-800">
              <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-secondary-600 dark:text-secondary-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-secondary-900 dark:text-secondary-100 text-sm font-medium">
                Offers Extended
              </h3>
              <p className="text-secondary-700 dark:text-secondary-300 text-2xl font-bold">
                {recruitmentStats.offersExtended}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Application Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={recruitmentStats.applicationTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="applications" stroke="#0ea5e9" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );

  const JobPostings = () => (
    <Card className="bg-white dark:bg-gray-800">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Job Postings
          </h3>
          <Button variant="primary" onClick={handleAddJobPosting}>
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Add Job Posting
          </Button>
        </div>

        <Table
          headers={['Title', 'Department', 'Location', 'Applications', 'Status', 'Actions']}
          data={jobPostings.map(job => [
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{job.type}</p>
            </div>,
            job.department,
            job.location,
            `${job.applications} candidates`,
            <span className={`px-2 py-1 rounded-full text-xs ${
              job.status === 'Open' 
                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
            }`}>
              {job.status}
            </span>,
            <div className="flex space-x-2">
              <Button variant="secondary" onClick={() => {}}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button variant="danger" onClick={() => {}}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          ])}
        />
      </div>
    </Card>
  );

  const Candidates = () => (
    <Card className="bg-white dark:bg-gray-800">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Candidates
          </h3>
          <div className="flex space-x-4">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-40"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
            </Select>
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-40"
            >
              <option value="all">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="product">Product</option>
              <option value="design">Design</option>
            </Select>
          </div>
        </div>

        <Table
          headers={['Candidate', 'Position', 'Status', 'Applied Date', 'Actions']}
          data={candidates.map(candidate => [
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.email}</p>
            </div>,
            candidate.position,
            <span className={`px-2 py-1 rounded-full text-xs ${
              candidate.status === 'Interview' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                : candidate.status === 'Offered'
                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
            }`}>
              {candidate.status}
            </span>,
            candidate.appliedDate,
            <div className="flex space-x-2">
              <Button variant="secondary" onClick={() => handleViewCandidate(candidate)}>
                <FontAwesomeIcon icon={faEye} />
              </Button>
              <Button variant="primary" onClick={() => handleScheduleInterview(candidate)}>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </Button>
            </div>
          ])}
        />
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Recruitment Management
        </h2>
        <div className="flex space-x-