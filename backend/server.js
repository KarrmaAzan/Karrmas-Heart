// server.js
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(morgan('dev'));

// Static file serving for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Security middleware
require('./middleware/security')(app);

// API routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/music', require('./routes/musicRoutes'));
app.use('/api/v1/playlists', require('./routes/playlistRoutes'));
app.use('/api/v1/search', require('./routes/searchRoutes'));
app.use('/api/v1/analytics', require('./routes/analyticRoutes'));
app.use('/api/v1/notifications', require('./routes/notificationRoutes'));
app.use('/api/v1/payment', require('./routes/paymentRoutes'));
app.use('/api/v1/artist', require('./routes/artistRoutes'));

// Error handling middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

// 🧠 Use Next.js in production (SSR)
if (process.env.NODE_ENV === 'production') {
  const next = require('next');
  const nextApp = next({ dev: false, dir: path.join(__dirname, '../frontend') });
  const handle = nextApp.getRequestHandler();

  nextApp.prepare().then(() => {
    app.all('*', (req, res) => handle(req, res));

    app.listen(PORT, () => {
      console.log(`Server + Next.js running in production on port ${PORT}`);
    });
  });
} else {
  // Development: just run the backend
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

module.exports = app;
