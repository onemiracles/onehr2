import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Card, Button, Input, Select, Loading, Modal, Table, Progress, ActionButtons, Thumbnail, DocumentViewerModal, Form } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTimes,
  faHourglass,
  faUserClock,
  faCalendarPlus,
  faCalendarCheck,
  faCalendarTimes,
  faFileAlt,
  faEye,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LeaveRequestService from '../../services/LeaveRequestService';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEmployees } from '../../store/employeeSlice';

const LeaveRequests = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [pagination, setPagination] = useState({page: 1});
  const [currentView, setCurrentView] = useState('overview');
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [leaveModalState, setLeaveModalState] = useState({isOpen: false});
  const [detailModalState, setDetailModalState] = useState({isOpen: false, title: 'View Leave Request'});
  const [leaveStats, setLeaveStats] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const leaveRequestService = useMemo(() => new LeaveRequestService(user.tenantId), [user.tenantId]);

  const buttons = useCallback((request) => [
    {
      variant: "secondary",
      caption: "View",
      icon: faEye,
      ariaLabel: "View Leave Request",
      onClick: () => handleOpenDetailModal(request)
    },
    ...(request.status === 'pending' ? [{
      variant: "success",
      caption: "Approve",
      icon: faCheck,
      ariaLabel: "Approve Leave Request",
      onClick: () => handleApproveRequest(request.id)
    },
    {
      variant: "danger",
      caption: "Reject",
      icon: faTimes,
      ariaLabel: "Reject Leave Request",
      onClick: () => handleRejectRequest(request.id)
    }] : []),
    {
      variant: "danger",
      caption: "Delete",
      icon: faTrash,
      ariaLabel: "Delete Leave Request",
      onClick: () => handleDelete(request.id)
    }
  ]);

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchLeaveRequests(),
        fetchLeaveBalance(),
        fetchLeaveStats(),
      ]);
    } catch (error) {
      console.error('Error fetching leave data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveRequests = async () => {
    setLoading(true);
    // Simulate API call
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // const mockLeaveRequests = [
    //   {
    //     id: 1,
    //     employeeName: 'John Doe',
    //     type: 'Vacation',
    //     startDate: '2024-04-01',
    //     endDate: '2024-04-05',
    //     status: 'pending',
    //     totalDays: 5,
    //     reason: 'Annual family vacation',
    //     appliedDate: '2024-03-20',
    //   },
    //   {
    //     id: 2,
    //     employeeName: 'Jane Smith',
    //     type: 'Sick Leave',
    //     startDate: '2024-03-25',
    //     endDate: '2024-03-26',
    //     status: 'approved',
    //     totalDays: 2,
    //     reason: 'Medical appointment',
    //     appliedDate: '2024-03-18',
    //   },
    // ];
    try {
      const response = await leaveRequestService.getLeaveRequests();
      setLeaveRequests(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching leave requests', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveBalance = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockLeaveBalance = {
      vacation: { total: 20, used: 8, pending: 5 },
      sick: { total: 10, used: 3, pending: 0 },
      personal: { total: 5, used: 2, pending: 1 },
      parental: { total: 90, used: 0, pending: 0 },
    };
    setLeaveBalance(mockLeaveBalance);
  };

  const fetchLeaveStats = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockStats = {
      pendingRequests: 12,
      approvedRequests: 45,
      rejectedRequests: 8,
      monthlyTrend: [
        { month: 'Jan', requests: 15, approved: 12 },
        { month: 'Feb', requests: 18, approved: 15 },
        { month: 'Mar', requests: 12, approved: 10 },
        { month: 'Apr', requests: 20, approved: 16 },
      ],
    };
    setLeaveStats(mockStats);
  };

  const handleOpenLeaveModal = useCallback((data = null) => {
    setLeaveModalState(prev => ({...prev, isOpen: true, data, title: data ? 'Edit Leave Request' : 'New Leave Request'}));
  });

  const handleOpenDetailModal = useCallback((data) => {
    setDetailModalState(prev => ({...prev, isOpen: true, data}));
  });

  const handleCloseModal = useCallback(() => {
    setLeaveModalState(prev => ({...prev, isOpen: false}));
    setDetailModalState(prev => ({...prev, isOpen: false}));
  });

  const handleApproveRequest = useCallback(async (requestId) => {
    try {
      await leaveRequestService.updateStatus(requestId, 'approved');
      fetchLeaveData();
    } catch (error) {
      console.error("Failed to approve request", error);
    }
  });

  const handleRejectRequest = useCallback(async (requestId) => {
    try {
      await leaveRequestService.updateStatus(requestId, 'rejected');
      fetchLeaveData();
    } catch (error) {
      console.error("Failed to reject request", error);
    }
  });

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) {
      return;
    }

    try {
      await leaveRequestService.deleteLeaveRequest(id);
      fetchLeaveRequests();
    } catch (error) {
      console.error('Failed to delete leave request:', error);
    }
  });

  const LeaveOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary-50 dark:bg-primary-900 p-6">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-primary-100 dark:bg-primary-800">
              <FontAwesomeIcon 
                icon={faHourglass} 
                className="text-2xl text-primary-600 dark:text-primary-400" 
              />
            </div>
            <div className="ml-4">
              <h3 className="text-primary-900 dark:text-primary-100 text-sm font-medium">
                Pending Requests
              </h3>
              <p className="text-primary-700 dark:text-primary-300 text-2xl font-bold">
                {leaveStats.pendingRequests}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900 p-6">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-800">
              <FontAwesomeIcon 
                icon={faCalendarCheck} 
                className="text-2xl text-green-600 dark:text-green-400" 
              />
            </div>
            <div className="ml-4">
              <h3 className="text-green-900 dark:text-green-100 text-sm font-medium">
                Approved
              </h3>
              <p className="text-green-700 dark:text-green-300 text-2xl font-bold">
                {leaveStats.approvedRequests}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900 p-6">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-800">
              <FontAwesomeIcon 
                icon={faCalendarTimes} 
                className="text-2xl text-red-600 dark:text-red-400" 
              />
            </div>
            <div className="ml-4">
              <h3 className="text-red-900 dark:text-red-100 text-sm font-medium">
                Rejected
              </h3>
              <p className="text-red-700 dark:text-red-300 text-2xl font-bold">
                {leaveStats.rejectedRequests}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-secondary-50 dark:bg-secondary-900 p-6">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-secondary-100 dark:bg-secondary-800">
              <FontAwesomeIcon 
                icon={faUserClock} 
                className="text-2xl text-secondary-600 dark:text-secondary-400" 
              />
            </div>
            <div className="ml-4">
              <h3 className="text-secondary-900 dark:text-secondary-100 text-sm font-medium">
                Available Days
              </h3>
              <p className="text-secondary-700 dark:text-secondary-300 text-2xl font-bold">
                {leaveBalance.vacation.total - leaveBalance.vacation.used}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Leave Requests Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={leaveStats.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="requests" 
              stroke="#0ea5e9" 
              name="Total Requests"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="approved" 
              stroke="#10b981" 
              name="Approved"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-white dark:bg-gray-800 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Leave Balance
        </h3>
        <div className="space-y-4">
          {Object.entries(leaveBalance).map(([type, balance]) => (
            <div key={type} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {balance.used + balance.pending}/{balance.total} days used
                </span>
              </div>
              <Progress
                value={(balance.used + balance.pending) / balance.total * 100}
                color={
                  (balance.used + balance.pending) / balance.total > 0.8
                    ? 'red'
                    : (balance.used + balance.pending) / balance.total > 0.5
                    ? 'yellow'
                    : 'green'
                }
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const LeaveRequestForm = memo(({ data = null}) => {
    const initialState = data ? {
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      employeeId: data.employeeId,
      reason: data.reason,
      attachment: null,
    } : {
      type: '',
      startDate: '',
      endDate: '',
      reason: '',
      employeeId: '',
      attachment: null,
    }
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(initialState);
    const [attachments, setAttachments] = useState([]);
    const allEmployees = useSelector((state) => state.employees[user.tenantId]?.allEmployees?.data);

    useEffect(() => {
      if (!allEmployees) {
        dispatch(fetchAllEmployees({ tenantId: user.tenantId }));
      }
    }, [dispatch, allEmployees]);
    
    const handleChange = useCallback(async (e) => {
      let { name, value, type } = e.target;
      if (type === 'number') {
        value = Number(value);
      }
      setFormData(prev => ({ ...prev, [name]: value }));
    });

    const handleAttachments = useCallback(async (e) => {
      let { files  } = e.target;
      files = files ? Array.from(files) : [];
      setAttachments(files); 
    });

    const handleSubmit = useCallback(async (e) => {
      try {
        if (data) {
          await leaveRequestService.updateLeaveRequest(data.id, formData);
        } else {
          const leaveRequest = await leaveRequestService.createLeaveRequest(formData);
          await leaveRequestService.uploadAttactments(leaveRequest.id, attachments)
        }
        handleCloseModal();
        fetchLeaveRequests();
      } catch (error) {
        console.error('Error submitting leave request:', error);
      }
    });

    return (
      <Form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Employee"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          required
        >
          <option value="">--Select Leave Employee--</option>
          {allEmployees?.map((emp) => {
            return (<option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName ?? ''}</option>);
          })}
        </Select>

        <Select
          label="Leave Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Select Leave Type</option>
          <option value="vacation">Vacation</option>
          <option value="sick">Sick Leave</option>
          <option value="personal">Personal Leave</option>
          <option value="parental">Parental Leave</option>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          <Input
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Reason"
          name="reason"
          type="textarea"
          value={formData.reason}
          onChange={handleChange}
          required
          rows={3}
        />

        <Input
          label="Attachments (optional)"
          name="attachments"
          type="file"
          onChange={handleAttachments}
          multiple
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit Request
          </Button>
        </div>
      </Form>
    );
  });

  const LeaveRequestDetails = memo(({ request, onClose }) => {
    const [attachmentModalState, setAttachmentModalState] = useState({isOpen: false});

    const handleOpenAttachmentModal = useCallback((attachment) => {
      setAttachmentModalState(prev => ({...prev, isOpen: true, attachment}));
    });
  
    const handleCloseAttachmentModal = useCallback(() => {
      setAttachmentModalState(prev => ({...prev, isOpen: false}));
    });

    return (<>
      <Modal isOpen={attachmentModalState.isOpen} onClose={handleCloseAttachmentModal} >
        <DocumentViewerModal url={`${process.env.REACT_APP_ATTACTMENT_URL}/${attachmentModalState.attachment?.filename}`} />
      </Modal>

      <div className="space-y-6 w-[640px]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Employee
            </label>
            <p className="text-gray-900 dark:text-white">{request.employee.firstName} {request.employee.lastName ?? ''}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Leave Type
            </label>
            <p className="text-gray-900 dark:text-white">{request.type}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Start Date
            </label>
            <p className="text-gray-900 dark:text-white">{formatDate(request.startDate)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              End Date
            </label>
            <p className="text-gray-900 dark:text-white">{formatDate(request.endDate)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Days
            </label>
            <p className="text-gray-900 dark:text-white">{request.totalDays} days</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Status
            </label>
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
              request.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : request.status === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
        </div>
  
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Reason
          </label>
          <p className="text-gray-900 dark:text-white mt-1">{request.reason}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Attachments
          </label>
          <div className="mt-1 flex">
            {request.attachments && request.attachments.map((attactment, index) => (<Button key={index} variant="white" onClick={() => handleOpenAttachmentModal(attactment)}>
              <Thumbnail url={process.env.REACT_APP_ATTACTMENT_URL + '/' + attactment.filename} />
            </Button>)
            )}
          </div>
        </div>
  
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Request Timeline
          </h4>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Request submitted on {formatDate(request.createdAt)}
              </span>
            </div>
            {request.status !== 'pending' && (
              <div className="flex items-center text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                } mr-2`} />
                <span className="text-gray-600 dark:text-gray-300">
                  Request {request.status} on {formatDate(request.updatedAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>);
  });

  if (loading) {
    return <Loading />;
  }

  return (<>
    <Modal isOpen={leaveModalState.isOpen} onClose={handleCloseModal} title={leaveModalState.title} >
      <LeaveRequestForm data={leaveModalState.data} onClose={handleCloseModal} />
    </Modal>
    <Modal isOpen={detailModalState.isOpen} onClose={handleCloseModal} title={detailModalState.title} >
      <LeaveRequestDetails request={detailModalState.data} onClose={handleCloseModal} />
    </Modal>

    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Leave Management
        </h2>
        <Button variant="primary" onClick={() => handleOpenLeaveModal()}>
          <FontAwesomeIcon icon={faCalendarPlus} className="mr-2" />
          New Leave Request
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Leave Requests
            </h3>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-48"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>

          <Table
            headers={['Employee', 'Type', 'Duration', 'Status', 'Actions']}
            data={leaveRequests
              .filter(request => filterStatus === 'all' || request.status === filterStatus)
              .map(request => [
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {request.employee.firstName} {request.employee.lastName ?? ''}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Applied: {formatDate(request.createdAt)}
                  </p>
                </div>,
                request.type,
                <div>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {request.totalDays} days
                  </p>
                </div>,
                <span className={`px-2 py-1 rounded-full text-xs ${
                  request.status === 'approved'
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : request.status === 'rejected'
                    ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>,
                <ActionButtons buttons={buttons(request)} />
              ])}
          />
        </div>
      </Card>

      {/* <LeaveOverview /> */}
    </div>
  </>);
};


export default LeaveRequests;