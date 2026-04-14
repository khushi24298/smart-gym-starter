export default function ClassCard({ gymClass, bookingState, onBook }) {
  const availableSlots = Math.max((gymClass.capacity || 0) - (gymClass.bookedCount || 0), 0);
  const isFull = availableSlots === 0;
  const hasBooked = bookingState === 'booked' || bookingState === 'waitlisted';
  const disableBook = isFull || hasBooked;

  return (
    <div className="card">
      <h3>{gymClass.title}</h3>
      <p><strong>Trainer:</strong> {gymClass.trainerName}</p>
      <p><strong>Date:</strong> {gymClass.day || 'Not available'}</p>
      <p><strong>Time:</strong> {gymClass.time || 'Not available'}</p>
      <p><strong>Available Slots:</strong> {availableSlots}</p>
      <p><strong>Description:</strong> {gymClass.description || 'No description available.'}</p>

      <button
        className="button"
        onClick={() => onBook(gymClass._id)}
        disabled={disableBook}
      >
        {hasBooked ? 'Already Booked' : isFull ? 'Class Full' : 'Book Class'}
      </button>
    </div>
  );
}
