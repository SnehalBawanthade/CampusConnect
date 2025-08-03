import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    clubName: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { name, email, password, role, clubName } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', {
        name, email, password, role, clubName
      });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">
          <div className="icon-circle">
            <span role="img" aria-label="user" style={{ fontSize: '24px' }}>👥</span>
          </div>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join our community and connect with fellow members</p>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" name="name" value={name} onChange={onChange} required />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" name="email" value={email} onChange={onChange} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" value={password} onChange={onChange} required />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select name="role" value={role} onChange={onChange}>
              <option value="student">Student</option>
              <option value="club_admin">Club Admin</option>
            </select>
          </div>

          {role === 'club_admin' && (
            <div className="input-group">
              <label>Club Name</label>
              <input type="text" name="clubName" value={clubName} onChange={onChange} required />
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button">Create Account</button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
