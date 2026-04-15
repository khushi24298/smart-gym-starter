import { useEffect, useState } from 'react';
import api, { API_ENDPOINTS } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusMessage from '../components/StatusMessage';
import ClassCard from '../components/ClassCard';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [bookingInProgressId, setBookingInProgressId] = useState('');
  const { user } = useAuth();

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const classResponse = await api.get(API_ENDPOINTS.classes);
      setClasses(classResponse.data);

      if (user?._id) {
        const bookingsResponse = await api.get(API_ENDPOINTS.bookings.byUser(user._id));
        setBookings(bookingsResponse.data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to load classes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getBookingStateByClassId = (classId) => {
    const activeBooking = bookings.find(
      (booking) => booking.classId?._id === classId && booking.status !== 'cancelled'
    );
    return activeBooking?.status || null;
  };

  const handleBook = async (classId) => {
    if (!user?._id) {
      setActionMessage('Please login to book a class.');
      return;
    }

    setActionMessage('');
    setBookingInProgressId(classId);
    try {
      const payload = { memberId: user._id, classId };
      const response = await api.post(API_ENDPOINTS.bookings.create, payload);
      const status = response.data.status === 'waitlisted' ? 'waitlisted' : 'booked';
      setActionMessage(`Class ${status} successfully.`);
      await loadData();
    } catch (error) {
      setActionMessage(error.response?.data?.message || 'Booking failed.');
    } finally {
      setBookingInProgressId('');
    }
  };

  return (
    <div className="page">
      <h1>Browse Classes</h1>
      <StatusMessage type="error">{errorMessage}</StatusMessage>
      <StatusMessage type="info">{actionMessage}</StatusMessage>

      {isLoading && <p>Loading classes...</p>}
      {!isLoading && classes.length === 0 && (
        <p>No classes available right now. Please check again later.</p>
      )}

      <div className="grid">
        {classes.map((item) => (
          <div key={item._id} className={bookingInProgressId === item._id ? 'card loading' : ''}>
            <ClassCard
              gymClass={item}
              bookingState={getBookingStateByClassId(item._id)}
              onBook={handleBook}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
