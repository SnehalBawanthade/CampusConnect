import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import AuthContext from '../utils/AuthContext';
import { format } from 'date-fns';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const today = new Date();
        const res = await axios.get(`/api/events?date=${format(today, 'yyyy-MM-dd')}`);
        setUpcomingEvents(res.data.slice(0, 3)); // Show only 3 upcoming events
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <p className="user-role">{user?.role === 'club_admin' ? 'Club Admin' : 'Student'}</p>
        {user?.clubName && <p className="club-name">{user.clubName}</p>}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card upcoming-events">
          <h2>Upcoming Events</h2>
          {loading ? (
            <p>Loading events...</p>
          ) : upcomingEvents.length > 0 ? (
            <ul className="event-list">
              {upcomingEvents.map(event => (
                <li key={event._id} className="event-item">
                  <h3>{event.eventName}</h3>
                  <p>{format(new Date(event.date), 'MMM do')} • {event.time}</p>
                  <p>{event.venue}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming events today</p>
          )}
          <Link to="/events-calendar" className="view-all-link">
            View All Events →
          </Link>
        </div>

        {user?.role === 'club_admin' && (
          <div className="dashboard-card admin-actions">
            <h2>Club Admin Tools</h2>
            <Link to="/create-event" className="action-button">
              Create New Event
            </Link>
            <Link to="/manage-events" className="action-button">
              Manage Your Events
            </Link>
          </div>
        )}

        <div className="dashboard-card quick-links">
          <h2>Quick Links</h2>
          <Link to="/events-calendar" className="quick-link">
            Events Calendar
          </Link>
          <Link to="/clubs" className="quick-link">
            Browse Clubs
          </Link>
          {user?.role === 'student' && (
            <Link to="/registered-events" className="quick-link">
              Your Registered Events
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;