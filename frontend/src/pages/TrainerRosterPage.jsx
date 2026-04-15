import { useEffect, useState } from 'react';
import api, { API_ENDPOINTS } from '../services/api';
import StatusMessage from '../components/StatusMessage';

export default function TrainerRosterPage() {
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.trainers);
        setTrainers(response.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to fetch trainer roster.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  return (
    <div className="page">
      <h1>Trainer Roster</h1>
      <StatusMessage type="error">{errorMessage}</StatusMessage>

      {isLoading && <p>Loading trainer roster...</p>}
      {!isLoading && trainers.length === 0 && <p>No trainers/staff found.</p>}

      <div className="grid">
        {trainers.map((trainer) => (
          <div className="card" key={trainer._id}>
            <h3>{trainer.name}</h3>
            <p><strong>Email:</strong> {trainer.email}</p>
            <p><strong>Role:</strong> {trainer.role}</p>
            <p><strong>Specialization:</strong> {trainer.specialization}</p>
            <p><strong>Assigned Classes:</strong> {trainer.assignedClassesCount}</p>
            <p><strong>Schedule:</strong> {trainer.scheduleSummary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
