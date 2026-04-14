import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    api.get('/classes')
      .then((res) => setClasses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Class Schedule</h1>
      <div className="grid">
        {classes.map((item) => (
          <div className="card" key={item._id}>
            <h3>{item.title}</h3>
            <p>Trainer: {item.trainerName}</p>
            <p>Type: {item.classType}</p>
            <p>{item.day} at {item.time}</p>
            <p>Booked: {item.bookedCount}/{item.capacity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
