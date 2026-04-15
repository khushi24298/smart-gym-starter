import { Link, Navigate, Route, Routes } from 'react-router-dom';
import ClassesPage from './pages/ClassesPage';
import CheckInPage from './pages/CheckInPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MemberDashboard from './pages/MemberDashboard';
import BookingHistory from './pages/BookingHistory';
import AdminClassesPage from './pages/AdminClassesPage';
import AdminPlansPage from './pages/AdminPlansPage';
import TrainerRosterPage from './pages/TrainerRosterPage';
import AttendancePage from './pages/AttendancePage';
import AdminStaffPage from './pages/AdminStaffPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const role = user?.role || '';

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { to: '/register', label: 'Register' }
      ];
    }

    if (role === 'member') {
      return [
        { to: '/member/dashboard', label: 'Dashboard' },
        { to: '/classes', label: 'Classes' },
        { to: '/bookings/history', label: 'Booking History' }
      ];
    }

    if (role === 'admin') {
      return [
        { to: '/admin', label: 'Admin Dashboard' },
        { to: '/admin/classes', label: 'Classes' },
        { to: '/admin/plans', label: 'Plans' },
        { to: '/attendance', label: 'Attendance' },
        { to: '/admin/staff', label: 'Trainers & staff' },
        { to: '/checkin', label: 'Check-In' }
      ];
    }

    if (role === 'staff' || role === 'trainer') {
      return [
        { to: '/checkin', label: 'Check-In' },
        { to: '/attendance', label: 'Attendance' },
        { to: '/trainers', label: 'Trainer Roster' }
      ];
    }

    return [{ to: '/', label: 'Login' }];
  };

  return (
    <div className="app-shell">
      <nav className="nav">
        <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2>Smart Gym</h2>
          <span className="brand-subtitle">Train. Track. Transform.</span>
        </Link>
        <div className="nav-links">
          {getNavLinks().map((item) => (
            <Link key={`${item.to}-${item.label}`} to={item.to}>{item.label}</Link>
          ))}
          {isAuthenticated && (
            <>
              <span className="user-chip">{user?.name || 'User'}</span>
              <button type="button" className="nav-button" onClick={() => logout()}>Logout</button>
            </>
          )}
        </div>
      </nav>
      <div className="container">
        <Routes>
          {/* Landing = login only (no separate home at /) */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/classes" element={<ProtectedRoute><ClassesPage /></ProtectedRoute>} />
          <Route
            path="/member/dashboard"
            element={<ProtectedRoute allowedRoles={['member']}><MemberDashboard /></ProtectedRoute>}
          />
          <Route
            path="/bookings/history"
            element={<ProtectedRoute allowedRoles={['member']}><BookingHistory /></ProtectedRoute>}
          />

          <Route path="/checkin" element={<ProtectedRoute allowedRoles={['admin', 'staff', 'trainer']}><CheckInPage /></ProtectedRoute>} />

          <Route
            path="/trainers"
            element={<ProtectedRoute allowedRoles={['admin', 'staff', 'trainer']}><TrainerRosterPage /></ProtectedRoute>}
          />
          <Route
            path="/attendance"
            element={<ProtectedRoute allowedRoles={['admin', 'staff', 'trainer']}><AttendancePage /></ProtectedRoute>}
          />

          <Route
            path="/admin/classes"
            element={<ProtectedRoute allowedRoles={['admin']}><AdminClassesPage /></ProtectedRoute>}
          />
          <Route
            path="/admin/plans"
            element={<ProtectedRoute allowedRoles={['admin']}><AdminPlansPage /></ProtectedRoute>}
          />
          <Route
            path="/admin/staff"
            element={<ProtectedRoute allowedRoles={['admin']}><AdminStaffPage /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
