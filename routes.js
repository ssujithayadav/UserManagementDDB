// routes.js
const express = require('express');
const router = express.Router();
const {User, passwordSchema} = require('./user');
const { verifyToken, generateToken } = require('./auth');
const jwt = require('jsonwebtoken');


router.post('/signup', async (req, res) => {
  
    const { username, email, password } = req.body;

    try {
      
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(409).json({ message: 'Username or email already exists' });
      }
  
      
      if (!passwordSchema.validate(password)) {
        return res.status(400).json({ message: 'Password doesnt meet required criteria, Please choose a strong password' });
      }
  
    
      const user = new User({ username, email, password });
      await user.save();
      const token = generateToken(user._id);
    // user.tokens.push(token);
    await user.save();

    res.json({ token, message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

router.post('/signin', async (req, res) => {
  

  const { username, password } = req.body;

  try {
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

   
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    // user.tokens.push(token);
    // await user.save();

    res.json({ token, message: 'User authenticated successfully' });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

router.delete('/users/me', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
      
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        res.json({ message: 'User deleted successfully' });
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
});



router.post('/logout', verifyToken, async (req, res) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Remove the token from the user's tokens array
    //   user.tokens = user.tokens.filter(token => token !== req.token);
    //   await user.save();
  
      res.json({ message: 'User logged out successfully' });
    } catch (error) {
      console.error('Error logging out user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
