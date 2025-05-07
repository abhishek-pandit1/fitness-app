const { User } = require("../models");
const { signToken } = require("../utils/auth");

module.exports = {
  // get a single user by id or username
  async getSingleUser({ user = null, params }, res) {
    const foundUser = await User.findOne({
      $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
    })
      .select("-__v")
      .populate("cardio")
      .populate("resistance")

    if (!foundUser) {
      return res.status(400).json({ message: 'Cannot find a user with this id!' });
    }

    res.json(foundUser);
  },

  // create a user, sign a token, and send it back to sign up page
  async createUser({ body }, res) {
    try {
      console.log('Received signup request with data:', { 
        username: body.username,
        email: body.email,
        password: '[REDACTED]'
      });

      // Validate required fields
      if (!body.username || !body.email || !body.password) {
        const missingFields = [];
        if (!body.username) missingFields.push('username');
        if (!body.email) missingFields.push('email');
        if (!body.password) missingFields.push('password');
        
        console.log('Missing required fields:', missingFields);
        return res.status(400).json({ 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        console.log('Invalid email format:', body.email);
        return res.status(400).json({ 
          message: "Invalid email format" 
        });
      }

      // Validate password length
      if (body.password.length < 6) {
        console.log('Password too short');
        return res.status(400).json({ 
          message: "Password must be at least 6 characters long" 
        });
      }

      // Check if user already exists
      console.log('Checking for existing user...');
      const existingUser = await User.findOne({
        $or: [{ username: body.username }, { email: body.email }]
      });

      if (existingUser) {
        const field = existingUser.username === body.username ? 'username' : 'email';
        console.log(`User already exists with this ${field}:`, {
          username: existingUser.username,
          email: existingUser.email
        });
        return res.status(400).json({ 
          message: `User already exists with this ${field}` 
        });
      }

      console.log('Creating new user...');
      const user = await User.create(body);

      if (!user) {
        console.log('Failed to create user - no user object returned');
        return res.status(400).json({ message: "Failed to create user" });
      }

      console.log('User created successfully:', {
        id: user._id,
        username: user.username,
        email: user.email
      });

      const token = signToken(user);
      res.json({ token, user });
    } catch (error) {
      console.error('Error creating user:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Handle specific MongoDB errors
      if (error.code === 11000) {
        return res.status(400).json({ 
          message: "Username or email already exists" 
        });
      }
      
      res.status(500).json({ 
        message: "Error creating user",
        error: error.message 
      });
    }
  },

  // login a user, sign a token, and send it back to login page
  async login({ body }, res) {
    try {
      const user = await User.findOne({
        $or: [{ username: body.username }, { email: body.email }],
      });
      
      if (!user) {
        return res.status(400).json({ message: "Can't find this user" });
      }

      const correctPw = await user.isCorrectPassword(body.password);

      if (!correctPw) {
        return res.status(400).json({ message: "Wrong password!" });
      }
      
      const token = signToken(user);
      res.json({ token, user });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ 
        message: "Error logging in",
        error: error.message 
      });
    }
  },
};
