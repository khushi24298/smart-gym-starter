import { useEffect, useState } from 'react';
import api, { API_ENDPOINTS } from '../services/api';
import StatusMessage from '../components/StatusMessage';

export default function AttendancePage() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.classes);
        setClasses(response.data);
      } catch (error) {
        setErrorMessage('Failed to fetch classes for attendance.');
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedClassId) {
        setBookings([]);
        return;
      }
      try {
        const response = await api.get(API_ENDPOINTS.attendance.byClass(selectedClassId));
        setBookings(response.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to fetch class attendance.');
      }
    };
    fetchAttendance();
  }, [selectedClassId]);

  const updateStatus = async (bookingId, status) => {
    const confirmed = window.confirm(`Mark this member as ${status}?`);
    if (!confirmed) return;

    setMessage('');
    setErrorMessage('');
    try {
      const response = await api.put(API_ENDPOINTS.attendance.update(bookingId), { status });
      setBookings((prev) => prev.map((item) => (item._id === bookingId ? response.data : item)));
      setMessage(`Attendance updated to ${status}.`);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Attendance update failed.');
    }
  };

  return (
    <div className="page">
      <h1>Attendance and No-Show Manager</h1>
      <div className="card">
        <label className="label">Select Class Session</label>
        <select className="input" value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)}>
          <option value="">-- Select a class --</option>
          {classes.map((item) => (
            <option key={item._id} value={item._id}>
              {item.title} ({item.day} {item.time})
            </option>
          ))}
        </select>
      </div>

      <StatusMessage type="info">{message}</StatusMessage>
      <StatusMessage type="error">{errorMessage}</StatusMessage>

      {selectedClassId && bookings.length === 0 && (
        <p>No bookings found for this class session.</p>
      )}

      {bookings.length > 0 && (
        <div className="card table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const isFinalized = ['completed', 'absent', 'no-show', 'cancelled'].includes(booking.status);

                return (
                  <tr key={booking._id}>
                    <td>{booking.memberId?.name || 'Unknown'}</td>
                    <td>{booking.memberId?.email || 'N/A'}</td>
                    <td><span className={`badge ${booking.status}`}>{booking.status}</span></td>
                    <td className="row-actions">
                      <button
                        className="button"
                        onClick={() => updateStatus(booking._id, 'completed')}
                        disabled={isFinalized}
                      >
                        {booking.status === 'completed' ? 'Attended' : 'Mark Attended'}
                      </button>
                      <button
                        className="button danger"
                        onClick={() => updateStatus(booking._id, 'absent')}
                        disabled={isFinalized}
                      >
                        {booking.status === 'absent' ? 'Absent' : 'Mark Absent'}
                      </button>
                      <button
                        className="button danger"
                        onClick={() => updateStatus(booking._id, 'no-show')}
                        disabled={isFinalized}
                      >
                        {booking.status === 'no-show' ? 'No-Show' : 'Mark No-Show'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
