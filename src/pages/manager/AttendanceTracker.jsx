import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Input, Select, Spinner, Modal, Table } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faUserCheck, 
  faUserTimes, 
  faChartBar, 
  faEdit, 
  faSave, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AttendanceTracker = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceTrend, setAttendanceTrend] = useState([]);

  useEffect(() => {
    fetchAttendanceData();
    fetchAttendanceTrend();
  }, []);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch attendance data
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace this with actual API call
      const mockAttendanceData = [
        { id: 1, name: 'John Doe', status: 'Present', timeIn: '09:00', timeOut: '17:30' },
        { id: 2, name: 'Jane Smith', status: 'Late', timeIn: '09:30', timeOut: '18:00' },
        { id: 3, name: 'Mike Johnson', status: 'Absent', timeIn: '-', timeOut: '-' },
      ];
      setAttendanceData(mockAttendanceData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceTrend = async () => {
    try {
      // Simulating API call to fetch attendance trend data
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace this with actual API call
      const mockTrendData = [
        { date: '2024-03-01', presentPercentage: 95 },
        { date: '2024-03-02', presentPercentage: 92 },
        { date: '2024-03-03', presentPercentage: 88 },
        { date: '2024-03-04', presentPercentage: 90 },
        { date: '2024-03-05', presentPercentage: 93 },
      ];
      setAttendanceTrend(mockTrendData);
    } catch (error) {
      console.error('Error fetching attendance trend data:', error);
    }
  };

  const handleEditAttendance = (attendance) => {
    setCurrentAttendance(attendance);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAttendance(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulating API call to update attendance
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace this with actual API call
      setAttendanceData(attendanceData.map(item => 
        item.id === currentAttendance.id ? currentAttendance : item
      ));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    // In a real application, you would fetch attendance data for the selected date here
  };

  if (loading && attendanceData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-white dark:bg-gray-800 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Attendance Tracker</h2>
        <div className="flex justify-between items-center mb-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-48"
          />
          <Button variant="primary">
            <FontAwesomeIcon icon={faChartBar} className="mr-2" />
            Generate Report
          </Button>
        </div>
        <Table
          headers={['Name', 'Status', 'Time In', 'Time Out', 'Actions']}
          data={attendanceData.map(attendance => [
            attendance.name,
            <span className={`px-2 py-1 rounded ${
              attendance.status === 'Present' ? 'bg-green-200 text-green-800' :
              attendance.status === 'Late' ? 'bg-yellow-200 text-yellow-800' :
              'bg-red-200 text-red-800'
            }`}>
              {attendance.status}
            </span>,
            attendance.timeIn,
            attendance.timeOut,
            <Button variant="secondary" onClick={() => handleEditAttendance(attendance)}>
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          ])}
        />
      </Card>

      <Card className="bg-white dark:bg-gray-800 p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={attendanceTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="presentPercentage" stroke="#0ea5e9" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Attendance">
        {currentAttendance && (
          <form onSubmit={handleSubmitAttendance} className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={currentAttendance.name}
              onChange={handleInputChange}
              disabled
            />
            <Select
              label="Status"
              name="status"
              value={currentAttendance.status}
              onChange={handleInputChange}
              options={[
                { value: 'Present', label: 'Present' },
                { value: 'Late', label: 'Late' },
                { value: 'Absent', label: 'Absent' },
              ]}
            />
            <Input
              label="Time In"
              name="timeIn"
              type="time"
              value={currentAttendance.timeIn}
              onChange={handleInputChange}
            />
            <Input
              label="Time Out"
              name="timeOut"
              type="time"
              value={currentAttendance.timeOut}
              onChange={handleInputChange}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AttendanceTracker;