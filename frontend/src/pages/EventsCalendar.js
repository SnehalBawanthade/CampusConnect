import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './EventsCalendar.css';

const EventsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventsForDate(selectedDate);
  }, [selectedDate]);

  const fetchEventsForDate = async (date) => {
    try {
      setLoading(true);
      setError('');
      
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await axios.get(`/api/events?date=${formattedDate}`);
      
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="events-calendar-container">
      {/* Calendar Section (Left) */}
      <div className="calendar-section">
        <h2 className="calendar-header">Event Calendar</h2>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="react-calendar"
        />
      </div>

      {/* Events List Section (Right) */}
      <div className="events-section">
        <h2 className="events-header">Events on {format(selectedDate, 'MMMM d, yyyy')}</h2>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <p className="loading-message">Loading events...</p>
        ) : events.length > 0 ? (
          <div className="events-list">
            {events.map(event => (
              <div key={event._id} className="event-card">
                <h3 className="event-title">{event.eventName}</h3>
                <p className="event-detail"><strong>Club:</strong> {event.clubName}</p>
                <p className="event-detail"><strong>Time:</strong> {event.time}</p>
                <p className="event-detail"><strong>Venue:</strong> {event.venue}</p>
                <p className="event-detail">{event.description}</p>
                {event.posterImage && (
                  <img 
                    src={event.posterImage} 
                    alt="Event poster" 
                    className="event-poster"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">No events scheduled for this date.</p>
        )}
      </div>
    </div>
  );
};

export default EventsCalendar;