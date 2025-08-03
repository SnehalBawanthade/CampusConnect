import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">👤</div>
          <h1 className="login-title">Sign In</h1>
          <p className="login-subtitle">Welcome back! Enter your credentials.</p>
        </div>
        
        <form className="login-form" onSubmit={onSubmit}>
          <div className="input-group">
            <input
              className="login-input"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder=" "
              required
            />
            <label className="input-label">Email Address</label>
          </div>
          
          <div className="input-group">
            <input
              className="login-input"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder=" "
              required
            />
            <label className="input-label">Password</label>
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button className="login-button" type="submit">Sign In</button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
