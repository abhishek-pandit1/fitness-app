# Fitness Tracker Application

A full-stack fitness tracking application that allows users to log and track their cardio and resistance training exercises.

## Features

- User authentication (signup/login)
- Track cardio exercises
- Track resistance training
- View exercise history
- Calculate calories burned
- Responsive design for all devices

## Tech Stack

### Frontend
- React.js
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Project Structure

```
fitness-tracker/
├── client/                 # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/     # React components
│       ├── pages/         # Page components
│       ├── utils/         # Utility functions and API calls
│       └── assets/        # Images and other static files
│
└── server/                # Backend Node.js application
    ├── config/           # Configuration files
    ├── models/          # Database models
    ├── routes/          # API routes
    └── utils/           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repository-url>
cd fitness-tracker
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables

Create a `.env` file in the server directory:
```
PORT=3001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Create a `.env` file in the client directory:
```
REACT_APP_API_URL=http://localhost:3001
```

4. Start the application

```bash
# Start the server (from server directory)
npm start

# Start the client (from client directory)
npm start
```

## API Endpoints

### User Routes
- POST `/api/user` - Create new user
- POST `/api/user/login` - User login
- GET `/api/user/me` - Get user data

### Exercise Routes
- POST `/api/exercise/cardio` - Create cardio exercise
- POST `/api/exercise/resistance` - Create resistance exercise
- GET `/api/exercise/cardio/:id` - Get cardio exercise by ID
- GET `/api/exercise/resistance/:id` - Get resistance exercise by ID
- DELETE `/api/exercise/cardio/:id` - Delete cardio exercise
- DELETE `/api/exercise/resistance/:id` - Delete resistance exercise

## Deployment

The application can be deployed on platforms like:
- Frontend: Vercel, Netlify, or GitHub Pages
- Backend: Render, Heroku, or Railway
- Database: MongoDB Atlas

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## Contact

Your Name - abhishek pandit
Email - coderabhishek1@gmail.com
