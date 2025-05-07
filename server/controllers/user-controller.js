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
        console.log('Missing required fields:', {
          username: !body.username,
          email: !body.email,
          password: !body.password
        });
        return res.status(400).json({ 
          message: "All fields are required" 
        });
      }

      // Check if user already exists
      console.log('Checking for existing user...');
      const existingUser = await User.findOne({
        $or: [{ username: body.username }, { email: body.email }]
      });

      if (existingUser) {
        console.log('User already exists:', {
          username: existingUser.username,
          email: existingUser.email
        });
        return res.status(400).json({ 
          message: "User already exists with this username or email" 
        });
      }

      console.log('Creating new user...');
      const user = await User.create(body);

      if (!user) {
        console.log('Failed to create user - no user object returned');
        return res.status(400).json({ message: "Something is wrong!" });
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
        code: error.code
      });
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
