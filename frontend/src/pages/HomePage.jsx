import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <div className="page">
      <div className="card dashboard-hero">
        <h1>Smart Gym Portal</h1>
        <p>
          {role
            ? `Welcome back, ${user?.name || 'User'}. Use your ${role} tools below.`
            : 'Plan workouts, reserve classes, and manage your gym journey from one place.'}
        </p>
      </div>
      <div className="grid">
        {!role && (
          <>
            <div className="card">
              <h3>Members</h3>
              <p>Login or register to access classes, booking history, and your dashboard.</p>
              <Link className="link-button" to="/login">Member Login</Link>
            </div>
            <div className="card">
              <h3>Staff and Trainers</h3>
              <p>Use your account to view role-specific check-in, roster, and attendance tools.</p>
              <Link className="link-button" to="/login">Staff/Trainer Login</Link>
            </div>
          </>
        )}

        {role === 'member' && (
          <>
            <div className="card">
              <h3>Member Dashboard</h3>
              <p>See membership summary and your quick actions.</p>
              <Link className="link-button" to="/member/dashboard">Open Dashboard</Link>
            </div>
            <div className="card">
              <h3>Book Classes</h3>
              <p>Browse available sessions and reserve your spot.</p>
              <Link className="link-button" to="/classes">Browse Classes</Link>
            </div>
          </>
        )}

        {(role === 'staff' || role === 'trainer') && (
          <>
            <div className="card">
              <h3>Check-In Scanner</h3>
              <p>Validate member QR/member code and view result status.</p>
              <Link className="link-button" to="/checkin">Open Check-In</Link>
            </div>
            <div className="card">
              <h3>Attendance Actions</h3>
              <p>Mark attended, absent, and no-show for class sessions.</p>
              <Link className="link-button" to="/attendance">Manage Attendance</Link>
            </div>
          </>
        )}

        {role === 'admin' && (
          <>
            <div className="card">
              <h3>Admin Reports</h3>
              <p>View key numbers for members, check-ins, classes, and bookings.</p>
              <Link className="link-button" to="/admin">Open Dashboard</Link>
            </div>
            <div className="card">
              <h3>Manage Classes & Plans</h3>
              <p>Create, edit, and delete classes and membership plans.</p>
              <Link className="link-button" to="/admin/classes">Manage Classes</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
