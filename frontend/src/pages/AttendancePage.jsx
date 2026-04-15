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
    const load = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.classes);
        setClasses(res.data);
      } catch (error) {
        setErrorMessage('Failed to load classes.');
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadBookings = async () => {
      if (!selectedClassId) {
        setBookings([]);
        return;
      }
      try {
        const res = await api.get(API_ENDPOINTS.attendance.byClass(selectedClassId));
        setBookings(res.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to load attendance.');
      }
    };
    loadBookings();
  }, [selectedClassId]);

  const updateStatus = async (bookingId, status) => {
    if (!window.confirm(`Set attendance to "${status}"?`)) return;
    setMessage('');
    setErrorMessage('');
    try {
      const res = await api.put(API_ENDPOINTS.attendance.update(bookingId), { status });
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? res.data : b)));
      setMessage(`Updated to ${status}.`);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <div className="page">
      <h1>Attendance &amp; No-Show</h1>
      <div className="card">
        <label className="label">Class session</label>
        <select
          className="input"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
        >
          <option value="">— Select a class —</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title} ({c.day} {c.time})
            </option>
          ))}
        </select>
      </div>
      <StatusMessage type="info">{message}</StatusMessage>
      <StatusMessage type="error">{errorMessage}</StatusMessage>

      {selectedClassId && bookings.length === 0 && <p>No bookings for this class.</p>}

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
                const finalized = ['completed', 'absent', 'no-show', 'cancelled'].includes(booking.status);
                return (
                  <tr key={booking._id}>
                    <td>{booking.memberId?.name || '—'}</td>
                    <td>{booking.memberId?.email || '—'}</td>
                    <td><span className={`badge ${booking.status}`}>{booking.status}</span></td>
                    <td className="row-actions">
                      <button type="button" className="button" disabled={finalized} onClick={() => updateStatus(booking._id, 'completed')}>Attended</button>
                      <button type="button" className="button danger" disabled={finalized} onClick={() => updateStatus(booking._id, 'absent')}>Absent</button>
                      <button type="button" className="button danger" disabled={finalized} onClick={() => updateStatus(booking._id, 'no-show')}>No-Show</button>
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
