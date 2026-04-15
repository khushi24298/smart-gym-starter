import { useEffect, useState } from 'react';
import api, { API_ENDPOINTS } from '../services/api';
import StatusMessage from '../components/StatusMessage';

const initialForm = {
  name: '',
  price: '',
  durationInDays: '',
  description: '',
  status: 'active',
  premiumAccess: false
};

export default function AdminPlansPage() {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchPlans = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.admin.plans);
      setPlans(response.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to fetch plans.');
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setEditingId('');
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setErrorMessage('');
    if (!formData.name || !formData.price || !formData.durationInDays) {
      setErrorMessage('Name, price, and duration (days) are required.');
      return;
    }

    try {
      if (editingId) {
        await api.put(API_ENDPOINTS.admin.planById(editingId), formData);
        setMessage('Plan updated successfully.');
      } else {
        await api.post(API_ENDPOINTS.admin.plans, formData);
        setMessage('Plan created successfully.');
      }
      resetForm();
      fetchPlans();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to save plan.');
    }
  };

  const handleEdit = (plan) => {
    setEditingId(plan._id);
    setFormData({
      name: plan.name || '',
      price: plan.price ?? '',
      durationInDays: plan.durationInDays ?? '',
      description: plan.description || '',
      status: plan.status || 'active',
      premiumAccess: Boolean(plan.premiumAccess)
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this plan?');
    if (!confirmed) return;
    try {
      await api.delete(API_ENDPOINTS.admin.planById(id));
      setMessage('Plan deleted successfully.');
      fetchPlans();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to delete plan.');
    }
  };

  return (
    <div className="page">
      <h1>Admin — Membership Plans</h1>
      <StatusMessage type="info">{message}</StatusMessage>
      <StatusMessage type="error">{errorMessage}</StatusMessage>

      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Plan' : 'Create Plan'}</h3>
        <div className="grid">
          <input className="input" name="name" value={formData.name} onChange={handleChange} placeholder="Plan name *" />
          <input className="input" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price *" />
          <input className="input" name="durationInDays" type="number" value={formData.durationInDays} onChange={handleChange} placeholder="Duration (days) *" />
          <select className="input" name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <textarea className="input textarea" name="description" value={formData.description} onChange={handleChange} placeholder="Features / description" />
        <label className="checkbox-label">
          <input type="checkbox" name="premiumAccess" checked={formData.premiumAccess} onChange={handleChange} />
          Premium access
        </label>
        <div className="row-actions">
          <button className="button" type="submit">{editingId ? 'Update Plan' : 'Create Plan'}</button>
          {editingId && <button className="button danger" type="button" onClick={resetForm}>Cancel Edit</button>}
        </div>
      </form>

      <div className="card table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Premium</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan._id}>
                <td>{plan.name}</td>
                <td>${plan.price}</td>
                <td>{plan.durationInDays} days</td>
                <td><span className={`badge ${plan.status}`}>{plan.status}</span></td>
                <td>{plan.premiumAccess ? 'Yes' : 'No'}</td>
                <td className="row-actions">
                  <button type="button" className="button" onClick={() => handleEdit(plan)}>Edit</button>
                  <button type="button" className="button danger" onClick={() => handleDelete(plan._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {plans.length === 0 && <tr><td colSpan="6">No plans yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
