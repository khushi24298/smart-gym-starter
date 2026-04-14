export default function HomePage() {
  return (
    <div className="page">
      <div className="card dashboard-hero">
        <h1>Smart Gym Portal</h1>
        <p>Plan workouts, reserve classes, and manage your gym journey from one place.</p>
      </div>
      <div className="grid">
        <div className="card">
          <h3>Members</h3>
          <p>Login or register to access classes, booking history, and your dashboard.</p>
        </div>
        <div className="card">
          <h3>Staff and Trainers</h3>
          <p>Use your account to view your role-specific navigation options safely.</p>
        </div>
      </div>
    </div>
  );
}
