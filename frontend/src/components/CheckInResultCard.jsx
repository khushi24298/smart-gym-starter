export default function CheckInResultCard({ result }) {
  if (!result) return null;

  const membershipStatus = result.member?.membershipStatus || 'unknown';
  const statusClass = result.allowed ? 'success' : membershipStatus === 'active' ? 'warning' : 'error';

  return (
    <div className={`card checkin-result ${statusClass}`}>
      <h3>Validation Result</h3>
      <p><strong>Member:</strong> {result.member?.name || 'Unknown'}</p>
      <p><strong>Membership Status:</strong> <span className={`badge ${membershipStatus}`}>{membershipStatus}</span></p>
      <p><strong>Membership Plan:</strong> {result.member?.planName || 'Not assigned'}</p>
      <p><strong>Validity:</strong> {result.member?.validityInfo || 'Not available'}</p>
      <p><strong>Check-In:</strong> {result.allowed ? 'Allowed' : 'Denied'}</p>
      <p><strong>Reason:</strong> {result.reason}</p>
    </div>
  );
}
