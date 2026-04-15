import { useEffect, useState } from 'react';
import api, { API_ENDPOINTS } from '../services/api';
import StatusMessage from '../components/StatusMessage';

const initialForm = {
  title: '',
  trainerName: '',
  classType: 'General',
  day: '',
  time: '',
  capacity: 20,
  description: ''
};

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchClasses = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.admin.classes);
      setClasses(response.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to fetch classes.');
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setErrorMessage('');
    if (!formData.title || !formData.trainerName || !formData.day || !formData.time) {
      setErrorMessage('Please fill required class fields (name, trainer, day, time).');
      return;
    }

    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity) || 20
      };
      if (editingId) {
        await api.put(API_ENDPOINTS.admin.classById(editingId), payload);
        setMessage('Class updated successfully.');
      } else {
        await api.post(API_ENDPOINTS.admin.classes, payload);
        setMessage('Class created successfully.');
      }
      resetForm();
      fetchClasses();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to save class.');
    }
  };

  const handleEdit = (gymClass) => {
    setEditingId(gymClass._id);
    setFormData({
      title: gymClass.title || '',
      trainerName: gymClass.trainerName || '',
      classType: gymClass.classType || 'General',
      day: gymClass.day || '',
      time: gymClass.time || '',
      capacity: gymClass.capacity ?? 20,
      description: gymClass.description || ''
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this class?');
    if (!confirmed) return;
    try {
      await api.delete(API_ENDPOINTS.admin.classById(id));
      setMessage('Class deleted successfully.');
      fetchClasses();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to delete class.');
    }
  };

  return (
    <div className="page">
      <h1>Admin — Class Management</h1>
      <StatusMessage type="info">{message}</StatusMessage>
      <StatusMessage type="error">{errorMessage}</StatusMessage>

      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Class' : 'Create New Class'}</h3>
        <div className="grid">
          <input className="input" name="title" value={formData.title} onChange={handleChange} placeholder="Class name *" />
          <input className="input" name="trainerName" value={formData.trainerName} onChange={handleChange} placeholder="Trainer name *" />
          <input className="input" name="classType" value={formData.classType} onChange={handleChange} placeholder="Class type" />
          <input className="input" name="day" value={formData.day} onChange={handleChange} placeholder="Day / date *" />
          <input className="input" name="time" value={formData.time} onChange={handleChange} placeholder="Time *" />
          <input className="input" name="capacity" type="number" value={formData.capacity} onChange={handleChange} placeholder="Capacity" />
        </div>
        <textarea className="input textarea" name="description" value={formData.description} onChange={handleChange} placeholder="Description (optional)" />
        <div className="row-actions">
          <button className="button" type="submit">{editingId ? 'Update Class' : 'Create Class'}</button>
          {editingId && (
            <button className="button danger" type="button" onClick={resetForm}>Cancel Edit</button>
          )}
        </div>
      </form>

      <div className="card table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Trainer</th>
              <th>Day</th>
              <th>Time</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.trainerName}</td>
                <td>{item.day}</td>
                <td>{item.time}</td>
                <td>{item.capacity}</td>
                <td className="row-actions">
                  <button type="button" className="button" onClick={() => handleEdit(item)}>Edit</button>
                  <button type="button" className="button danger" onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr><td colSpan="6">No classes yet. Create one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
