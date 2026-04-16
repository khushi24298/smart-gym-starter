import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ClassesPage from './pages/ClassesPage';
import CheckInPage from './pages/CheckInPage';
import AdminPage from './pages/AdminPage';
import TrainerRosterPage from './pages/TrainerRosterPage';
import AttendancePage from './pages/AttendancePage';
import AdminClassesPage from './pages/AdminClassesPage';
import AdminPlansPage from './pages/AdminPlansPage';
import AdminStaffPage from './pages/AdminStaffPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MemberDashboard from './pages/MemberDashboard';
import BookingHistory from './pages/BookingHistory';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const role = user?.role || '';
  const hideNav =
    !isAuthenticated && (pathname === '/' || pathname === '/register');

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { to: '/', label: 'Login' },
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
        { to: '/admin/classes', label: 'Manage Classes' },
        { to: '/admin/plans', label: 'Plans' },
        { to: '/admin/staff', label: 'Trainers & staff' },
        { to: '/attendance', label: 'Attendance' }
      ];
    }

    if (role === 'staff' || role === 'trainer') {
      return [
        { to: '/checkin', label: 'Check-In' },
        { to: '/attendance', label: 'Attendance' },
        { to: '/trainers', label: 'Trainer Roster' }
      ];
    }

    // Fallback for any unknown role.
    return [
      { to: '/classes', label: 'Classes' }
    ];
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app-shell">
      {!hideNav && (
        <nav className="nav">
          <div className="brand">
            <h2>Smart Gym</h2>
            <span className="brand-subtitle">Train. Track. Transform.</span>
          </div>
          <div className="nav-links">
            {getNavLinks().map((item) => (
              <Link key={`${item.to}-${item.label}`} to={item.to}>{item.label}</Link>
            ))}
            {isAuthenticated && (
              <>
                <span className="user-chip">{user?.name || 'User'}</span>
                <button className="nav-button" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </nav>
      )}
      <div className="container">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/classes"
            element={<ProtectedRoute><ClassesPage /></ProtectedRoute>}
          />
          <Route
            path="/member/dashboard"
            element={<ProtectedRoute allowedRoles={['member']}><MemberDashboard /></ProtectedRoute>}
          />
          <Route
            path="/bookings/history"
            element={<ProtectedRoute allowedRoles={['member']}><BookingHistory /></ProtectedRoute>}
          />
          <Route path="/checkin" element={<CheckInPage />} />
          <Route
            path="/trainers"
            element={<ProtectedRoute allowedRoles={['staff', 'trainer']}><TrainerRosterPage /></ProtectedRoute>}
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
