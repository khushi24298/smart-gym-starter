import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { API_ENDPOINTS } from '../services/api';
import StatusMessage from '../components/StatusMessage';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
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
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      };
      await api.post(API_ENDPOINTS.auth.register, payload);
      navigate('/', {
        state: { successMessage: 'Registration successful. Please login.' }
      });
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-hero register-hero">
        <div className="auth-overlay" />
        <div className="auth-hero-content">
          <h2>Build Your Fitness Routine</h2>
          <p>Create your account and start booking classes that match your goals.</p>
        </div>
      </div>

      <div className="auth-wrapper">
        <h1>Member Registration</h1>
        <p className="auth-subtitle">Join Smart Gym and manage your training journey.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Name</label>
          <input className="input" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" />
          <StatusMessage type="error">{errors.name}</StatusMessage>

          <label>Email</label>
          <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
          <StatusMessage type="error">{errors.email}</StatusMessage>

          <label>Password</label>
          <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" />
          <StatusMessage type="error">{errors.password}</StatusMessage>

          <label>Confirm Password</label>
          <input className="input" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" />
          <StatusMessage type="error">{errors.confirmPassword}</StatusMessage>

          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <StatusMessage type="error">{submitMessage}</StatusMessage>
        <p>Already have an account? <Link to="/">Go to login</Link></p>
      </div>
    </div>
  );
}
