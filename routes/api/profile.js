const express = require('express');
const router = express.Router();

// @route   GET api/profile
// @desc    Test route
// @access  Puplic
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;
