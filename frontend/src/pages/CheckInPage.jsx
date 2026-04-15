import { useState } from 'react';
import api, { API_ENDPOINTS } from '../services/api';
import StatusMessage from '../components/StatusMessage';
import CheckInResultCard from '../components/CheckInResultCard';

export default function CheckInPage() {
  const [memberCode, setMemberCode] = useState('');
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleValidate = async () => {
    if (!memberCode.trim()) {
      setMessage('Enter the scanned code, member email, or member ID from their profile.');
      return;
    }
    setIsSubmitting(true);
    setMessage('');
    setResult(null);
    try {
      const res = await api.post(API_ENDPOINTS.checkins.validate, { memberCode });
      setResult(res.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Validation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page page-narrow">
      <h1>QR Check-In Scanner</h1>
      <p>
        Scan the member's QR code with a reader if available, or paste the code from the scan.
        You can also look them up by <strong>email</strong> or by the <strong>member ID</strong> shown in their account or admin roster.
      </p>

      <div className="card">
        <label className="label">QR / member code, email, or member ID</label>
        <input
          className="input"
          value={memberCode}
          onChange={(e) => setMemberCode(e.target.value)}
          placeholder="e.g. member1@smartgym.com or pasted QR text"
        />
        <button type="button" className="button" onClick={handleValidate} disabled={isSubmitting}>
          {isSubmitting ? 'Checking…' : 'Validate check-in'}
        </button>
      </div>

      <StatusMessage type="error">{message}</StatusMessage>
      <CheckInResultCard result={result} />
    </div>
  );
}
