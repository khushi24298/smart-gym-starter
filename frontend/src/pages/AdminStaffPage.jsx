import { useEffect, useState } from 'react';
import api, { API_ENDPOINTS } from '../services/api';
import StatusMessage from '../components/StatusMessage';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'trainer',
  specialization: ''
};

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchStaff = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.admin.staff);
      setStaffList(response.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to load staff and trainers.');
    }
  };

  useEffect(() => {
    fetchStaff();
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
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage('Name and email are required.');
      return;
    }
    if (!editingId && (!formData.password || formData.password.length < 6)) {
      setErrorMessage('Password is required (at least 6 characters) when creating a user.');
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        specialization: formData.specialization.trim()
      };
      if (formData.password.trim()) {
        payload.password = formData.password;
      }
      if (editingId) {
        await api.put(API_ENDPOINTS.admin.staffById(editingId), payload);
        setMessage('User updated successfully.');
      } else {
        await api.post(API_ENDPOINTS.admin.staff, { ...payload, password: formData.password });
        setMessage('User created successfully.');
      }
      resetForm();
      fetchStaff();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to save user.');
    }
  };

  const handleEdit = (row) => {
    setEditingId(row._id);
    setFormData({
      name: row.name || '',
      email: row.email || '',
      password: '',
      role: row.role || 'trainer',
      specialization: row.specialization || ''
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Remove this staff or trainer account?');
    if (!confirmed) return;
    try {
      await api.delete(API_ENDPOINTS.admin.staffById(id));
      setMessage('User removed.');
      if (editingId === id) resetForm();
      fetchStaff();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="page">
      <h1>Trainers &amp; staff</h1>
      <p>Create, edit, or remove trainer and staff accounts. Members register on the public sign-up page.</p>
      <StatusMessage type="info">{message}</StatusMessage>
      <StatusMessage type="error">{errorMessage}</StatusMessage>

      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit account' : 'Add trainer or staff'}</h3>
        <div className="grid">
          <input className="input" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" />
          <input className="input" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <input
            className="input"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={editingId ? 'New password (optional)' : 'Password (min 6 characters)'}
          />
          <select className="input" name="role" value={formData.role} onChange={handleChange}>
            <option value="trainer">Trainer</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <input
          className="input"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          placeholder="Specialization (trainers)"
        />
        <div className="row-actions">
          <button className="button" type="submit">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button className="button danger" type="button" onClick={resetForm}>Cancel edit</button>}
        </div>
      </form>

      <div className="card table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Specialization</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {staffList.map((row) => (
              <tr key={row._id}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>{row.specialization || '—'}</td>
                <td className="row-actions">
                  <button type="button" className="button" onClick={() => handleEdit(row)}>Edit</button>
                  <button type="button" className="button danger" onClick={() => handleDelete(row._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr><td colSpan="5">No staff or trainers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
