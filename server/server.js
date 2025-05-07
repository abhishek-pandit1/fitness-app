require('dotenv').config({ path: './config.env' });
const express = require("express");
const path = require("path");
const routes = require("./routes");
const db = require("./config/connection");
const cors = require("cors");

const PORT = process.env.PORT || 10000;
const BACKEND_URL = 'https://fitness-app-backend-si9o.onrender.com';
const FRONTEND_URL = 'https://fitness-app-frontend-y8bk.onrender.com';
const app = express();

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self' ${BACKEND_URL} ${FRONTEND_URL}; connect-src 'self' ${BACKEND_URL} ${FRONTEND_URL}; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';`
  );
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "API is working!" });
});

// API routes
app.use("/api", routes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start server
const startServer = async () => {
  try {
    // Wait for database connection
    await new Promise((resolve, reject) => {
      db.once("open", resolve);
      db.on("error", reject);
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Backend URL: ${BACKEND_URL}`);
      console.log(`Frontend URL: ${FRONTEND_URL}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
