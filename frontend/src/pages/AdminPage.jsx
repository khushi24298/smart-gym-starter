import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { API_ENDPOINTS } from '../services/api';
import StatusMessage from '../components/StatusMessage';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    api
      .get(API_ENDPOINTS.admin.dashboard)
      .then((res) => setStats(res.data))
      .catch((error) => setErrorMessage(error.response?.data?.message || 'Failed to load dashboard.'));
  }, []);

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <StatusMessage type="error">{errorMessage}</StatusMessage>

      <div className="grid">
        <Link className="link-button" to="/admin/classes">Manage classes</Link>
        <Link className="link-button" to="/admin/plans">Membership plans</Link>
        <Link className="link-button" to="/attendance">Attendance</Link>
        <Link className="link-button" to="/admin/staff">Trainers &amp; staff</Link>
        <Link className="link-button" to="/checkin">Check-in</Link>
      </div>

      {stats ? (
        <>
          <div className="grid">
            <div className="card"><h3>Total members</h3><p>{stats.totalMembers}</p></div>
            <div className="card"><h3>Active memberships</h3><p>{stats.activeMemberships}</p></div>
            <div className="card"><h3>Total classes</h3><p>{stats.totalClasses}</p></div>
            <div className="card"><h3>Total bookings</h3><p>{stats.totalBookings}</p></div>
            <div className="card"><h3>Today check-ins</h3><p>{stats.todayCheckIns}</p></div>
            <div className="card"><h3>No-shows</h3><p>{stats.noShowCount}</p></div>
            <div className="card"><h3>Successful check-ins (all time)</h3><p>{stats.totalCheckIns}</p></div>
            <div className="card"><h3>Failed check-ins</h3><p>{stats.failedCheckIns}</p></div>
          </div>

          <div className="grid">
            <div className="card">
              <h3>Membership distribution</h3>
              {stats.membershipDistribution?.length ? (
                stats.membershipDistribution.map((row) => (
                  <div key={row.label} className="simple-bar-row">
                    <span>{row.label}</span>
                    <div className="simple-bar-track">
                      <div className="simple-bar-fill" style={{ width: `${Math.min(row.value * 12, 100)}%` }} />
                    </div>
                    <strong>{row.value}</strong>
                  </div>
                ))
              ) : (
                <p>No data.</p>
              )}
            </div>
            <div className="card">
              <h3>Recent check-in trend</h3>
              {stats.attendanceTrend?.length ? (
                stats.attendanceTrend.map((row) => (
                  <div key={row.label} className="simple-bar-row">
                    <span>{row.label}</span>
                    <div className="trend-pair">
                      <small>OK {row.success}</small>
                      <small>Fail {row.failed}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p>No data.</p>
              )}
            </div>
          </div>

          <div className="card">
            <h3>Top classes by bookings</h3>
            {stats.classBookingSummary?.length ? (
              <div className="grid">
                {stats.classBookingSummary.map((row) => (
                  <div className="card" key={row.label}>
                    <strong>{row.label}</strong>
                    <p>{row.value} bookings</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No data.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading…</p>
      )}
    </div>
  );
}
