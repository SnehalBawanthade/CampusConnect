import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CreateEvent from './pages/CreateEvent';
import EventsCalendar from './pages/EventsCalendar';
import Navbar from './components/Navbar';

// In your routes
<Route path="/events-calendar" element={<EventsCalendar />} />

function App() {
  return (
    <Router>
         <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events-calendar" element={<EventsCalendar />} />
      </Routes>
    </Router>
  );
}

export default App;