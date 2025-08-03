import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateEvent.css';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    posterImage: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { eventName, description, date, time, venue, posterImage } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const userRes = await axios.get('/api/auth/me', {
        headers: { 'x-auth-token': token }
      });
      
      if (userRes.data.role !== 'club_admin') {
        throw new Error('Only club admins can create events');
      }
      if (!userRes.data.clubName) {
        throw new Error('Club admin account is missing club name');
      }

      const eventData = {
        eventName,
        description,
        date: new Date(date).toISOString(),
        time,
        venue,
        posterImage,
        clubName: userRes.data.clubName
      };

      const res = await axios.post('/api/events', eventData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 
               err.response?.data?.error || 
               err.message || 
               'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-creation-container">
      <h1 className="event-creation-title">Create New Event</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form className="event-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">Event Name</label>
          <input
            className="form-input"
            type="text"
            name="eventName"
            value={eventName}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input form-textarea"
            name="description"
            value={description}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-date-time-group">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              name="date"
              value={date}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Time</label>
            <input
              className="form-input"
              type="time"
              name="time"
              value={time}
              onChange={onChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Venue</label>
          <input
            className="form-input"
            type="text"
            name="venue"
            value={venue}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Poster Image URL</label>
          <input
            className="form-input"
            type="url"
            name="posterImage"
            value={posterImage}
            onChange={onChange}
            required
            placeholder="https://example.com/poster.jpg"
          />
          {posterImage && (
            <div className="poster-preview">
              <img src={posterImage} alt="Event poster preview" />
            </div>
          )}
        </div>
        
        <button 
          className="submit-button" 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;