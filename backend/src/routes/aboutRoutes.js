const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');

router.route('/')
  .get(getAbout)
  .put(updateAbout);

module.exports = router;
