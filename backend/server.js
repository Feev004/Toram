require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { testConnection } = require('./config/db');

const itemsRouter = require('./routes/items');
const bossesRouter = require('./routes/bosses');
const recipesRouter = require('./routes/recipes');
const mapsRouter = require('./routes/maps');
const elementsRouter = require('./routes/elements');
const crystasRouter = require('./routes/crystas');
const queryRouter = require('./routes/query');
const { router: devopsRouter } = require('./routes/devops');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api/items', itemsRouter);
app.use('/api/crystas', crystasRouter);
app.use('/api/bosses', bossesRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/maps', mapsRouter);
app.use('/api/elements', elementsRouter);
app.use('/api/query', queryRouter);
app.use('/api/devops', devopsRouter);

// Root Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Toram Online Database Backend API',
    version: '1.0.0',
    db: process.env.DB_NAME || 'toram',
    time: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
async function startServer() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(` Toram Backend API running on port ${PORT}`);
    console.log(` Endpoint: http://localhost:${PORT}/api/health`);
    console.log(` Database: ${process.env.DB_NAME || 'toram'}`);
    console.log(`========================================`);
  });
}

startServer();
