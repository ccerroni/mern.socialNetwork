const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// @route   GET api/users
// @desc    Test route
// @access  Puplic
router.get('/', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.send('User route');
});

// @route   Post api/users
// @desc    Register user
// @access  Puplic
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is requided').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is requided').not().isEmpty(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      res.send('User Registered');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
    const salt = await bcrypt.genSalt(10);
    const avatar = gravatar.url(email, { s: 200, r: 'pg', d: 'mm' });

    user = new User({
      name,
      email,
      avatar,
      password
    });
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    // return jsonwebtoken
    res.send('User Registered');
  }
);

module.exports = router;
