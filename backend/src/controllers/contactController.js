const Contact = require('../models/Contact');

// @desc    Submit a contact form
// @route   POST /api/contacts
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const contact = new Contact({
      name,
      email,
      message,
    });

    const createdContact = await contact.save();
    res.status(201).json({ message: 'Message sent successfully', contact: createdContact });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Public (should be protected in production)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contacts/:id
// @access  Public
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      await contact.deleteOne();
      res.json({ message: 'Contact message removed' });
    } else {
      res.status(404).json({ message: 'Contact message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitContact,
  getContacts,
  deleteContact,
};
