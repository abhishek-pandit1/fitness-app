require('dotenv').config({ path: './config.env' });
const express = require("express");
const path = require("path");
const routes = require("./routes");
const db = require("./config/connection");
const cors = require("cors");

const PORT = process.env.PORT || 3001;
const app = express();

// Enable CORS with specific options
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Add request logging with more details
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use API routes first
app.use("/api", routes);

// Serve up static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  
  // Handle React routing in production
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Function to start server
const startServer = (port) => {
  try {
    app.listen(port, () => {
      console.log(`API server running on port ${port}!`);
      console.log(`Server URL: https://fitness-app-2.onrender.com`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`CORS enabled for all origins`);
    });
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Error starting server:', error);
    }
  }
};

db.once("open", () => {
  startServer(PORT);
});
