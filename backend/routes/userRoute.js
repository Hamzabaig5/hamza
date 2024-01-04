const express = require('express');
const router = express.Router();
const NotificationService = require('../services/NotificationService');
const User = require('../models/user');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({ name, email, password });
    const user = await newUser.save();
    // NotificationService.sendEmail(
    //   user.email,
    //   'Welcome',
    //   'You are welcome to Mern Hotel Management'
    // );
    res.send('User Registered Successfully');
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the credentials match any user in the database
    const user = await User.findOne({ email: email });

    if (user) {
      // If the credentials match a user in the database, check the password
      if (password === user.password) {
        const temp = {
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          _id: user._id,
        };
        return res.send(temp);
      }
    }

    // If the credentials don't match any user, check the hardcoded admin user
    const hardcodedAdmin = {
      email: 'admin@example.com',
      password: 'adminpassword', // Set the password for the hardcoded admin user
      name: 'Admin',
      isAdmin: true,
    };

    if (password === hardcodedAdmin.password && email === hardcodedAdmin.email) {
      const temp = {
        name: hardcodedAdmin.name,
        email: hardcodedAdmin.email,
        isAdmin: hardcodedAdmin.isAdmin,
        _id: 'admin', // You can set a specific _id for the admin user
      };
      return res.send(temp);
    }

    // If neither the database user nor the hardcoded admin match, return login failed
    return res.status(400).json({ message: 'Login Failed' });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post('/getallusers', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post('/updateprofile', async (req, res) => {
  console.log('IN update ');
  const { name, email, userId } = req.body;
  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      user.name = name;
      user.email = email;
      const updatedUser = await user.save();
      res.send(updatedUser);
    } else {
      res.status(400).send('User not found');
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
