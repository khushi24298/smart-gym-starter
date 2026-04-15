import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api, { API_ENDPOINTS } from '../services/api';
import StatusMessage from '../components/StatusMessage';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitMessage('');
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(API_ENDPOINTS.auth.login, formData);
      const loggedInUser = response.data.user;
      login(loggedInUser);

      // Route users to their primary area based on role.
      if (loggedInUser.role === 'admin') navigate('/admin');
      else if (loggedInUser.role === 'member') navigate('/member/dashboard');
      else if (loggedInUser.role === 'staff' || loggedInUser.role === 'trainer') navigate('/checkin');
      else navigate('/');
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-hero">
        <div className="auth-overlay" />
        <div className="auth-hero-content">
          <h2>Train Strong at Smart Gym</h2>
          <p>Track your sessions, book classes, and stay consistent every week.</p>
        </div>
      </div>

      <div className="auth-wrapper">
        <h1>Member Login</h1>
        <p className="auth-subtitle">Welcome back. Let’s get your workout started.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email</label>
          <input
            className="input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <StatusMessage type="error">{errors.email}</StatusMessage>

          <label>Password</label>
          <input
            className="input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <StatusMessage type="error">{errors.password}</StatusMessage>

          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <StatusMessage type="success">{location.state?.successMessage}</StatusMessage>
        <StatusMessage type="error">{submitMessage}</StatusMessage>
        <p>New member? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}
