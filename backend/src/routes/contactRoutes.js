const express = require('express');
const router = express.Router();
const { submitContact, getContacts, deleteContact } = require('../controllers/contactController');

router.route('/').post(submitContact).get(getContacts);
router.route('/:id').delete(deleteContact);

module.exports = router;
