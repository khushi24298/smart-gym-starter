import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {stats ? (
        <div className="grid">
          <div className="card"><h3>Total Bookings</h3><p>{stats.totalBookings}</p></div>
          <div className="card"><h3>Successful Check-Ins</h3><p>{stats.totalCheckIns}</p></div>
          <div className="card"><h3>Failed Check-Ins</h3><p>{stats.failedCheckIns}</p></div>
        </div>
      ) : <p>Loading...</p>}
    </div>
  );
}
