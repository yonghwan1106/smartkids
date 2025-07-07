require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const childrenRoutes = require('./routes/childrenRoutes');
const healthRoutes = require('./routes/healthRoutes');
const learningRoutes = require('./routes/learningRoutes');
const mealRoutes = require('./routes/mealRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://smartkids-po0eyvim6-yongparks-projects.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/settings', settingsRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('SmartKids Backend API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
