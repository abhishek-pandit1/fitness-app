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
  origin: [
    'https://fitness-app-2.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// Use API routes
app.use("/api", routes);

// Handle React routing in production
if (process.env.NODE_ENV === "production") {
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
