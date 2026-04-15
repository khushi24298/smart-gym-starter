import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { API_ENDPOINTS } from '../services/api';
import StatusMessage from '../components/StatusMessage';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    api.get(API_ENDPOINTS.admin.dashboard)
      .then((res) => setStats(res.data))
      .catch((error) => setErrorMessage(error.response?.data?.message || 'Failed to load dashboard.'));
  }, []);

  return (
    <div className="page">
      <h1>Admin Dashboard Reports</h1>
      <StatusMessage type="error">{errorMessage}</StatusMessage>

      <div className="grid">
        <Link className="link-button" to="/admin/classes">Manage Classes</Link>
        <Link className="link-button" to="/admin/plans">Manage Plans</Link>
        <Link className="link-button" to="/attendance">Attendance Actions</Link>
        <Link className="link-button" to="/trainers">Trainer Roster</Link>
      </div>

      {stats ? (
        <>
          <div className="grid">
            <div className="card"><h3>Total Members</h3><p>{stats.totalMembers}</p></div>
            <div className="card"><h3>Active Memberships</h3><p>{stats.activeMemberships}</p></div>
            <div className="card"><h3>Total Classes</h3><p>{stats.totalClasses}</p></div>
            <div className="card"><h3>Total Bookings</h3><p>{stats.totalBookings}</p></div>
            <div className="card"><h3>Today Check-Ins</h3><p>{stats.todayCheckIns}</p></div>
            <div className="card"><h3>No-Show Count</h3><p>{stats.noShowCount}</p></div>
          </div>

          <div className="grid">
            <div className="card">
              <h3>Membership Distribution</h3>
              {stats.membershipDistribution?.length ? stats.membershipDistribution.map((item) => (
                <div key={item.label} className="simple-bar-row">
                  <span>{item.label}</span>
                  <div className="simple-bar-track">
                    <div className="simple-bar-fill" style={{ width: `${Math.min(item.value * 15, 100)}%` }} />
                  </div>
                  <strong>{item.value}</strong>
                </div>
              )) : <p>No membership distribution data.</p>}
            </div>

            <div className="card">
              <h3>Attendance Trend</h3>
              {stats.attendanceTrend?.length ? stats.attendanceTrend.map((item) => (
                <div key={item.label} className="simple-bar-row">
                  <span>{item.label}</span>
                  <div className="trend-pair">
                    <small>Success: {item.success}</small>
                    <small>Failed: {item.failed}</small>
                  </div>
                </div>
              )) : <p>No attendance trend data.</p>}
            </div>
          </div>

          <div className="card">
            <h3>Top Booking Classes</h3>
            {stats.classBookingSummary?.length ? (
              <div className="grid">
                {stats.classBookingSummary.map((item) => (
                  <div className="card" key={item.label}>
                    <p><strong>{item.label}</strong></p>
                    <p>{item.value} bookings</p>
                  </div>
                ))}
              </div>
            ) : <p>No booking summary data.</p>}
          </div>
        </>
      ) : <p>Loading...</p>}
    </div>
  );
}
