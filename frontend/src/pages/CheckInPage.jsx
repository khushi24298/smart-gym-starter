import { useState } from 'react';
import api, { API_ENDPOINTS } from '../services/api';
import StatusMessage from '../components/StatusMessage';
import CheckInResultCard from '../components/CheckInResultCard';

export default function CheckInPage() {
  const [memberCode, setMemberCode] = useState('');
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckIn = async () => {
    if (!memberCode.trim()) {
      setMessage('Please enter member ID or email code.');
      return;
    }
    setIsSubmitting(true);
    setMessage('');
    try {
      const res = await api.post(API_ENDPOINTS.checkins.validate, { memberCode });
      setResult(res.data);
    } catch (error) {
      setResult(null);
      setMessage(error.response?.data?.message || 'Check-in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page page-narrow">
      <h1>QR Check-In Scanner</h1>
      <p>Scan QR/member code (simulated input) or enter member email/ID manually.</p>

      <div className="card">
        <label className="label">Member QR Code / Member ID / Email</label>
        <input
          className="input"
          placeholder="Example: member1@smartgym.com or member ObjectId"
          value={memberCode}
          onChange={(e) => setMemberCode(e.target.value)}
        />
        <button className="button" onClick={handleCheckIn} disabled={isSubmitting}>
          {isSubmitting ? 'Validating...' : 'Validate Check-In'}
        </button>
      </div>

      <StatusMessage type="error">{message}</StatusMessage>
      <CheckInResultCard result={result} />

      <div className="card">
        <h3>Demo Tips</h3>
        <p>Use seeded member account email as scanner value for quick classroom demo.</p>
      </div>
    </div>
  );
}
