import { useEffect, useState } from 'react';
import api, { API_ENDPOINTS } from '../services/api';
import StatusMessage from '../components/StatusMessage';

export default function TrainerRosterPage() {
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.trainers);
        setTrainers(res.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to load trainer roster.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <h1>Trainer Roster</h1>
      <StatusMessage type="error">{errorMessage}</StatusMessage>
      {isLoading && <p>Loading...</p>}
      {!isLoading && trainers.length === 0 && <p>No trainers or staff in the system yet.</p>}
      <div className="grid">
        {trainers.map((t) => (
          <div className="card" key={t._id}>
            <h3>{t.name}</h3>
            <p><strong>Email:</strong> {t.email}</p>
            <p><strong>Role:</strong> {t.role}</p>
            <p><strong>Specialization:</strong> {t.specialization}</p>
            <p><strong>Assigned classes:</strong> {t.assignedClassesCount}</p>
            <p><strong>Schedule:</strong> {t.scheduleSummary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
