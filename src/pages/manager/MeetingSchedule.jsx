import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Input, Select, Spinner, Modal, Checkbox } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faClock, 
  faUsers, 
  faListUl, 
  faPaperPlane, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';

const MeetingSchedule = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    participants: [],
    agenda: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduledMeetings, setScheduledMeetings] = useState([]);

  useEffect(() => {
    fetchTeamMembers();
    fetchScheduledMeetings();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch team members
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace this with actual API call
      const mockTeamMembers = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
        { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com' },
      ];
      setTeamMembers(mockTeamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledMeetings = async () => {
    try {
      // Simulating API call to fetch scheduled meetings
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace this with actual API call
      const mockScheduledMeetings = [
        { id: 1, title: 'Weekly Team Sync', date: '2024-03-25', startTime: '10:00', endTime: '11:00' },
        { id: 2, title: 'Project Review', date: '2024-03-27', startTime: '14:00', endTime: '15:30' },
      ];
      setScheduledMeetings(mockScheduledMeetings);
    } catch (error) {
      console.error('Error fetching scheduled meetings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleParticipantToggle = (participantId) => {
    setFormData(prevData => ({
      ...prevData,
      participants: prevData.participants.includes(participantId)
        ? prevData.participants.filter(id => id !== participantId)
        : [...prevData.participants, participantId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulating API call to schedule meeting
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Replace this with actual API call
      console.log('Scheduling meeting:', formData);
      // Add the new meeting to the list of scheduled meetings
      setScheduledMeetings([...scheduledMeetings, { ...formData, id: Date.now() }]);
      setIsModalOpen(false);
      // Reset form data
      setFormData({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        participants: [],
        agenda: '',
      });
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && teamMembers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-white dark:bg-gray-800 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Team Meetings</h2>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
            Schedule New Meeting
          </Button>
        </div>

        {scheduledMeetings.length > 0 ? (
          <ul className="space-y-4">
            {scheduledMeetings.map(meeting => (
              <li key={meeting.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{meeting.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  {meeting.date}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  {meeting.startTime} - {meeting.endTime}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No meetings scheduled yet.</p>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Team Meeting">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Meeting Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
          <div className="flex space-x-4">
            <Input
              label="Start Time"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleInputChange}
              required
            />
            <Input
              label="End Time"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Participants
            </label>
            {teamMembers.map(member => (
              <Checkbox
                key={member.id}
                label={member.name}
                checked={formData.participants.includes(member.id)}
                onChange={() => handleParticipantToggle(member.id)}
              />
            ))}
          </div>
          <Input
            label="Agenda"
            name="agenda"
            type="textarea"
            rows={4}
            value={formData.agenda}
            onChange={handleInputChange}
            placeholder="Enter meeting agenda..."
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MeetingSchedule;