const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String, // e.g., 'Frontend', 'Backend', 'Tools', 'Design'
      required: true,
    },
    icon: {
      type: String, // URL or path to the icon image
      required: false,
      default: '',
    },
    level: {
      type: Number, // Percentage (1 - 100)
      default: 85,
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
