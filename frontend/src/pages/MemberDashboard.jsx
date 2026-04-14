import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MemberDashboard() {
  const { user } = useAuth();
  const membershipStatus = user?.membershipStatus || null;

  return (
    <div className="page page-narrow">
      <section className="dashboard-hero card">
        <h1>Welcome back, {user?.name || 'Member'}!</h1>
        <p>Keep your momentum going. Book a class and stay on track this week.</p>
      </section>

      <section className="dashboard-stats grid">
        <div className="card stat-card">
          <p className="stat-label">Membership</p>
          <h3 className="stat-value">{membershipStatus || 'Not available'}</h3>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Account Role</p>
          <h3 className="stat-value">{user?.role || 'member'}</h3>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Quick Goal</p>
          <h3 className="stat-value">3 Workouts / Week</h3>
        </div>
      </section>

      <section className="grid">
        <div className="card action-card">
          <h3>Browse Classes</h3>
          <p>Discover upcoming sessions and reserve your spot in seconds.</p>
          <Link className="link-button" to="/classes">Explore Classes</Link>
        </div>
        <div className="card action-card">
          <h3>Booking History</h3>
          <p>Track your booked, waitlisted, and cancelled class records.</p>
          <Link className="link-button" to="/bookings/history">View History</Link>
        </div>
      </section>

      <div className="card subtle-card">
        <h3>Membership Summary</h3>
        {membershipStatus ? (
          <p>Your membership is currently <strong>{membershipStatus}</strong>. Great job staying active!</p>
        ) : (
          <p>Membership details are not available right now.</p>
        )}
      </div>
    </div>
  );
}
