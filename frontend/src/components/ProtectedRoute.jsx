import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function defaultPathForRole(role) {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'member':
      return '/member/dashboard';
    case 'staff':
    case 'trainer':
      return '/checkin';
    default:
      return '/';
  }
}

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={defaultPathForRole(user.role)} replace />;
  }

  return children;
}
