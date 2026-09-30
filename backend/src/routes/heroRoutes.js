const express = require('express');
const router = express.Router();
const { getHero, updateHero } = require('../controllers/heroController');

router.route('/')
  .get(getHero)
  .put(updateHero);

module.exports = router;
