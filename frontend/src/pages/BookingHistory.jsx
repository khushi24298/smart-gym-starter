import { useEffect, useState } from 'react';
import api, { API_ENDPOINTS } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusMessage from '../components/StatusMessage';

export default function BookingHistory() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cancellingId, setCancellingId] = useState('');

  const loadBookings = async () => {
    if (!user?._id) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await api.get(API_ENDPOINTS.bookings.byUser(user._id));
      setBookings(response.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to load booking history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmed) return;

    setCancellingId(bookingId);
    setMessage('');
    setErrorMessage('');
    try {
      await api.put(API_ENDPOINTS.bookings.cancel(bookingId));
      setBookings((prev) =>
        prev.map((booking) => (
          booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
        ))
      );
      setMessage('Booking cancelled successfully.');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId('');
    }
  };

  return (
    <div className="page">
      <h1>Booking History</h1>
      <StatusMessage type="info">{message}</StatusMessage>
      <StatusMessage type="error">{errorMessage}</StatusMessage>

      {isLoading && <p>Loading booking history...</p>}
      {!isLoading && bookings.length === 0 && (
        <p>You have no class bookings yet. Start by browsing available classes.</p>
      )}

      {!isLoading && bookings.length > 0 && (
        <div className="grid">
          {bookings.map((booking) => {
            const gymClass = booking.classId || {};
            const isCancelled = booking.status === 'cancelled';

            return (
              <div className="card" key={booking._id}>
                <h3>{gymClass.title || 'Class not available'}</h3>
                <p><strong>Trainer:</strong> {gymClass.trainerName || 'Not available'}</p>
                <p><strong>Date:</strong> {gymClass.day || 'Not available'}</p>
                <p><strong>Time:</strong> {gymClass.time || 'Not available'}</p>
                <p><strong>Status:</strong> <span className={`badge ${booking.status}`}>{booking.status}</span></p>
                <button
                  className="button danger"
                  onClick={() => handleCancel(booking._id)}
                  disabled={isCancelled || cancellingId === booking._id}
                >
                  {isCancelled ? 'Cancelled' : cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
