import { useState } from 'react';
import api from '../services/api';

export default function CheckInPage() {
  const [memberId, setMemberId] = useState('');
  const [result, setResult] = useState(null);

  const handleCheckIn = async () => {
    try {
      const res = await api.post('/checkins', { memberId });
      setResult(res.data);
    } catch (error) {
      setResult({ reason: error.response?.data?.message || 'Check-in failed' });
    }
  };

  return (
    <div>
      <h1>QR Check-In Simulator</h1>
      <input
        className="input"
        placeholder="Enter member id"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
      />
      <button className="button" onClick={handleCheckIn}>Check In</button>
      {result && <p className="result">{result.reason}</p>}
    </div>
  );
}
