import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ClassesPage from './pages/ClassesPage';
import CheckInPage from './pages/CheckInPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <div>
      <nav className="nav">
        <h2>Smart Gym</h2>
        <div>
          <Link to="/">Home</Link>
          <Link to="/classes">Classes</Link>
          <Link to="/checkin">Check-In</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/checkin" element={<CheckInPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </div>
  );
}
