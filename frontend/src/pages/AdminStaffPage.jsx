import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { API_ENDPOINTS } from '../services/api';
import StatusMessage from '../components/StatusMessage';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'trainer',
  specialization: '',
  membershipStatus: 'active'
};

/**
 * Admin CRUD for staff + trainer accounts (list, add, edit, delete).
 * Public register still only creates members; this screen is the admin path for staff/trainers.
 */
export default function AdminStaffPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const loadList = async () => {
    setLoadingList(true);
    setErrorMessage('');
    try {
      const res = await api.get(API_ENDPOINTS.admin.staff);
      setList(res.data);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not load staff/trainers.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId('');
  };

  const handleEdit = (row) => {
    setEditingId(row._id);
    setForm({
      name: row.name || '',
      email: row.email || '',
      password: '',
      confirmPassword: '',
      role: row.role || 'trainer',
      specialization: row.specialization || '',
      membershipStatus: row.membershipStatus || 'active'
    });
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete account for ${row.name} (${row.email})? This cannot be undone.`)) return;
    setErrorMessage('');
    try {
      await api.delete(API_ENDPOINTS.admin.staffById(row._id));
      setMessage('Account deleted.');
      if (editingId === row._id) resetForm();
      loadList();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!form.name.trim() || !form.email.trim()) {
      setErrorMessage('Name and email are required.');
      return;
    }

    if (editingId) {
      if (form.password && form.password !== form.confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (form.password && form.password.length < 6) {
        setErrorMessage('New password must be at least 6 characters.');
        return;
      }
    } else {
      if (!form.password) {
        setErrorMessage('Password is required for new accounts.');
        return;
      }
      if (form.password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          specialization: form.specialization.trim(),
          membershipStatus: form.membershipStatus
        };
        if (form.password) payload.password = form.password;
        await api.put(API_ENDPOINTS.admin.staffById(editingId), payload);
        setMessage('Account updated.');
        resetForm();
      } else {
        await api.post(API_ENDPOINTS.admin.staff, {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          specialization: form.specialization.trim()
        });
        setMessage('Account created. They can log in at the main login page.');
        resetForm();
      }
      loadList();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1>Manage trainers &amp; staff</h1>
      <p>
        Add, edit, or remove front-desk and trainer logins. Members and admins are not listed here.{' '}
        <Link to="/trainers">Roster view</Link> (includes class assignment summary).
      </p>

      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit account' : 'Add new account'}</h3>
        <div className="grid">
          <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="Full name *" />
          <input className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email *" />
          <select className="input" name="role" value={form.role} onChange={handleChange}>
            <option value="trainer">Trainer</option>
            <option value="staff">Staff</option>
          </select>
          <select className="input" name="membershipStatus" value={form.membershipStatus} onChange={handleChange}>
            <option value="active">Status: active</option>
            <option value="paused">Status: paused</option>
            <option value="expired">Status: expired</option>
          </select>
        </div>
        <input
          className="input"
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          placeholder="Specialization (optional)"
        />
        <label className="label">{editingId ? 'New password (leave blank to keep current)' : 'Password *'}</label>
        <input className="input" type="password" name="password" value={form.password} onChange={handleChange} autoComplete="new-password" />
        <input className="input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" autoComplete="new-password" />
        <div className="row-actions">
          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : editingId ? 'Update account' : 'Create account'}
          </button>
          {editingId && (
            <button type="button" className="button danger" onClick={resetForm}>Cancel edit</button>
          )}
        </div>
      </form>

      <StatusMessage type="success">{message}</StatusMessage>
      <StatusMessage type="error">{errorMessage}</StatusMessage>

      <div className="card table-card">
        <h3>Staff &amp; trainers ({list.length})</h3>
        {loadingList && <p>Loading…</p>}
        {!loadingList && list.length === 0 && <p>No staff or trainer accounts yet.</p>}
        {!loadingList && list.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Specialization</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row._id}>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.role}</td>
                  <td>{row.specialization || '—'}</td>
                  <td><span className={`badge ${row.membershipStatus}`}>{row.membershipStatus}</span></td>
                  <td className="row-actions">
                    <button type="button" className="button" onClick={() => handleEdit(row)}>Edit</button>
                    <button type="button" className="button danger" onClick={() => handleDelete(row)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
