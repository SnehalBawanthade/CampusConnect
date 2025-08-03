const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');

// @route   POST /api/events
// @desc    Create an event with poster image
router.post('/', auth, async (req, res) => {
  console.log('Event creation request received:', req.body);
  
  try {
    // 1. Verify user exists and is club admin
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role !== 'club_admin') {
      console.error('Non-admin user attempted to create event:', user.email);
      return res.status(403).json({ error: 'Only club admins can create events' });
    }

    // 2. Validate required fields
    const { eventName, description, date, time, venue, posterImage } = req.body;
    const missingFields = [];
    if (!eventName) missingFields.push('eventName');
    if (!description) missingFields.push('description');
    if (!date) missingFields.push('date');
    if (!time) missingFields.push('time');
    if (!venue) missingFields.push('venue');
    if (!posterImage) missingFields.push('posterImage');
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: 'All fields are required',
        missingFields 
      });
    }

    // 3. Create and save event
    const newEvent = new Event({
      clubName: user.clubName,
      eventName,
      description,
      date: new Date(date),
      time,
      venue,
      posterImage,
      postedBy: user._id
    });

    console.log('Saving new event with poster:', newEvent);
    const savedEvent = await newEvent.save();
    
    console.log('Event created successfully:', savedEvent);
    res.status(201).json(savedEvent);

  } catch (err) {
    console.error('Error creating event:', err);
    
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors 
      });
    }
    
    res.status(500).json({ 
      error: 'Server error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

// @route   GET /api/events
// @desc    Get events, optionally filtered by date
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log("Received request for date:", req.query.date);
    
    const { date } = req.query;
    let query = {};
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query.date = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const events = await Event.find(query);
    console.log(`Found ${events.length} events`);
    res.json(events);
    
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;