const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
// Routes
app.use('/api/auth', require('./routes/auth'));
// After other route imports
app.use('/api/events', require('./routes/events'));

// Protected route
app.get('/api/auth/test', require('./middleware/auth'), (req, res) => {
  res.json({ msg: 'Protected route accessed', user: req.user });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Basic route
app.get('/', (req, res) => {
  res.send('CampusConnect API');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));