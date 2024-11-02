import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, Loading } from '../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const EmployeeClockInOut = () => {
  const [loading, setLoading] = useState(true);
  const [clockedIn, setClockedIn] = useState(false);
  const [lastClockIn, setLastClockIn] = useState(null);
  const [lastClockOut, setLastClockOut] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchClockStatus();
  }, []);

  const fetchClockStatus = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch clock status
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace this with actual API call
      const status = {
        clockedIn: false,
        lastClockIn: new Date(new Date().setHours(9, 0, 0)),
        lastClockOut: new Date(new Date().setHours(17, 0, 0)),
      };
      setClockedIn(status.clockedIn);
      setLastClockIn(status.lastClockIn);
      setLastClockOut(status.lastClockOut);
    } catch (error) {
      console.error('Error fetching clock status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockInOut = async () => {
    setLoading(true);
    try {
      // Simulating API call for clock in/out
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace this with actual API call
      const newStatus = !clockedIn;
      setClockedIn(newStatus);
      if (newStatus) {
        setLastClockIn(new Date());
      } else {
        setLastClockOut(new Date());
      }
    } catch (error) {
      console.error('Error during clock in/out:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Card className="bg-secondary-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary-800">
          <FontAwesomeIcon icon={faClock} className="mr-2" />
          Time Tracker
        </h2>
      </div>
      <div className="mb-4">
        <p className="text-gray-600">Welcome, {user.email}</p>
        <p className="text-gray-600">
          Status: <span className={clockedIn ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
            {clockedIn ? "Clocked In" : "Clocked Out"}
          </span>
        </p>
      </div>
      <div className="mb-4">
        <p className="text-gray-600">Last Clock In: {formatTime(lastClockIn)}</p>
        <p className="text-gray-600">Last Clock Out: {formatTime(lastClockOut)}</p>
      </div>
      <Button
        onClick={handleClockInOut}
        variant={clockedIn ? "secondary" : "primary"}
        className="w-full"
      >
        <FontAwesomeIcon icon={clockedIn ? faSignOutAlt : faSignInAlt} className="mr-2" />
        {clockedIn ? "Clock Out" : "Clock In"}
      </Button>
    </Card>
  );
};

export default EmployeeClockInOut;